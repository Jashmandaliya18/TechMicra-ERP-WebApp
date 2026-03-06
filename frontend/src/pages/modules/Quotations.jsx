import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel, Divider,
    useTheme, alpha, Alert, Tooltip
} from "@mui/material";
import { Add, Edit, Delete, AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { getQuotations, createQuotation, updateQuotation, deleteQuotation, getInquiries, getProducts } from "../../services/api";

const EMPTY_ITEM = { product_id: "", quantity: 1, rate: "", gst_percent: 18 };

export default function Quotations() {
    const [rows, setRows] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        inquiry_id: "", valid_until: new Date().toISOString().split("T")[0],
        payment_terms: "30 Days Net", items: [{ ...EMPTY_ITEM }]
    });
    const theme = useTheme();

    const load = async () => {
        try {
            const [qt, inq, prod] = await Promise.all([getQuotations(), getInquiries(), getProducts()]);
            setRows(qt.data); setInquiries(inq.data); setProducts(prod.data);
        } catch { setError("Failed to load data."); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => {
        setForm({ inquiry_id: "", valid_until: new Date().toISOString().split("T")[0], payment_terms: "30 Days Net", items: [{ ...EMPTY_ITEM }] });
        setEditing(null); setOpen(true); setError("");
    };
    const openEdit = (row) => {
        setForm({
            inquiry_id: row.inquiry_id || "",
            valid_until: row.valid_until || "",
            payment_terms: row.payment_terms || "",
            items: row.items?.map(i => ({ product_id: i.product_id, quantity: i.quantity, rate: i.rate, gst_percent: i.gst_percent })) || [{ ...EMPTY_ITEM }]
        });
        setEditing(row.id); setOpen(true); setError("");
    };

    const addItem = () => setForm(f => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));
    const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
    const setItem = (i, key, val) => setForm(f => ({ ...f, items: f.items.map((it, idx) => idx === i ? { ...it, [key]: val } : it) }));

    const handleSave = async () => {
        try {
            if (editing) await updateQuotation(editing, form);
            else await createQuotation(form);
            setOpen(false); load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this quotation?")) return;
        try { await deleteQuotation(id); load(); }
        catch { setError("Delete failed."); }
    };

    const lineTotal = (item) => {
        const sub = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
        return sub * (1 + (parseFloat(item.gst_percent) || 0) / 100);
    };
    const grandTotal = form.items.reduce((sum, it) => sum + lineTotal(it), 0);

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Quotations</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Prepare and send price proposals to customers</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>New Quotation</Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["Quote ID", "Inquiry Ref", "Customer", "Valid Until", "Payment Terms", "Items", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No quotations yet.</Typography>
                                </TableCell></TableRow>
                            ) : rows.map(row => (
                                <TableRow key={row.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>{row.quote_id}</TableCell>
                                    <TableCell>{row.inquiry?.inquiry_no || "—"}</TableCell>
                                    <TableCell>{row.inquiry?.customer?.name || "—"}</TableCell>
                                    <TableCell>{row.valid_until}</TableCell>
                                    <TableCell>{row.payment_terms}</TableCell>
                                    <TableCell>{row.items?.length || 0} item(s)</TableCell>
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

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle fontWeight={700}>{editing ? "Edit Quotation" : "New Quotation"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 3 }}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Inquiry Reference</InputLabel>
                            <Select value={form.inquiry_id} label="Inquiry Reference" onChange={e => setForm(f => ({ ...f, inquiry_id: e.target.value }))}>
                                <MenuItem value="">None</MenuItem>
                                {inquiries.map(i => <MenuItem key={i.id} value={i.id}>{i.inquiry_no} – {i.customer?.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField size="small" type="date" label="Valid Until *" value={form.valid_until}
                            onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))} InputLabelProps={{ shrink: true }} />
                        <TextField size="small" label="Payment Terms" value={form.payment_terms}
                            onChange={e => setForm(f => ({ ...f, payment_terms: e.target.value }))} />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700}>Items</Typography>
                        <Button size="small" startIcon={<AddCircleOutline />} onClick={addItem}>Add Item</Button>
                    </Box>
                    {form.items.map((item, i) => (
                        <Box key={i} sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 1.5, mb: 1.5 }}>
                            <FormControl size="small">
                                <InputLabel>Product *</InputLabel>
                                <Select value={item.product_id} label="Product *" onChange={e => setItem(i, "product_id", e.target.value)}>
                                    {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <TextField size="small" type="number" label="Qty *" value={item.quantity} onChange={e => setItem(i, "quantity", e.target.value)} inputProps={{ min: 1 }} />
                            <TextField size="small" type="number" label="Rate (₹) *" value={item.rate} onChange={e => setItem(i, "rate", e.target.value)} />
                            <TextField size="small" type="number" label="GST %" value={item.gst_percent} onChange={e => setItem(i, "gst_percent", e.target.value)} />
                            <IconButton size="small" color="error" onClick={() => removeItem(i)} disabled={form.items.length === 1}><RemoveCircleOutline /></IconButton>
                        </Box>
                    ))}
                    <Divider sx={{ mt: 1, mb: 1 }} />
                    <Typography variant="subtitle2" align="right" sx={{ fontWeight: 700 }}>
                        Grand Total: ₹{grandTotal.toFixed(2)}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save Quotation</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
