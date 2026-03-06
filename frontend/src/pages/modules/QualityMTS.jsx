import React, { useState, useEffect } from "react";
import {
    Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Grid, Autocomplete, Alert, Chip
} from "@mui/material";
import { Add, Edit, Delete, Save, Close } from "@mui/icons-material";
import api from "../../services/api";

export default function QualityMTS() {
    const [slips, setSlips] = useState([]);
    const [mtas, setMtas] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        mta_id: null,
        product_id: null,
        qty_checked: 0,
        status: "OK"
    });

    useEffect(() => {
        fetchSlips();
        api.get("/material-transfer-advice").then(res => setMtas(res.data)).catch(() => { });
        api.get("/products").then(res => setProducts(res.data));
    }, []);

    const fetchSlips = async () => {
        try {
            const res = await api.get("/material-transfer-slips");
            setSlips(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setEditMode(true);
            setCurrentId(item.id);
            setForm({
                mta_id: item.mta_id,
                product_id: item.product_id,
                qty_checked: item.qty_checked,
                status: item.status
            });
        } else {
            setEditMode(false);
            setForm({
                mta_id: null,
                product_id: null,
                qty_checked: 0,
                status: "OK"
            });
        }
        setOpen(true);
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.mta_id || !form.product_id || form.qty_checked <= 0) {
            setError("Please verify all fields are populated correctly.");
            return;
        }

        setLoading(true);
        try {
            if (editMode) {
                await api.put(`/material-transfer-slips/${currentId}`, form);
            } else {
                await api.post("/material-transfer-slips", form);
            }
            setOpen(false);
            fetchSlips();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this slip?")) {
            await api.delete(`/material-transfer-slips/${id}`);
            fetchSlips();
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5">Material Transfer Slips (MTS)</Typography>
                    <Typography variant="body2" color="text.secondary">Check materials transferred internally between stores/production</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    New Transfer Slip
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: "primary.main" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>Slip ID</TableCell>
                            <TableCell sx={{ color: "white" }}>MTA Ref</TableCell>
                            <TableCell sx={{ color: "white" }}>Product</TableCell>
                            <TableCell sx={{ color: "white" }}>Qty Checked</TableCell>
                            <TableCell sx={{ color: "white" }}>Material Status</TableCell>
                            <TableCell sx={{ color: "white" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {slips.map((mts) => (
                            <TableRow key={mts.id} hover>
                                <TableCell sx={{ fontWeight: "bold" }}>MTS-{mts.id.toString().padStart(4, '0')}</TableCell>
                                <TableCell>{mts.mta?.mta_no || `Ref #${mts.mta_id}`}</TableCell>
                                <TableCell>{mts.product?.name}</TableCell>
                                <TableCell>{mts.qty_checked}</TableCell>
                                <TableCell>
                                    <Chip label={mts.status} size="small" color={mts.status === 'OK' ? 'success' : 'error'} />
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleOpen(mts)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(mts.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? `Modify MTS Record` : "Create MTS Record"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={mtas}
                                getOptionLabel={(o) => o.mta_no || `ID: ${o.id}`}
                                value={mtas.find(g => g.id === form.mta_id) || null}
                                onChange={(_, val) => setForm({ ...form, mta_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Reference MTA" required />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={products}
                                getOptionLabel={(o) => o.name}
                                value={products.find(p => p.id === form.product_id) || null}
                                onChange={(_, val) => setForm({ ...form, product_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Product Code" required />}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Quantity Checked"
                                type="number"
                                required
                                value={form.qty_checked}
                                onChange={(e) => setForm({ ...form, qty_checked: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Material Status"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <MenuItem value="OK">OK</MenuItem>
                                <MenuItem value="Damaged">Damaged</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<Close />} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSubmit} disabled={loading}>
                        {editMode ? "Save Changes" : "Submit Slip"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
