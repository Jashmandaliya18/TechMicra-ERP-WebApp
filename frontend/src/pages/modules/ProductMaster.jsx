import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, useTheme, alpha, Chip, Tooltip
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/api";

const EMPTY = { name: "", description: "", unit_price: "", current_stock: 0, blocked_stock: 0 };

export default function ProductMaster() {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState("");
    const theme = useTheme();

    const load = async () => {
        try { const { data } = await getProducts(); setProducts(data); }
        catch { setError("Failed to load products."); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(EMPTY); setEditing(null); setOpen(true); setError(""); };
    const openEdit = (p) => { setForm({ ...p }); setEditing(p.id); setOpen(true); setError(""); };
    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            if (editing) await updateProduct(editing, form);
            else await createProduct(form);
            setOpen(false);
            load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try { await deleteProduct(id); load(); setError(""); }
        catch (e) { setError(e.response?.data?.error || e.response?.data?.message || "Delete failed."); }
    };

    const field = (label, key, type = "text", props = {}) => (
        <TextField fullWidth margin="dense" size="small" label={label} type={type}
            value={form[key] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            {...props} />
    );

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Product Master</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Manage your product catalogue and stock levels</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Product</Button>
            </Box>
            {error && <Typography color="error" mb={2}>{error}</Typography>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["Product Name", "Unit Price", "Current Stock", "Blocked", "Net Available", "Actions"].map((h) => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No products yet. Add your first product.</Typography>
                                </TableCell></TableRow>
                            ) : products.map((p) => (
                                <TableRow key={p.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                                    <TableCell>₹{parseFloat(p.unit_price || 0).toFixed(2)}</TableCell>
                                    <TableCell>{p.current_stock}</TableCell>
                                    <TableCell>{p.blocked_stock}</TableCell>
                                    <TableCell>
                                        <Chip size="small" label={p.net_available}
                                            color={p.net_available > 0 ? "success" : "error"} variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(p)}><Edit fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Typography color="error" mb={1} variant="body2">{error}</Typography>}
                    {field("Product Name *", "name")}
                    {field("Description", "description", "text", { multiline: true, rows: 2 })}
                    {field("Unit Price (₹)", "unit_price", "number")}
                    {field("Current Stock", "current_stock", "number")}
                    {field("Blocked Stock", "blocked_stock", "number")}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
