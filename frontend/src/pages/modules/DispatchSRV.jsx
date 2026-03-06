import React, { useState, useEffect } from "react";
import {
    Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, Autocomplete, Alert, Checkbox, FormControlLabel
} from "@mui/material";
import { Add, Edit, Delete, Save, Close, LocalShipping } from "@mui/icons-material";
import api from "../../services/api";

export default function DispatchSRV() {
    const [srvs, setSrvs] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        date: new Date().toISOString().split('T')[0],
        party_name: "",
        product_id: null,
        qty: 1,
        return_expected: false,
        return_expected_date: ""
    });

    useEffect(() => {
        fetchSrvs();
        api.get("/products").then(res => setProducts(res.data)).catch(() => { });
    }, []);

    const fetchSrvs = async () => {
        try {
            const res = await api.get("/dispatch-srvs");
            setSrvs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setEditMode(true);
            setCurrentId(item.id);
            setForm({
                date: item.date,
                party_name: item.party_name,
                product_id: item.product_id,
                qty: item.qty,
                return_expected: item.return_expected === 1,
                return_expected_date: item.return_expected_date || ""
            });
        } else {
            setEditMode(false);
            setForm({
                date: new Date().toISOString().split('T')[0],
                party_name: "",
                product_id: null,
                qty: 1,
                return_expected: false,
                return_expected_date: ""
            });
        }
        setOpen(true);
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.party_name || !form.product_id) {
            setError("Party Name and Product are required.");
            return;
        }

        const dataToSubmit = { ...form };
        if (!dataToSubmit.return_expected) {
            dataToSubmit.return_expected_date = null;
        }

        setLoading(true);
        try {
            if (editMode) {
                await api.put(`/dispatch-srvs/${currentId}`, dataToSubmit);
            } else {
                await api.post("/dispatch-srvs", dataToSubmit);
            }
            setOpen(false);
            fetchSrvs();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this SRV?")) {
            await api.delete(`/dispatch-srvs/${id}`);
            fetchSrvs();
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5">Dispatch Service Voucher (SRV)</Typography>
                    <Typography variant="body2" color="text.secondary">Non-sales outward movements (e.g., Returnable Gate Passes)</Typography>
                </Box>
                <Button variant="contained" startIcon={<LocalShipping />} onClick={() => handleOpen()}>
                    New Dispatch SRV
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: "primary.main" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>SRV No</TableCell>
                            <TableCell sx={{ color: "white" }}>Date</TableCell>
                            <TableCell sx={{ color: "white" }}>Party Name</TableCell>
                            <TableCell sx={{ color: "white" }}>Item</TableCell>
                            <TableCell sx={{ color: "white", align: "center" }}>Qty</TableCell>
                            <TableCell sx={{ color: "white", align: "center" }}>Return Expected?</TableCell>
                            <TableCell sx={{ color: "white" }}>Return Due</TableCell>
                            <TableCell sx={{ color: "white" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {srvs.map((srv) => (
                            <TableRow key={srv.id} hover>
                                <TableCell sx={{ fontWeight: "bold" }}>{srv.srv_no}</TableCell>
                                <TableCell>{srv.date}</TableCell>
                                <TableCell>{srv.party_name}</TableCell>
                                <TableCell>{srv.product?.name}</TableCell>
                                <TableCell align="center" sx={{ fontWeight: "medium" }}>{srv.qty}</TableCell>
                                <TableCell align="center">{srv.return_expected ? "Yes" : "No"}</TableCell>
                                <TableCell>{srv.return_expected ? srv.return_expected_date : "—"}</TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleOpen(srv)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(srv.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? `Modify SRV` : "Create Delivery/Service Voucher"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Dispatch Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                required
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Party/Vendor Name"
                                required
                                value={form.party_name}
                                onChange={(e) => setForm({ ...form, party_name: e.target.value })}
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
                                label="Quantity"
                                type="number"
                                required
                                value={form.qty}
                                onChange={(e) => setForm({ ...form, qty: parseInt(e.target.value) || 1 })}
                            />
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox checked={form.return_expected} onChange={(e) => setForm({ ...form, return_expected: e.target.checked })} />}
                                label="Return Expected?"
                            />
                        </Grid>

                        {form.return_expected && (
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Return Due Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    required={form.return_expected}
                                    value={form.return_expected_date}
                                    onChange={(e) => setForm({ ...form, return_expected_date: e.target.value })}
                                />
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<Close />} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSubmit} disabled={loading}>
                        {editMode ? "Save Changes" : "Submit SRV"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
