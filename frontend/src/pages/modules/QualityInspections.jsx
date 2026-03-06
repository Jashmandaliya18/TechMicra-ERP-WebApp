import React, { useState, useEffect } from "react";
import {
    Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Grid, Autocomplete, Alert, Chip
} from "@mui/material";
import { Add, Edit, Delete, Save, Close, Search } from "@mui/icons-material";
import api from "../../services/api";

export default function QualityInspections() {
    const [inspections, setInspections] = useState([]);
    const [grns, setGrns] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        goods_receipt_note_id: null,
        product_id: null,
        total_qty: 0,
        sample_size: 1,
        accepted_qty: 0,
        rejected_qty: 0,
        visual_check: "Pass",
        dimension_check: ""
    });

    useEffect(() => {
        fetchInspections();
        api.get("/goods-receipt-notes").then(res => setGrns(res.data));
        api.get("/products").then(res => setProducts(res.data));
    }, []);

    const fetchInspections = async () => {
        try {
            const res = await api.get("/incoming-quality-controls");
            setInspections(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setEditMode(true);
            setCurrentId(item.id);
            setForm({
                goods_receipt_note_id: item.goods_receipt_note_id,
                product_id: item.product_id,
                total_qty: item.total_qty,
                sample_size: item.sample_size,
                accepted_qty: item.accepted_qty,
                rejected_qty: item.rejected_qty,
                visual_check: item.visual_check || "Pass",
                dimension_check: item.dimension_check || ""
            });
        } else {
            setEditMode(false);
            setForm({
                goods_receipt_note_id: null,
                product_id: null,
                total_qty: 0,
                sample_size: 1,
                accepted_qty: 0,
                rejected_qty: 0,
                visual_check: "Pass",
                dimension_check: ""
            });
        }
        setOpen(true);
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.goods_receipt_note_id || !form.product_id || form.total_qty <= 0) {
            setError("Please fill all required fields correctly.");
            return;
        }

        if (form.accepted_qty + form.rejected_qty > form.total_qty) {
            setError("Accepted and Rejected quantity cannot exceed Total Quantity.");
            return;
        }

        setLoading(true);
        try {
            if (editMode) {
                await api.put(`/incoming-quality-controls/${currentId}`, form);
            } else {
                await api.post("/incoming-quality-controls", form);
            }
            setOpen(false);
            fetchInspections();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this IQC record?")) {
            await api.delete(`/incoming-quality-controls/${id}`);
            fetchInspections();
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5">Incoming Quality Control (IQC)</Typography>
                    <Typography variant="body2" color="text.secondary">Inspect materials received via GRN</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    New IQC Match
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: "primary.main" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>IQC ID</TableCell>
                            <TableCell sx={{ color: "white" }}>GRN Ref</TableCell>
                            <TableCell sx={{ color: "white" }}>Product</TableCell>
                            <TableCell sx={{ color: "white" }}>Total Qty</TableCell>
                            <TableCell sx={{ color: "white" }}>Acc/Rej</TableCell>
                            <TableCell sx={{ color: "white" }}>Visual Check</TableCell>
                            <TableCell sx={{ color: "white" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inspections.map((iqc) => (
                            <TableRow key={iqc.id} hover>
                                <TableCell sx={{ fontWeight: "bold" }}>IQC-{iqc.id.toString().padStart(4, '0')}</TableCell>
                                <TableCell>{iqc.grn?.grn_no}</TableCell>
                                <TableCell>{iqc.product?.name}</TableCell>
                                <TableCell>{iqc.total_qty}</TableCell>
                                <TableCell>
                                    <span style={{ color: 'green' }}>{iqc.accepted_qty}</span> / <span style={{ color: 'red' }}>{iqc.rejected_qty}</span>
                                </TableCell>
                                <TableCell>
                                    <Chip label={iqc.visual_check || "N/A"} size="small" color={iqc.visual_check === 'Pass' ? 'success' : 'error'} />
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleOpen(iqc)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(iqc.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editMode ? `Modify IQC Record` : "New IQC Record"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={grns}
                                getOptionLabel={(o) => o.grn_no}
                                value={grns.find(g => g.id === form.goods_receipt_note_id) || null}
                                onChange={(_, val) => setForm({ ...form, goods_receipt_note_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Reference GRN" required />}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={products}
                                getOptionLabel={(o) => o.name}
                                value={products.find(p => p.id === form.product_id) || null}
                                onChange={(_, val) => setForm({ ...form, product_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Product Code" required />}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Total Vendor Qty"
                                type="number"
                                required
                                value={form.total_qty}
                                onChange={(e) => setForm({ ...form, total_qty: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Sample Size Checked"
                                type="number"
                                value={form.sample_size}
                                onChange={(e) => setForm({ ...form, sample_size: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Accepted Qty"
                                type="number"
                                required
                                value={form.accepted_qty}
                                onChange={(e) => setForm({ ...form, accepted_qty: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Rejected Qty"
                                type="number"
                                required
                                value={form.rejected_qty}
                                onChange={(e) => setForm({ ...form, rejected_qty: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Visual Check"
                                value={form.visual_check}
                                onChange={(e) => setForm({ ...form, visual_check: e.target.value })}
                            >
                                <MenuItem value="Pass">Pass</MenuItem>
                                <MenuItem value="Fail">Fail</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Dimension Check / Readings"
                                value={form.dimension_check}
                                onChange={(e) => setForm({ ...form, dimension_check: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<Close />} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSubmit} disabled={loading}>
                        {editMode ? "Save Changes" : "Submit Inspection"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
