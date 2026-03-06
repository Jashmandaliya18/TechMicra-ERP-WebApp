import React, { useState, useEffect } from "react";
import {
    Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, Autocomplete, Alert
} from "@mui/material";
import { Add, Edit, Delete, Save, Close, SystemUpdateAlt } from "@mui/icons-material";
import api from "../../services/api";

export default function WarehouseReceipts() {
    const [receipts, setReceipts] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        receipt_date: new Date().toISOString().split('T')[0],
        source_doc_ref: "",
        product_id: null,
        qty_received: 1,
        notes: ""
    });

    useEffect(() => {
        fetchReceipts();
        api.get("/products").then(res => setProducts(res.data)).catch(() => { });
    }, []);

    const fetchReceipts = async () => {
        try {
            const res = await api.get("/warehouse-receipts");
            setReceipts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setEditMode(true);
            setCurrentId(item.id);
            setForm({
                receipt_date: item.receipt_date,
                source_doc_ref: item.source_doc_ref || "",
                product_id: item.product_id,
                qty_received: item.qty_received,
                notes: item.notes || ""
            });
        } else {
            setEditMode(false);
            setForm({
                receipt_date: new Date().toISOString().split('T')[0],
                source_doc_ref: "",
                product_id: null,
                qty_received: 1,
                notes: ""
            });
        }
        setOpen(true);
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.product_id || form.qty_received < 1) {
            setError("Valid Product and Quantity are required.");
            return;
        }

        setLoading(true);
        try {
            if (editMode) {
                await api.put(`/warehouse-receipts/${currentId}`, form);
            } else {
                await api.post("/warehouse-receipts", form);
            }
            setOpen(false);
            fetchReceipts();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this material receipt?")) {
            await api.delete(`/warehouse-receipts/${id}`);
            fetchReceipts();
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5">Material Receipts</Typography>
                    <Typography variant="body2" color="text.secondary">Acknowledge inward goods from returns or inter-store transfers</Typography>
                </Box>
                <Button variant="contained" startIcon={<SystemUpdateAlt />} onClick={() => handleOpen()}>
                    New Material Receipt
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: "primary.main" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>Receipt ID</TableCell>
                            <TableCell sx={{ color: "white" }}>Date</TableCell>
                            <TableCell sx={{ color: "white" }}>Source Document Ref</TableCell>
                            <TableCell sx={{ color: "white" }}>Item Name</TableCell>
                            <TableCell sx={{ color: "white", align: "right" }}>Qty Recv</TableCell>
                            <TableCell sx={{ color: "white" }}>Notes</TableCell>
                            <TableCell sx={{ color: "white" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {receipts.map((r) => (
                            <TableRow key={r.id} hover>
                                <TableCell sx={{ fontWeight: "bold" }}>{r.receipt_id}</TableCell>
                                <TableCell>{r.receipt_date}</TableCell>
                                <TableCell>{r.source_doc_ref || "—"}</TableCell>
                                <TableCell>{r.product?.name}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: "medium" }}>{r.qty_received}</TableCell>
                                <TableCell>{r.notes}</TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleOpen(r)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(r.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? `Modify Record` : "Acknowledge Goods Receipt"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Receipt Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                required
                                value={form.receipt_date}
                                onChange={(e) => setForm({ ...form, receipt_date: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Source Doc Ref (Optional)"
                                placeholder="PO-123, WT-005, SRV-002"
                                value={form.source_doc_ref}
                                onChange={(e) => setForm({ ...form, source_doc_ref: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Autocomplete
                                options={products}
                                getOptionLabel={(o) => o.name}
                                value={products.find(p => p.id === form.product_id) || null}
                                onChange={(_, val) => setForm({ ...form, product_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Item Received" required />}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Qty Received"
                                type="number"
                                required
                                value={form.qty_received}
                                onChange={(e) => setForm({ ...form, qty_received: parseInt(e.target.value) || 1 })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Notes / Remarks"
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<Close />} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSubmit} disabled={loading}>
                        {editMode ? "Save Changes" : "Log Receipt"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
