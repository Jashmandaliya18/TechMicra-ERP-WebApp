import React, { useState, useEffect } from "react";
import {
    Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, Alert
} from "@mui/material";
import { Add, Edit, Delete, Save, Close, Warehouse as WarehouseIcon } from "@mui/icons-material";
import api from "../../services/api";

export default function Warehouses() {
    const [warehouses, setWarehouses] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        address: "",
        manager_name: ""
    });

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const res = await api.get("/warehouses");
            setWarehouses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setEditMode(true);
            setCurrentId(item.id);
            setForm({
                name: item.name,
                address: item.address || "",
                manager_name: item.manager_name || ""
            });
        } else {
            setEditMode(false);
            setForm({
                name: "",
                address: "",
                manager_name: ""
            });
        }
        setOpen(true);
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.name) {
            setError("Warehouse Name is required.");
            return;
        }

        setLoading(true);
        try {
            if (editMode) {
                await api.put(`/warehouses/${currentId}`, form);
            } else {
                await api.post("/warehouses", form);
            }
            setOpen(false);
            fetchWarehouses();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this warehouse?")) {
            await api.delete(`/warehouses/${id}`);
            fetchWarehouses();
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5">Warehouse Master</Typography>
                    <Typography variant="body2" color="text.secondary">Manage your storage locations and warehouses</Typography>
                </Box>
                <Button variant="contained" startIcon={<WarehouseIcon />} onClick={() => handleOpen()}>
                    New Warehouse
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: "primary.main" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>Warehouse ID</TableCell>
                            <TableCell sx={{ color: "white" }}>Name</TableCell>
                            <TableCell sx={{ color: "white" }}>Address</TableCell>
                            <TableCell sx={{ color: "white" }}>Manager Name</TableCell>
                            <TableCell sx={{ color: "white" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {warehouses.map((wh) => (
                            <TableRow key={wh.id} hover>
                                <TableCell sx={{ fontWeight: "bold" }}>{wh.warehouse_id}</TableCell>
                                <TableCell>{wh.name}</TableCell>
                                <TableCell>{wh.address}</TableCell>
                                <TableCell>{wh.manager_name}</TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleOpen(wh)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(wh.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {warehouses.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No warehouses found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? `Modify Warehouse` : "New Warehouse"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Warehouse Name"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Manager Name"
                                value={form.manager_name}
                                onChange={(e) => setForm({ ...form, manager_name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Physical Address"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<Close />} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSubmit} disabled={loading}>
                        {editMode ? "Save Changes" : "Create Warehouse"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
