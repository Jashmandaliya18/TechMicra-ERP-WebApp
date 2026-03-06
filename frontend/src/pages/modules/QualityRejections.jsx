import React, { useState, useEffect } from "react";
import {
    Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Grid, Autocomplete, Alert, Chip
} from "@mui/material";
import { Add, Edit, Delete, Save, Close, AssuredWorkload } from "@mui/icons-material";
import api from "../../services/api";

export default function QualityRejections() {
    const [qrds, setQrds] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        product_id: null,
        rejected_qty: 1,
        source: "IQC",
        disposal_action: "Scrap",
        reason: "",
        disposed_by: null,
        disposal_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchQrds();
        api.get("/products").then(res => setProducts(res.data)).catch(() => { });
        api.get("/users").then(res => setUsers(res.data)).catch(() => { });
    }, []);

    const fetchQrds = async () => {
        try {
            const res = await api.get("/quality-rejection-disposals");
            setQrds(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setEditMode(true);
            setCurrentId(item.id);
            setForm({
                product_id: item.product_id,
                rejected_qty: item.rejected_qty,
                source: item.source,
                disposal_action: item.disposal_action,
                reason: item.reason || "",
                disposed_by: item.disposed_by,
                disposal_date: item.disposal_date
            });
        } else {
            setEditMode(false);
            setForm({
                product_id: null,
                rejected_qty: 1,
                source: "IQC",
                disposal_action: "Scrap",
                reason: "",
                disposed_by: users.length > 0 ? users[0].id : null,
                disposal_date: new Date().toISOString().split('T')[0]
            });
        }
        setOpen(true);
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.product_id || !form.disposed_by || !form.reason) {
            setError("Please fill all required fields correctly (including reason).");
            return;
        }

        setLoading(true);
        try {
            if (editMode) {
                await api.put(`/quality-rejection-disposals/${currentId}`, form);
            } else {
                await api.post("/quality-rejection-disposals", form);
            }
            setOpen(false);
            fetchQrds();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this QRD record?")) {
            await api.delete(`/quality-rejection-disposals/${id}`);
            fetchQrds();
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'Scrap': return 'error';
            case 'Rework': return 'warning';
            case 'Return': return 'secondary';
            case 'Downgrade': return 'info';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5">Quality Rejection & Disposal (QRD)</Typography>
                    <Typography variant="body2" color="text.secondary">Handle defective products and determine disposal actions</Typography>
                </Box>
                <Button variant="contained" color="error" startIcon={<AssuredWorkload />} onClick={() => handleOpen()}>
                    New Disposal Record
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: "primary.main" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>QRD No</TableCell>
                            <TableCell sx={{ color: "white" }}>Product</TableCell>
                            <TableCell sx={{ color: "white" }}>Qty</TableCell>
                            <TableCell sx={{ color: "white" }}>Source</TableCell>
                            <TableCell sx={{ color: "white" }}>Disposal Action</TableCell>
                            <TableCell sx={{ color: "white" }}>Date</TableCell>
                            <TableCell sx={{ color: "white" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {qrds.map((qrd) => (
                            <TableRow key={qrd.id} hover>
                                <TableCell sx={{ fontWeight: "bold" }}>{qrd.qrd_no}</TableCell>
                                <TableCell>{qrd.product?.name}</TableCell>
                                <TableCell sx={{ fontWeight: "medium", color: "error.main" }}>{qrd.rejected_qty}</TableCell>
                                <TableCell>{qrd.source}</TableCell>
                                <TableCell>
                                    <Chip label={qrd.disposal_action} size="small" color={getActionColor(qrd.disposal_action)} />
                                </TableCell>
                                <TableCell>{qrd.disposal_date}</TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleOpen(qrd)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(qrd.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editMode ? `Modify QRD Record` : "Defect Disposal Decision"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={products}
                                getOptionLabel={(o) => o.name}
                                value={products.find(p => p.id === form.product_id) || null}
                                onChange={(_, val) => setForm({ ...form, product_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Defective Product" required />}
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
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="Rejection Source"
                                required
                                value={form.source}
                                onChange={(e) => setForm({ ...form, source: e.target.value })}
                            >
                                <MenuItem value="IQC">IQC (Incoming)</MenuItem>
                                <MenuItem value="PQC">PQC (Process)</MenuItem>
                                <MenuItem value="PDI">PDI (Pre-Dispatch)</MenuItem>
                                <MenuItem value="Customer Return">Customer Return</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                select
                                label="Disposal Action"
                                required
                                value={form.disposal_action}
                                onChange={(e) => setForm({ ...form, disposal_action: e.target.value })}
                            >
                                <MenuItem value="Scrap">Scrap</MenuItem>
                                <MenuItem value="Return">Return to Vendor</MenuItem>
                                <MenuItem value="Rework">Rework</MenuItem>
                                <MenuItem value="Downgrade">Downgrade / Use As-Is</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={users}
                                getOptionLabel={(o) => o.name}
                                value={users.find(u => u.id === form.disposed_by) || null}
                                onChange={(_, val) => setForm({ ...form, disposed_by: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Approved By (User)" required />}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Decision Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                required
                                value={form.disposal_date}
                                onChange={(e) => setForm({ ...form, disposal_date: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Reason for Defect / Remarks"
                                required
                                value={form.reason}
                                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<Close />} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="error" startIcon={<Save />} onClick={handleSubmit} disabled={loading}>
                        {editMode ? "Save Changes" : "Confirm Disposal"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
