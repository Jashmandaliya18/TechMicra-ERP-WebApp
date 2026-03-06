import React, { useState, useEffect } from "react";
import {
    Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, Autocomplete, Alert, MenuItem, Chip
} from "@mui/material";
import { Add, Edit, Delete, Save, Close, CompareArrows } from "@mui/icons-material";
import api from "../../services/api";

export default function WarehouseTransfers() {
    const [transfers, setTransfers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        transfer_date: new Date().toISOString().split('T')[0],
        from_warehouse_id: null,
        to_warehouse_id: null,
        product_id: null,
        qty: 1,
        status: "Pending"
    });

    useEffect(() => {
        fetchTransfers();
        api.get("/warehouses").then(res => setWarehouses(res.data)).catch(() => { });
        api.get("/products").then(res => setProducts(res.data)).catch(() => { });
    }, []);

    const fetchTransfers = async () => {
        try {
            const res = await api.get("/warehouse-transfers");
            setTransfers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setEditMode(true);
            setCurrentId(item.id);
            setForm({
                transfer_date: item.transfer_date,
                from_warehouse_id: item.from_warehouse_id,
                to_warehouse_id: item.to_warehouse_id,
                product_id: item.product_id,
                qty: item.qty,
                status: item.status
            });
        } else {
            setEditMode(false);
            setForm({
                transfer_date: new Date().toISOString().split('T')[0],
                from_warehouse_id: null,
                to_warehouse_id: null,
                product_id: null,
                qty: 1,
                status: "Pending"
            });
        }
        setOpen(true);
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.from_warehouse_id || !form.to_warehouse_id || !form.product_id) {
            setError("Source, Destination, and Product fields are essential.");
            return;
        }

        if (form.from_warehouse_id === form.to_warehouse_id) {
            setError("Source and Destination warehouses must be different.");
            return;
        }

        setLoading(true);
        try {
            if (editMode) {
                await api.put(`/warehouse-transfers/${currentId}`, form);
            } else {
                await api.post("/warehouse-transfers", form);
            }
            setOpen(false);
            fetchTransfers();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this transfer request?")) {
            await api.delete(`/warehouse-transfers/${id}`);
            fetchTransfers();
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5">Inter-Warehouse Stock Transfers</Typography>
                    <Typography variant="body2" color="text.secondary">Move materials directly from one central store location to another</Typography>
                </Box>
                <Button variant="contained" startIcon={<CompareArrows />} onClick={() => handleOpen()}>
                    New Transfer
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: "primary.main" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>Transfer ID</TableCell>
                            <TableCell sx={{ color: "white" }}>Date</TableCell>
                            <TableCell sx={{ color: "white" }}>Source WH</TableCell>
                            <TableCell sx={{ color: "white" }}>Target WH</TableCell>
                            <TableCell sx={{ color: "white" }}>Item Name</TableCell>
                            <TableCell sx={{ color: "white", align: "right" }}>Qty</TableCell>
                            <TableCell sx={{ color: "white", align: "center" }}>Status</TableCell>
                            <TableCell sx={{ color: "white" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transfers.map((t) => (
                            <TableRow key={t.id} hover>
                                <TableCell sx={{ fontWeight: "bold" }}>{t.transfer_id}</TableCell>
                                <TableCell>{t.transfer_date}</TableCell>
                                <TableCell>{t.from_warehouse?.name}</TableCell>
                                <TableCell>{t.to_warehouse?.name}</TableCell>
                                <TableCell>{t.product?.name}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: "medium" }}>{t.qty}</TableCell>
                                <TableCell align="center">
                                    <Chip label={t.status} size="small" color={t.status === 'Completed' ? 'success' : 'warning'} />
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleOpen(t)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(t.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? `Modify Transfer Details` : "Initiate Stock Transfer"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={warehouses}
                                getOptionLabel={(o) => o.name}
                                value={warehouses.find(w => w.id === form.from_warehouse_id) || null}
                                onChange={(_, val) => setForm({ ...form, from_warehouse_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Source (From)" required />}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={warehouses}
                                getOptionLabel={(o) => o.name}
                                value={warehouses.find(w => w.id === form.to_warehouse_id) || null}
                                onChange={(_, val) => setForm({ ...form, to_warehouse_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Target (To)" required />}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Autocomplete
                                options={products}
                                getOptionLabel={(o) => o.name}
                                value={products.find(p => p.id === form.product_id) || null}
                                onChange={(_, val) => setForm({ ...form, product_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Item/Material" required />}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Transfer Qty"
                                type="number"
                                required
                                value={form.qty}
                                onChange={(e) => setForm({ ...form, qty: parseInt(e.target.value) || 1 })}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Transfer Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                required
                                value={form.transfer_date}
                                onChange={(e) => setForm({ ...form, transfer_date: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<Close />} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSubmit} disabled={loading}>
                        {editMode ? "Save Changes" : "Create Transfer"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
