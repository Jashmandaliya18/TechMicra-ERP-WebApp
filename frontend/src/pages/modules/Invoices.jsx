import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel, useTheme, alpha, Alert, Tooltip, Divider
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { getInvoices, createInvoice, updateInvoice, deleteInvoice, getSaleOrders } from "../../services/api";

export default function Invoices() {
    const [rows, setRows] = useState([]);
    const [saleOrders, setSaleOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        sale_order_id: "", invoice_date: new Date().toISOString().split("T")[0],
        place_of_supply: "", e_way_bill_no: "", taxable_value: "", gst_amount: "", round_off: "0",
    });
    const theme = useTheme();

    const load = async () => {
        try {
            const [inv, so] = await Promise.all([getInvoices(), getSaleOrders()]);
            setRows(inv.data); setSaleOrders(so.data);
        } catch { setError("Failed to load."); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => {
        setForm({ sale_order_id: "", invoice_date: new Date().toISOString().split("T")[0], place_of_supply: "", e_way_bill_no: "", taxable_value: "", gst_amount: "", round_off: "0" });
        setEditing(null); setOpen(true); setError("");
    };
    const openEdit = (row) => {
        setForm({ sale_order_id: row.sale_order_id, invoice_date: row.invoice_date, place_of_supply: row.place_of_supply || "", e_way_bill_no: row.e_way_bill_no || "", taxable_value: row.taxable_value, gst_amount: row.gst_amount, round_off: row.round_off || "0" });
        setEditing(row.id); setOpen(true); setError("");
    };

    const handleSave = async () => {
        try {
            if (editing) await updateInvoice(editing, form);
            else await createInvoice(form);
            setOpen(false); load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this invoice?")) return;
        try { await deleteInvoice(id); load(); }
        catch { setError("Delete failed."); }
    };

    const grandTotal = (parseFloat(form.taxable_value) || 0) + (parseFloat(form.gst_amount) || 0) + (parseFloat(form.round_off) || 0);

    const f = (label, key, type = "text", props = {}) => (
        <TextField fullWidth margin="dense" size="small" label={label} type={type}
            value={form[key] ?? ""} onChange={e => setForm(fm => ({ ...fm, [key]: e.target.value }))} {...props} />
    );

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Invoices</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Generate GST invoices for dispatch sale orders</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>New Invoice</Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["Invoice No", "Sale Order", "Customer", "Date", "Taxable Value", "GST", "Grand Total", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No invoices yet.</Typography>
                                </TableCell></TableRow>
                            ) : rows.map(row => (
                                <TableRow key={row.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>{row.invoice_no}</TableCell>
                                    <TableCell>{row.sale_order?.so_no || "—"}</TableCell>
                                    <TableCell>{row.sale_order?.customer?.name || "—"}</TableCell>
                                    <TableCell>{row.invoice_date}</TableCell>
                                    <TableCell>₹{parseFloat(row.taxable_value).toFixed(2)}</TableCell>
                                    <TableCell>₹{parseFloat(row.gst_amount).toFixed(2)}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>₹{parseFloat(row.grand_total).toFixed(2)}</TableCell>
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
                <DialogTitle fontWeight={700}>{editing ? "Edit Invoice" : "New Invoice"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
                    {!editing && (
                        <FormControl fullWidth margin="dense" size="small">
                            <InputLabel>Sale Order *</InputLabel>
                            <Select value={form.sale_order_id} label="Sale Order *" onChange={e => setForm(fm => ({ ...fm, sale_order_id: e.target.value }))}>
                                {saleOrders.map(s => <MenuItem key={s.id} value={s.id}>{s.so_no} – {s.customer?.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    )}
                    {f("Invoice Date *", "invoice_date", "date", { InputLabelProps: { shrink: true } })}
                    {f("Place of Supply", "place_of_supply")}
                    {f("E-Way Bill No", "e_way_bill_no")}
                    <Divider sx={{ my: 1 }} />
                    {f("Taxable Value (₹) *", "taxable_value", "number")}
                    {f("GST Amount (₹) *", "gst_amount", "number")}
                    {f("Round Off", "round_off", "number")}
                    <Typography variant="subtitle2" align="right" fontWeight={700} mt={1}>
                        Grand Total: ₹{grandTotal.toFixed(2)}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save Invoice</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
