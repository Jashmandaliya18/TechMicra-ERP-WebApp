import React, { useState, useEffect } from "react";
import {
    Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Grid, Autocomplete, Alert, Chip
} from "@mui/material";
import { Add, Edit, Delete, Save, Close } from "@mui/icons-material";
import api from "../../services/api";

export default function ProcessQC() {
    const [pqcs, setPqcs] = useState([]);
    const [routecards, setRoutecards] = useState([]);
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        routecard_id: null,
        operation_stage: "",
        sample_size: 1,
        accepted_qty: 0,
        rejected_qty: 0,
        result: "Pass",
        inspected_by: null,
        inspection_date: new Date().toISOString().split('T')[0],
        remarks: ""
    });

    useEffect(() => {
        fetchPqcs();
        api.get("/routecards").then(res => setRoutecards(res.data)).catch(() => { });
        api.get("/users").then(res => setUsers(res.data)).catch(() => { });
    }, []);

    const fetchPqcs = async () => {
        try {
            const res = await api.get("/process-quality-controls");
            setPqcs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setEditMode(true);
            setCurrentId(item.id);
            setForm({
                routecard_id: item.routecard_id,
                operation_stage: item.operation_stage,
                sample_size: item.sample_size,
                accepted_qty: item.accepted_qty,
                rejected_qty: item.rejected_qty,
                result: item.result,
                inspected_by: item.inspected_by,
                inspection_date: item.inspection_date,
                remarks: item.remarks || ""
            });
        } else {
            setEditMode(false);
            setForm({
                routecard_id: null,
                operation_stage: "",
                sample_size: 1,
                accepted_qty: 0,
                rejected_qty: 0,
                result: "Pass",
                inspected_by: users.length > 0 ? users[0].id : null,
                inspection_date: new Date().toISOString().split('T')[0],
                remarks: ""
            });
        }
        setOpen(true);
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.routecard_id || !form.operation_stage || !form.inspected_by) {
            setError("Please fill all required fields correctly.");
            return;
        }

        setLoading(true);
        try {
            if (editMode) {
                await api.put(`/process-quality-controls/${currentId}`, form);
            } else {
                await api.post("/process-quality-controls", form);
            }
            setOpen(false);
            fetchPqcs();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this PQC record?")) {
            await api.delete(`/process-quality-controls/${id}`);
            fetchPqcs();
        }
    };

    const getResultColor = (result) => {
        if (result === 'Pass') return 'success';
        if (result === 'Fail') return 'error';
        return 'warning';
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5">Process Quality Control (PQC)</Typography>
                    <Typography variant="body2" color="text.secondary">In-process checks during manufacturing stages</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    New PQC Record
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: "primary.main" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>PQC No</TableCell>
                            <TableCell sx={{ color: "white" }}>Routecard</TableCell>
                            <TableCell sx={{ color: "white" }}>Stage</TableCell>
                            <TableCell sx={{ color: "white" }}>Inspector</TableCell>
                            <TableCell sx={{ color: "white" }}>Date</TableCell>
                            <TableCell sx={{ color: "white" }}>Result</TableCell>
                            <TableCell sx={{ color: "white" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pqcs.map((pqc) => (
                            <TableRow key={pqc.id} hover>
                                <TableCell sx={{ fontWeight: "bold" }}>{pqc.pqc_no}</TableCell>
                                <TableCell>{pqc.routecard?.routecard_no || `Ref #${pqc.routecard_id}`}</TableCell>
                                <TableCell>{pqc.operation_stage}</TableCell>
                                <TableCell>{pqc.user?.name || "Unknown"}</TableCell>
                                <TableCell>{pqc.inspection_date}</TableCell>
                                <TableCell>
                                    <Chip label={pqc.result} size="small" color={getResultColor(pqc.result)} />
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleOpen(pqc)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(pqc.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editMode ? `Modify PQC Record` : "New PQC Record"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={routecards}
                                getOptionLabel={(o) => o.routecard_no || `ID: ${o.id}`}
                                value={routecards.find(r => r.id === form.routecard_id) || null}
                                onChange={(_, val) => setForm({ ...form, routecard_id: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Reference Routecard" required />}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Operation Stage"
                                required
                                placeholder="e.g. After Welding, Pre-Painting"
                                value={form.operation_stage}
                                onChange={(e) => setForm({ ...form, operation_stage: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Sample Size"
                                type="number"
                                required
                                value={form.sample_size}
                                onChange={(e) => setForm({ ...form, sample_size: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Accepted Qty"
                                type="number"
                                required
                                value={form.accepted_qty}
                                onChange={(e) => setForm({ ...form, accepted_qty: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Rejected Qty"
                                type="number"
                                required
                                value={form.rejected_qty}
                                onChange={(e) => setForm({ ...form, rejected_qty: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                select
                                label="Result"
                                required
                                value={form.result}
                                onChange={(e) => setForm({ ...form, result: e.target.value })}
                            >
                                <MenuItem value="Pass">Pass</MenuItem>
                                <MenuItem value="Fail">Fail</MenuItem>
                                <MenuItem value="Conditional">Conditional</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={users}
                                getOptionLabel={(o) => o.name}
                                value={users.find(u => u.id === form.inspected_by) || null}
                                onChange={(_, val) => setForm({ ...form, inspected_by: val?.id || null })}
                                renderInput={(params) => <TextField {...params} label="Inspector (User)" required />}
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
                                label="Remarks / Observations"
                                value={form.remarks}
                                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<Close />} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSubmit} disabled={loading}>
                        {editMode ? "Save Changes" : "Submit PQC"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
