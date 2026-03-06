import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, IconButton, Alert, Chip, MenuItem, Tooltip
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import api from "../../services/api";

const STATUSES = ["Booked", "In-Transit", "Delivered"];
const STATUS_COLORS = { Booked: "info", "In-Transit": "warning", Delivered: "success" };

const empty = {
    booking_date: new Date().toISOString().split("T")[0],
    transporter_id: "", sale_order_id: "",
    freight_amount: "", advance_paid: "", status: "Booked",
};

export default function LogisticsBookings() {
    const [rows, setRows] = useState([]);
    const [transporters, setTransporters] = useState([]);
    const [saleOrders, setSaleOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const load = async () => {
        try {
            const [b, t, s] = await Promise.all([
                api.get("/logistics-bookings"),
                api.get("/transporters"),
                api.get("/sale-orders"),
            ]);
            setRows(b.data);
            setTransporters(t.data);
            setSaleOrders(s.data);
        } catch { setError("Failed to load data"); }
    };

    useEffect(() => { load(); }, []);

    const handleOpen = (row = null) => {
        setEditing(row);
        setForm(row ? {
            booking_date: row.booking_date,
            transporter_id: row.transporter_id || "",
            sale_order_id: row.sale_order_id || "",
            freight_amount: row.freight_amount || "",
            advance_paid: row.advance_paid || "",
            status: row.status || "Booked",
        } : empty);
        setError("");
        setOpen(true);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = { ...form, sale_order_id: form.sale_order_id || null };
            if (editing) {
                await api.put(`/logistics-bookings/${editing.id}`, payload);
            } else {
                await api.post("/logistics-bookings", payload);
            }
            setOpen(false);
            load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed");
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this booking?")) return;
        try { await api.delete(`/logistics-bookings/${id}`); load(); }
        catch { setError("Delete failed"); }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Transport Orders (Bookings)</Typography>
                    <Typography variant="body2" color="text.secondary">Book trucks and track delivery status</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Book Truck</Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "action.hover" }}>
                            {["Booking No", "Date", "Transporter", "Sale Order", "Freight (₹)", "Advance (₹)", "Status", "Actions"].map(h => (
                                <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>No bookings yet.</TableCell></TableRow>
                        ) : rows.map(row => (
                            <TableRow key={row.id} hover>
                                <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>{row.booking_no}</TableCell>
                                <TableCell>{row.booking_date}</TableCell>
                                <TableCell>{row.transporter?.name || "—"}</TableCell>
                                <TableCell>{row.sale_order?.so_no || "—"}</TableCell>
                                <TableCell>₹{parseFloat(row.freight_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell>₹{parseFloat(row.advance_paid || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell><Chip label={row.status} size="small" color={STATUS_COLORS[row.status] || "default"} variant="outlined" /></TableCell>
                                <TableCell>
                                    <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpen(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editing ? "Edit Booking" : "Book a Truck"}</DialogTitle>
                <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        select label="Transporter *" value={form.transporter_id}
                        onChange={e => setForm(p => ({ ...p, transporter_id: e.target.value }))} fullWidth size="small"
                    >
                        {transporters.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                    </TextField>
                    <TextField
                        select label="Linked Sale Order (optional)" value={form.sale_order_id}
                        onChange={e => setForm(p => ({ ...p, sale_order_id: e.target.value }))} fullWidth size="small"
                    >
                        <MenuItem value="">— None —</MenuItem>
                        {saleOrders.map(s => <MenuItem key={s.id} value={s.id}>{s.so_no} — {s.customer?.name}</MenuItem>)}
                    </TextField>
                    <TextField
                        label="Booking Date *" type="date" value={form.booking_date}
                        onChange={e => setForm(p => ({ ...p, booking_date: e.target.value }))}
                        fullWidth size="small" InputLabelProps={{ shrink: true }}
                    />
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        <TextField label="Freight Amount (₹)" type="number" value={form.freight_amount}
                            onChange={e => setForm(p => ({ ...p, freight_amount: e.target.value }))} size="small" />
                        <TextField label="Advance Paid (₹)" type="number" value={form.advance_paid}
                            onChange={e => setForm(p => ({ ...p, advance_paid: e.target.value }))} size="small" />
                    </Box>
                    <TextField select label="Status" value={form.status}
                        onChange={e => setForm(p => ({ ...p, status: e.target.value }))} fullWidth size="small">
                        {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : editing ? "Update" : "Book Truck"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
