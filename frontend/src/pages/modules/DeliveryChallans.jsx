import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, IconButton, Alert, MenuItem, Tooltip,
    Divider, Chip
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import api from "../../services/api";

const emptyItem = { product_id: "", quantity: 1 };
const empty = {
    challan_date: new Date().toISOString().split("T")[0],
    customer_id: "", logistics_booking_id: "", delivery_address: "",
    items: [{ ...emptyItem }],
};

export default function DeliveryChallans() {
    const [rows, setRows] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const load = async () => {
        try {
            const [c, cu, b, p] = await Promise.all([
                api.get("/delivery-challans"),
                api.get("/customers"),
                api.get("/logistics-bookings"),
                api.get("/products"),
            ]);
            setRows(c.data);
            setCustomers(cu.data);
            setBookings(b.data);
            setProducts(p.data);
        } catch { setError("Failed to load data"); }
    };

    useEffect(() => { load(); }, []);

    const handleOpen = (row = null) => {
        setEditing(row);
        setForm(row ? {
            challan_date: row.challan_date,
            customer_id: row.customer_id || "",
            logistics_booking_id: row.logistics_booking_id || "",
            delivery_address: row.delivery_address || "",
            items: row.items?.length ? row.items.map(i => ({ product_id: i.product_id, quantity: i.quantity })) : [{ ...emptyItem }],
        } : { ...empty, items: [{ ...emptyItem }] });
        setError("");
        setOpen(true);
    };

    const addItem = () => setForm(p => ({ ...p, items: [...p.items, { ...emptyItem }] }));
    const removeItem = (idx) => setForm(p => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
    const updateItem = (idx, field, val) => setForm(p => {
        const items = [...p.items];
        items[idx] = { ...items[idx], [field]: val };
        return { ...p, items };
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                ...form,
                logistics_booking_id: form.logistics_booking_id || null,
            };
            if (editing) {
                await api.put(`/delivery-challans/${editing.id}`, payload);
            } else {
                await api.post("/delivery-challans", payload);
            }
            setOpen(false);
            load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed");
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this challan?")) return;
        try { await api.delete(`/delivery-challans/${id}`); load(); }
        catch { setError("Delete failed"); }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Challan Out (Delivery Challans)</Typography>
                    <Typography variant="body2" color="text.secondary">Create delivery documents for dispatched goods</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>New Challan</Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "action.hover" }}>
                            {["Challan No", "Date", "Customer", "Booking Ref", "Items", "Actions"].map(h => (
                                <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>No challans yet.</TableCell></TableRow>
                        ) : rows.map(row => (
                            <TableRow key={row.id} hover>
                                <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>{row.challan_no}</TableCell>
                                <TableCell>{row.challan_date}</TableCell>
                                <TableCell>{row.customer?.name || "—"}</TableCell>
                                <TableCell>{row.booking?.booking_no || "—"}</TableCell>
                                <TableCell>
                                    <Chip label={`${row.items?.length || 0} item(s)`} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpen(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editing ? "Edit Challan" : "New Delivery Challan"}</DialogTitle>
                <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        <TextField
                            label="Challan Date *" type="date" value={form.challan_date}
                            onChange={e => setForm(p => ({ ...p, challan_date: e.target.value }))}
                            size="small" InputLabelProps={{ shrink: true }}
                        />
                        <TextField select label="Customer *" value={form.customer_id}
                            onChange={e => setForm(p => ({ ...p, customer_id: e.target.value }))} size="small">
                            {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                        </TextField>
                    </Box>
                    <TextField select label="Transport Booking (optional)" value={form.logistics_booking_id}
                        onChange={e => setForm(p => ({ ...p, logistics_booking_id: e.target.value }))} fullWidth size="small">
                        <MenuItem value="">— None —</MenuItem>
                        {bookings.map(b => <MenuItem key={b.id} value={b.id}>{b.booking_no} — {b.transporter?.name}</MenuItem>)}
                    </TextField>
                    <TextField label="Delivery Address" value={form.delivery_address}
                        onChange={e => setForm(p => ({ ...p, delivery_address: e.target.value }))}
                        fullWidth size="small" multiline rows={2} />

                    <Divider />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontWeight={600}>Items</Typography>
                        <Button size="small" startIcon={<AddIcon />} onClick={addItem}>Add Item</Button>
                    </Box>
                    {form.items.map((item, idx) => (
                        <Box key={idx} sx={{ display: "grid", gridTemplateColumns: "1fr 120px 40px", gap: 1, alignItems: "center" }}>
                            <TextField select label="Product *" value={item.product_id}
                                onChange={e => updateItem(idx, "product_id", e.target.value)} size="small">
                                {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                            </TextField>
                            <TextField label="Quantity *" type="number" value={item.quantity}
                                onChange={e => updateItem(idx, "quantity", e.target.value)} size="small" inputProps={{ min: 1 }} />
                            <IconButton size="small" color="error" onClick={() => removeItem(idx)} disabled={form.items.length === 1}>
                                <RemoveIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : editing ? "Update Challan" : "Create Challan"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
