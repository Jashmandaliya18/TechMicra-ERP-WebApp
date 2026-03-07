import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel, Chip, Tooltip, Divider,
    useTheme, alpha, Alert
} from "@mui/material";
import { Add, Edit, Delete, AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { getInquiries, createInquiry, updateInquiry, deleteInquiry, getCustomers, getProducts } from "../../services/api";

const STATUS_COLORS = { New: "info", Processing: "warning", Quoted: "success", Lost: "error" };
const EMPTY_ITEM = { product_id: "", quantity: 1, target_price: "" };

export default function SalesInquiries() {
    const [rows, setRows] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [stockCheck, setStockCheck] = useState([]);
    const [form, setForm] = useState({ customer_id: "", inquiry_date: new Date().toISOString().split("T")[0], status: "New", items: [{ ...EMPTY_ITEM }] });
    const theme = useTheme();

    const load = async () => {
        try {
            const [inq, cust, prod] = await Promise.all([getInquiries(), getCustomers(), getProducts()]);
            setRows(inq.data); setCustomers(cust.data); setProducts(prod.data);
        } catch { setError("Failed to load data."); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => {
        setForm({ customer_id: "", inquiry_date: new Date().toISOString().split("T")[0], status: "New", items: [{ ...EMPTY_ITEM }] });
        setEditing(null); setOpen(true); setError(""); setStockCheck([]);
    };

    const openEdit = (row) => {
        setForm({
            customer_id: row.customer_id,
            inquiry_date: row.inquiry_date,
            status: row.status,
            items: row.items?.map(i => ({ product_id: i.product_id, quantity: i.quantity, target_price: i.target_price || "" })) || [{ ...EMPTY_ITEM }],
        });
        setEditing(row.id); setOpen(true); setError(""); setStockCheck(row.stock_check || []);
    };

    const handleClose = () => setOpen(false);

    const addItem = () => setForm(f => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));
    const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
    const setItem = (i, key, val) => setForm(f => ({ ...f, items: f.items.map((it, idx) => idx === i ? { ...it, [key]: val } : it) }));

    const handleSave = async () => {
        try {
            let res;
            if (editing) res = await updateInquiry(editing, form);
            else res = await createInquiry(form);
            setStockCheck(res.data.stock_check || []);
            if (!editing) {
                // Show stock check results then close after 3s
                setTimeout(() => { setOpen(false); load(); }, 3500);
            } else {
                setOpen(false); load();
            }
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this inquiry?")) return;
        try { await deleteInquiry(id); load(); setError(""); }
        catch (e) { setError(e.response?.data?.error || e.response?.data?.message || "Delete failed."); }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Sales Inquiries</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Track customer inquiries and check stock availability</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>New Inquiry</Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["Inquiry No", "Customer", "Date", "Sales Person", "Items", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No inquiries yet. Create your first inquiry.</Typography>
                                </TableCell></TableRow>
                            ) : rows.map(row => (
                                <TableRow key={row.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>{row.inquiry_no}</TableCell>
                                    <TableCell>{row.customer?.name || "—"}</TableCell>
                                    <TableCell>{row.inquiry_date}</TableCell>
                                    <TableCell>{row.sales_person?.name || "—"}</TableCell>
                                    <TableCell>{row.items?.length || 0} item(s)</TableCell>
                                    <TableCell><Chip label={row.status} size="small" color={STATUS_COLORS[row.status] || "default"} variant="outlined" /></TableCell>
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

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle fontWeight={700}>{editing ? "Edit Inquiry" : "New Inquiry"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 3 }}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Customer *</InputLabel>
                            <Select value={form.customer_id} label="Customer *" onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))}>
                                {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField size="small" type="date" label="Inquiry Date" value={form.inquiry_date}
                            onChange={e => setForm(f => ({ ...f, inquiry_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
                        <FormControl size="small" fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select value={form.status} label="Status" onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                {["New", "Processing", "Quoted", "Lost"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700}>Items</Typography>
                        <Button size="small" startIcon={<AddCircleOutline />} onClick={addItem}>Add Item</Button>
                    </Box>
                    {form.items.map((item, i) => (
                        <Box key={i} sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 1.5, mb: 1.5 }}>
                            <FormControl size="small">
                                <InputLabel>Product *</InputLabel>
                                <Select value={item.product_id} label="Product *" onChange={e => setItem(i, "product_id", e.target.value)}>
                                    {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name} (Avail: {p.net_available})</MenuItem>)}
                                </Select>
                            </FormControl>
                            <TextField size="small" type="number" label="Quantity *" value={item.quantity} onChange={e => setItem(i, "quantity", e.target.value)} inputProps={{ min: 1 }} />
                            <TextField size="small" type="number" label="Target Price" value={item.target_price} onChange={e => setItem(i, "target_price", e.target.value)} />
                            <IconButton size="small" color="error" onClick={() => removeItem(i)} disabled={form.items.length === 1}><RemoveCircleOutline /></IconButton>
                        </Box>
                    ))}

                    {stockCheck.length > 0 && (
                        <Box mt={2}>
                            <Divider sx={{ mb: 1.5 }} />
                            <Typography variant="subtitle2" fontWeight={700} mb={1}>📦 Stock Check Results</Typography>
                            {stockCheck.map((sc, i) => (
                                <Alert key={i} severity={sc.stock_status === "Available" ? "success" : "warning"} sx={{ mb: 1, fontSize: "0.8rem" }}>
                                    <strong>{sc.product_name}</strong>: Net Available = {sc.net_available} | Requested = {sc.inquiry_qty} |{" "}
                                    <strong>{sc.stock_status}</strong> → Delivery by <strong>{sc.delivery_date}</strong>
                                </Alert>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>
                        {editing ? "Update Inquiry" : "Create & Check Stock"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
