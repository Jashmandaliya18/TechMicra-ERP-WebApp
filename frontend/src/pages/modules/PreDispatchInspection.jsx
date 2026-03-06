import React, { useState, useEffect } from "react";
import {
    Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Grid, Autocomplete, Alert, Chip
} from "@mui/material";
import { Add, Edit, Delete, Save, Close } from "@mui/icons-material";
import api from "../../services/api";

export default function PreDispatchInspection() {
    const [pdis, setPdis] = useState([]);
    const [saleOrders, setSaleOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        sale_order_id: null,
        product_id: null,
        inspected_qty: 1,
        passed_qty: 0,
        failed_qty: 0,
        box_no: "",
        packaging_condition: "OK",
        label_accuracy: "Pass",
        result: "Approved",
        inspected_by: null,
        inspection_date: new Date().toISOString().split('T')[0],
        remarks: ""
    });

    useEffect(() => {
        fetchPdis();
        api.get("/sale-orders").then(res => setSaleOrders(res.data)).catch(() => { });
        api.get("/products").then(res => setProducts(res.data)).catch(() => { });
        api.get("/users").then(res => setUsers(res.data)).catch(() => { });
    }, []);

    const fetchPdis = async () => {
        try {
            const res = await api.get("/pre-dispatch-inspections");
            setPdis(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setEditMode(true);
            setCurrentId(item.id);
            setForm({
                sale_order_id: item.sale_order_id,
                product_id: item.product_id,
                inspected_qty: item.inspected_qty,
                passed_qty: item.passed_qty,
                failed_qty: item.failed_qty,
                box_no: item.box_no || "",
                packaging_condition: item.packaging_condition || "OK",
                label_accuracy: item.label_accuracy || "Pass",
                result: item.result,
                inspected_by: item.inspected_by,
                inspection_date: item.inspection_date,
                remarks: item.remarks || ""
            });
        } else {
            setEditMode(false);
            setForm({
                sale_order_id: null,
                product_id: null,
                inspected_qty: 1,
                passed_qty: 0,
                failed_qty: 0,
                box_no: "",
                packaging_condition: "OK",
                label_accuracy: "Pass",
                result: "Approved",
                inspected_by: users.length > 0 ? users[0].id : null,
                inspection_date: new Date().toISOString().split('T')[0],
                remarks: ""
            });
        }
        setOpen(true);
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.sale_order_id || !form.product_id || !form.inspected_by) {
            setError("Please fill all required fields correctly.");
            return;
        }

        setLoading(true);
        try {
            if (editMode) {
                await api.put(`/pre-dispatch-inspections/${currentId}`, form);
            } else {
                await api.post("/pre-dispatch-inspections", form);
            }
            setOpen(false);
            fetchPdis();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this PDI record?")) {
            await api.delete(`/pre-dispatch-inspections/${id}`);
            fetchPdis();
        }
    };

    const getResultColor = (result) => {
        if (result === 'Approved') return 'success';
        if (result === 'Rejected') return 'error';
        return 'warning';
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5">Pre-Dispatch Inspection (PDI)</Typography>
                    <Typography variant="body2" color="text.secondary">Final audits before shipping orders to customers</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    New Dispatch Audit
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: "primary.main" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>PDI No</TableCell>
                            <TableCell sx={{ color: "white" }}>SO Ref</TableCell>
                            <TableCell sx={{ color: "white" }}>Product</TableCell>
                            <TableCell sx={{ color: "white" }}>Inspected Qty</TableCell>
                            <TableCell sx={{ color: "white" }}>Packaging</TableCell>
                            <TableCell sx={{ color: "white" }}>Result</TableCell>
                            <TableCell sx={{ color: "white" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pdis.map((pdi) => (
                            <TableRow key={pdi.id} hover>
                                <TableCell sx={{ fontWeight: "bold" }}>{pdi.pdi_no}</TableCell>
                                <TableCell>{pdi.sale_order?.so_no || `Ref #${pdi.sale_order_id}`}</TableCell>
                                <TableCell>{pdi.product?.name}</TableCell>
                                <TableCell>{pdi.inspected_qty}</TableCell>
                                <TableCell>{pdi.packaging_condition}</TableCell>
                                <TableCell>
                                    <Chip label={pdi.result} size="small" color={getResultColor(pdi.result)} />
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleOpen(pdi)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(pdi.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editMode ? `Modify PDI Record` : "New Pre-Dispatch Inspection"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={saleOrders}
                                getOptionLabel={(o) => o.so_no || `ID: ${o.id}`}
                                value={saleOrders.find(s => s.id === form.sale_order_id) || null}
                                onChange={(_, val) => setForm({ ...form, sale_order_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Reference Sale Order" required />}
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

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Inspected Qty"
                                type="number"
                                required
                                value={form.inspected_qty}
                                onChange={(e) => setForm({ ...form, inspected_qty: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Passed Qty"
                                type="number"
                                required
                                value={form.passed_qty}
                                onChange={(e) => setForm({ ...form, passed_qty: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Failed Qty"
                                type="number"
                                required
                                value={form.failed_qty}
                                onChange={(e) => setForm({ ...form, failed_qty: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Box No."
                                required
                                value={form.box_no}
                                onChange={(e) => setForm({ ...form, box_no: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                select
                                label="Packaging Condition"
                                value={form.packaging_condition}
                                onChange={(e) => setForm({ ...form, packaging_condition: e.target.value })}
                            >
                                <MenuItem value="OK">OK</MenuItem>
                                <MenuItem value="Damaged">Damaged</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                select
                                label="Label Accuracy"
                                value={form.label_accuracy}
                                onChange={(e) => setForm({ ...form, label_accuracy: e.target.value })}
                            >
                                <MenuItem value="Pass">Pass</MenuItem>
                                <MenuItem value="Fail">Fail</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                select
                                label="Overall Result"
                                required
                                value={form.result}
                                onChange={(e) => setForm({ ...form, result: e.target.value })}
                            >
                                <MenuItem value="Approved">Approved</MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                                <MenuItem value="Conditional">Conditional</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={users}
                                getOptionLabel={(o) => o.name}
                                value={users.find(u => u.id === form.inspected_by) || null}
                                onChange={(_, val) => setForm({ ...form, inspected_by: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Inspector" required />}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Inspection Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                required
                                value={form.inspection_date}
                                onChange={(e) => setForm({ ...form, inspection_date: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Remarks"
                                value={form.remarks}
                                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<Close />} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSubmit} disabled={loading}>
                        {editMode ? "Save Changes" : "Submit Audit"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
