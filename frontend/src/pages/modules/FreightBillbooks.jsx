import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, IconButton, Alert, Chip, MenuItem, Tooltip
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import api from "../../services/api";

const PAYMENT_STATUSES = ["Unpaid", "Partial", "Paid"];
const PAYMENT_COLORS = { Unpaid: "error", Partial: "warning", Paid: "success" };

const empty = {
    transporter_id: "", logistics_booking_id: "",
    total_freight: "", gst_amount: "", payment_status: "Unpaid",
};

export default function FreightBillbooks() {
    const [rows, setRows] = useState([]);
    const [transporters, setTransporters] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const load = async () => {
        try {
            const [f, t, b] = await Promise.all([
                api.get("/freight-billbooks"),
                api.get("/transporters"),
                api.get("/logistics-bookings"),
            ]);
            setRows(f.data);
            setTransporters(t.data);
            setBookings(b.data);
        } catch { setError("Failed to load data"); }
    };

    useEffect(() => { load(); }, []);

    const handleOpen = (row = null) => {
        setEditing(row);
        setForm(row ? {
            transporter_id: row.transporter_id || "",
            logistics_booking_id: row.logistics_booking_id || "",
            total_freight: row.total_freight || "",
            gst_amount: row.gst_amount || "",
            payment_status: row.payment_status || "Unpaid",
        } : empty);
        setError("");
        setOpen(true);
    };

    const netPayable = (parseFloat(form.total_freight) || 0) + (parseFloat(form.gst_amount) || 0);

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = { ...form, logistics_booking_id: form.logistics_booking_id || null };
            if (editing) {
                await api.put(`/freight-billbooks/${editing.id}`, payload);
            } else {
                await api.post("/freight-billbooks", payload);
            }
            setOpen(false);
            load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed");
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this freight bill?")) return;
        try { await api.delete(`/freight-billbooks/${id}`); load(); }
        catch { setError("Delete failed"); }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Freight Billbook</Typography>
                    <Typography variant="body2" color="text.secondary">Transporter invoices and freight payment tracking</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Bill</Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "action.hover" }}>
                            {["Bill No", "Transporter", "Booking Ref", "Freight (₹)", "GST (₹)", "Net Payable (₹)", "Payment Status", "Actions"].map(h => (
                                <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>No freight bills yet.</TableCell></TableRow>
                        ) : rows.map(row => (
                            <TableRow key={row.id} hover>
                                <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>{row.bill_no}</TableCell>
                                <TableCell>{row.transporter?.name || "—"}</TableCell>
                                <TableCell>{row.booking?.booking_no || "—"}</TableCell>
                                <TableCell>₹{parseFloat(row.total_freight || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell>₹{parseFloat(row.gst_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>₹{parseFloat(row.net_payable || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell><Chip label={row.payment_status} size="small" color={PAYMENT_COLORS[row.payment_status] || "default"} variant="outlined" /></TableCell>
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
                <DialogTitle>{editing ? "Edit Freight Bill" : "New Freight Bill"}</DialogTitle>
                <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField select label="Transporter *" value={form.transporter_id}
                        onChange={e => setForm(p => ({ ...p, transporter_id: e.target.value }))} fullWidth size="small">
                        {transporters.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                    </TextField>
                    <TextField select label="Transport Booking (optional)" value={form.logistics_booking_id}
                        onChange={e => setForm(p => ({ ...p, logistics_booking_id: e.target.value }))} fullWidth size="small">
                        <MenuItem value="">— None —</MenuItem>
                        {bookings.map(b => <MenuItem key={b.id} value={b.id}>{b.booking_no} — {b.transporter?.name}</MenuItem>)}
                    </TextField>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        <TextField label="Total Freight (₹) *" type="number" value={form.total_freight}
                            onChange={e => setForm(p => ({ ...p, total_freight: e.target.value }))} size="small" />
                        <TextField label="GST Amount (₹) *" type="number" value={form.gst_amount}
                            onChange={e => setForm(p => ({ ...p, gst_amount: e.target.value }))} size="small" />
                    </Box>
                    <Box sx={{ p: 2, bgcolor: "primary.main", borderRadius: 1, color: "white" }}>
                        <Typography variant="body2" sx={{ opacity: 0.85 }}>Net Payable (Auto-calculated)</Typography>
                        <Typography variant="h6" fontWeight={700}>
                            ₹{netPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </Typography>
                    </Box>
                    <TextField select label="Payment Status" value={form.payment_status}
                        onChange={e => setForm(p => ({ ...p, payment_status: e.target.value }))} fullWidth size="small">
                        {PAYMENT_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : editing ? "Update Bill" : "Save Bill"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
