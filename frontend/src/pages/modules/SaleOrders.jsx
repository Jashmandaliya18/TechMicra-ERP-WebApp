import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel, Chip, Divider,
    useTheme, alpha, Alert, Tooltip
} from "@mui/material";
import { Add, Edit, Delete, AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { getSaleOrders, createSaleOrder, updateSaleOrder, deleteSaleOrder, getCustomers, getProducts } from "../../services/api";

const STATUS_COLORS = { Pending: "warning", Dispatched: "info", Closed: "success" };
const EMPTY_ITEM = { product_id: "", quantity: 1, rate: "" };

export default function SaleOrders() {
    const [rows, setRows] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        customer_id: "", customer_po_ref: "", billing_address: "", shipping_address: "",
        status: "Pending", items: [{ ...EMPTY_ITEM }]
    });
    const theme = useTheme();

    const load = async () => {
        try {
            const [so, cust, prod] = await Promise.all([getSaleOrders(), getCustomers(), getProducts()]);
            setRows(so.data); setCustomers(cust.data); setProducts(prod.data);
        } catch { setError("Failed to load data."); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => {
        setForm({ customer_id: "", customer_po_ref: "", billing_address: "", shipping_address: "", status: "Pending", items: [{ ...EMPTY_ITEM }] });
        setEditing(null); setOpen(true); setError("");
    };
    const openEdit = (row) => {
        setForm({ customer_id: row.customer_id, customer_po_ref: row.customer_po_ref || "", billing_address: row.billing_address || "", shipping_address: row.shipping_address || "", status: row.status, items: [] });
        setEditing(row.id); setOpen(true); setError("");
    };

    const handleCustomerChange = (id) => {
        const c = customers.find(c => c.id === id);
        setForm(f => ({ ...f, customer_id: id, billing_address: c?.billing_address || "", shipping_address: c?.shipping_address || "" }));
    };

    const addItem = () => setForm(f => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));
    const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
    const setItem = (i, key, val) => setForm(f => ({ ...f, items: f.items.map((it, idx) => idx === i ? { ...it, [key]: val } : it) }));

    const handleSave = async () => {
        try {
            if (editing) await updateSaleOrder(editing, { ...form, items: undefined });
            else await createSaleOrder(form);
            setOpen(false); load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this Sale Order? This will release the blocked inventory.")) return;
        try { await deleteSaleOrder(id); load(); setError(""); }
        catch (e) { setError(e.response?.data?.error || e.response?.data?.message || "Delete failed."); }
    };

    const orderTotal = form.items.reduce((sum, it) => sum + (parseFloat(it.quantity) || 0) * (parseFloat(it.rate) || 0), 0);

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Sale Orders</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Confirmed orders — inventory is locked automatically on creation</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>New Sale Order</Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["SO No", "Customer", "PO Ref", "Items", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No sale orders yet.</Typography>
                                </TableCell></TableRow>
                            ) : rows.map(row => (
                                <TableRow key={row.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>{row.so_no}</TableCell>
                                    <TableCell>{row.customer?.name || "—"}</TableCell>
                                    <TableCell>{row.customer_po_ref || "—"}</TableCell>
                                    <TableCell>{row.items?.length || 0} item(s)</TableCell>
                                    <TableCell><Chip label={row.status} size="small" color={STATUS_COLORS[row.status] || "default"} variant="outlined" /></TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit Status"><IconButton size="small" onClick={() => openEdit(row)}><Edit fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle fontWeight={700}>{editing ? "Update Sale Order Status" : "New Sale Order"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                        <FormControl size="small" fullWidth disabled={!!editing}>
                            <InputLabel>Customer *</InputLabel>
                            <Select value={form.customer_id} label="Customer *" onChange={e => handleCustomerChange(e.target.value)}>
                                {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField size="small" label="Customer PO Ref" value={form.customer_po_ref} onChange={e => setForm(f => ({ ...f, customer_po_ref: e.target.value }))} />
                        <TextField size="small" label="Billing Address" value={form.billing_address} multiline rows={2} onChange={e => setForm(f => ({ ...f, billing_address: e.target.value }))} />
                        <TextField size="small" label="Shipping Address" value={form.shipping_address} multiline rows={2} onChange={e => setForm(f => ({ ...f, shipping_address: e.target.value }))} />
                        <FormControl size="small" fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select value={form.status} label="Status" onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                {["Pending", "Dispatched", "Closed"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                    {!editing && (<>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight={700}>Items (inventory will be locked)</Typography>
                            <Button size="small" startIcon={<AddCircleOutline />} onClick={addItem}>Add Item</Button>
                        </Box>
                        {form.items.map((item, i) => (
                            <Box key={i} sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 1.5, mb: 1.5 }}>
                                <FormControl size="small">
                                    <InputLabel>Product *</InputLabel>
                                    <Select value={item.product_id} label="Product *" onChange={e => setItem(i, "product_id", e.target.value)}>
                                        {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <TextField size="small" type="number" label="Quantity *" value={item.quantity} onChange={e => setItem(i, "quantity", e.target.value)} inputProps={{ min: 1 }} />
                                <TextField size="small" type="number" label="Rate (₹) *" value={item.rate} onChange={e => setItem(i, "rate", e.target.value)} />
                                <IconButton size="small" color="error" onClick={() => removeItem(i)} disabled={form.items.length === 1}><RemoveCircleOutline /></IconButton>
                            </Box>
                        ))}
                        <Divider sx={{ mt: 1, mb: 1 }} />
                        <Typography variant="subtitle2" align="right" fontWeight={700}>Order Total: ₹{orderTotal.toFixed(2)}</Typography>
                    </>)}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>{editing ? "Update Status" : "Create Sale Order"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
