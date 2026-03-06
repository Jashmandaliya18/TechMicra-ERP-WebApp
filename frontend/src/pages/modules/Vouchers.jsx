import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel, Chip, useTheme, alpha, Alert, Tooltip
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { getVoucherReceipts, createVoucherReceipt, updateVoucherReceipt, deleteVoucherReceipt, getCustomers, getInvoices } from "../../services/api";

const MODE_COLORS = { Cheque: "default", NEFT: "primary", RTGS: "secondary", Cash: "success", UPI: "info" };

export default function VoucherReceipts() {
    const [rows, setRows] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        voucher_date: new Date().toISOString().split("T")[0], customer_id: "",
        invoice_id: "", amount: "", mode: "NEFT", ref_no: ""
    });
    const theme = useTheme();

    const load = async () => {
        try {
            const [vr, cust, inv] = await Promise.all([getVoucherReceipts(), getCustomers(), getInvoices()]);
            setRows(vr.data); setCustomers(cust.data); setInvoices(inv.data);
        } catch { setError("Failed to load."); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => {
        setForm({ voucher_date: new Date().toISOString().split("T")[0], customer_id: "", invoice_id: "", amount: "", mode: "NEFT", ref_no: "" });
        setEditing(null); setOpen(true); setError("");
    };
    const openEdit = (row) => {
        setForm({ voucher_date: row.voucher_date, customer_id: row.customer_id, invoice_id: row.invoice_id || "", amount: row.amount, mode: row.mode, ref_no: row.ref_no || "" });
        setEditing(row.id); setOpen(true); setError("");
    };

    const handleSave = async () => {
        try {
            if (editing) await updateVoucherReceipt(editing, form);
            else await createVoucherReceipt(form);
            setOpen(false); load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this receipt?")) return;
        try { await deleteVoucherReceipt(id); load(); }
        catch { setError("Delete failed."); }
    };

    const f = (label, key, type = "text", props = {}) => (
        <TextField fullWidth margin="dense" size="small" label={label} type={type}
            value={form[key] ?? ""} onChange={e => setForm(fm => ({ ...fm, [key]: e.target.value }))} {...props} />
    );

    // Filter invoices by selected customer
    const filteredInvoices = invoices.filter(inv => !form.customer_id || inv.sale_order?.customer_id === form.customer_id);

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Payment Receipts</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Record incoming customer payments against invoices</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>New Receipt</Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["Receipt No", "Date", "Customer", "Invoice", "Amount", "Mode", "Ref No", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No receipts yet.</Typography>
                                </TableCell></TableRow>
                            ) : rows.map(row => (
                                <TableRow key={row.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>{row.receipt_no}</TableCell>
                                    <TableCell>{row.voucher_date}</TableCell>
                                    <TableCell>{row.customer?.name || "—"}</TableCell>
                                    <TableCell>{row.invoice?.invoice_no || "—"}</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>₹{parseFloat(row.amount).toFixed(2)}</TableCell>
                                    <TableCell><Chip label={row.mode} size="small" color={MODE_COLORS[row.mode] || "default"} /></TableCell>
                                    <TableCell>{row.ref_no || "—"}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(row)}><Edit fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight={700}>{editing ? "Edit Receipt" : "New Payment Receipt"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
                    {f("Receipt Date *", "voucher_date", "date", { InputLabelProps: { shrink: true } })}
                    <FormControl fullWidth margin="dense" size="small">
                        <InputLabel>Customer *</InputLabel>
                        <Select value={form.customer_id} label="Customer *" onChange={e => setForm(fm => ({ ...fm, customer_id: e.target.value, invoice_id: "" }))}>
                            {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense" size="small">
                        <InputLabel>Invoice Reference</InputLabel>
                        <Select value={form.invoice_id} label="Invoice Reference" onChange={e => setForm(fm => ({ ...fm, invoice_id: e.target.value }))}>
                            <MenuItem value="">No Invoice</MenuItem>
                            {filteredInvoices.map(inv => <MenuItem key={inv.id} value={inv.id}>{inv.invoice_no} – ₹{parseFloat(inv.grand_total).toFixed(2)}</MenuItem>)}
                        </Select>
                    </FormControl>
                    {f("Amount (₹) *", "amount", "number")}
                    <FormControl fullWidth margin="dense" size="small">
                        <InputLabel>Payment Mode *</InputLabel>
                        <Select value={form.mode} label="Payment Mode *" onChange={e => setForm(fm => ({ ...fm, mode: e.target.value }))}>
                            {["Cheque", "NEFT", "RTGS", "Cash", "UPI"].map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                        </Select>
                    </FormControl>
                    {f("Reference / Cheque No", "ref_no")}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save Receipt</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
