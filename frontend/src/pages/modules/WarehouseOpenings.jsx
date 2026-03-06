import React, { useState, useEffect } from "react";
import {
    Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, Autocomplete, Alert
} from "@mui/material";
import { Add, Edit, Delete, Save, Close, Inventory2 } from "@mui/icons-material";
import api from "../../services/api";

export default function WarehouseOpenings() {
    const [openings, setOpenings] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        warehouse_id: null,
        product_id: null,
        opening_qty: 0,
        value: 0,
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchOpenings();
        api.get("/warehouses").then(res => setWarehouses(res.data)).catch(() => { });
        api.get("/products").then(res => setProducts(res.data)).catch(() => { });
    }, []);

    const fetchOpenings = async () => {
        try {
            const res = await api.get("/warehouse-openings");
            setOpenings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setEditMode(true);
            setCurrentId(item.id);
            setForm({
                warehouse_id: item.warehouse_id,
                product_id: item.product_id,
                opening_qty: item.opening_qty,
                value: item.value,
                date: item.date
            });
        } else {
            setEditMode(false);
            setForm({
                warehouse_id: null,
                product_id: null,
                opening_qty: 0,
                value: 0,
                date: new Date().toISOString().split('T')[0]
            });
        }
        setOpen(true);
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.warehouse_id || !form.product_id) {
            setError("Please select a warehouse and a product.");
            return;
        }

        setLoading(true);
        try {
            if (editMode) {
                await api.put(`/warehouse-openings/${currentId}`, form);
            } else {
                await api.post("/warehouse-openings", form);
            }
            setOpen(false);
            fetchOpenings();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this opening stock entry?")) {
            await api.delete(`/warehouse-openings/${id}`);
            fetchOpenings();
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5">Warehouse Opening Stock</Typography>
                    <Typography variant="body2" color="text.secondary">Initialize stock levels per warehouse</Typography>
                </Box>
                <Button variant="contained" startIcon={<Inventory2 />} onClick={() => handleOpen()}>
                    Add Initial Stock
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: "primary.main" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>Entry ID</TableCell>
                            <TableCell sx={{ color: "white" }}>Date</TableCell>
                            <TableCell sx={{ color: "white" }}>Warehouse</TableCell>
                            <TableCell sx={{ color: "white" }}>Item Name</TableCell>
                            <TableCell sx={{ color: "white", align: "right" }}>Opening Qty</TableCell>
                            <TableCell sx={{ color: "white", align: "right" }}>Total Value</TableCell>
                            <TableCell sx={{ color: "white" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {openings.map((op) => (
                            <TableRow key={op.id} hover>
                                <TableCell sx={{ fontWeight: "bold" }}>{op.opening_id}</TableCell>
                                <TableCell>{op.date}</TableCell>
                                <TableCell>{op.warehouse?.name}</TableCell>
                                <TableCell>{op.product?.name}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: "medium" }}>{op.opening_qty}</TableCell>
                                <TableCell align="right">₹{parseFloat(op.value).toFixed(2)}</TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleOpen(op)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(op.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? `Modify Opening Stock` : "New Opening Stock"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={warehouses}
                                getOptionLabel={(o) => o.name}
                                value={warehouses.find(w => w.id === form.warehouse_id) || null}
                                onChange={(_, val) => setForm({ ...form, warehouse_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Target Warehouse" required />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={products}
                                getOptionLabel={(o) => o.name}
                                value={products.find(p => p.id === form.product_id) || null}
                                onChange={(_, val) => setForm({ ...form, product_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Select Item" required />}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Opening Qty"
                                type="number"
                                required
                                value={form.opening_qty}
                                onChange={(e) => setForm({ ...form, opening_qty: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Total Value (₹)"
                                type="number"
                                required
                                value={form.value}
                                onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Opening Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                required
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<Close />} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSubmit} disabled={loading}>
                        {editMode ? "Save Changes" : "Save Stock"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
