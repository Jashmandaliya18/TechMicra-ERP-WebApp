import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, IconButton, Alert, Chip, Switch,
    FormControlLabel, Tooltip
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import api from "../../services/api";

const empty = {
    name: "", contact_person: "", phone: "", email: "",
    address: "", gst_no: "", vehicle_types: "", is_active: true,
};

export default function Transporters() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const load = async () => {
        try {
            const { data } = await api.get("/transporters");
            setRows(data);
        } catch { setError("Failed to load transporters"); }
    };

    useEffect(() => { load(); }, []);

    const handleOpen = (row = null) => {
        setEditing(row);
        setForm(row ? { ...row } : empty);
        setError("");
        setOpen(true);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (editing) {
                await api.put(`/transporters/${editing.id}`, form);
            } else {
                await api.post("/transporters", form);
            }
            setOpen(false);
            load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed");
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this transporter?")) return;
        try {
            await api.delete(`/transporters/${id}`);
            load();
        } catch { setError("Delete failed"); }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Transport Master</Typography>
                    <Typography variant="body2" color="text.secondary">Manage transporter vendors and vehicle types</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Transporter</Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "action.hover" }}>
                            {["Name", "Contact Person", "Phone", "GST No", "Vehicle Types", "Active", "Actions"].map(h => (
                                <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>No transporters yet. Add one to get started.</TableCell></TableRow>
                        ) : rows.map(row => (
                            <TableRow key={row.id} hover>
                                <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                                <TableCell>{row.contact_person || "—"}</TableCell>
                                <TableCell>{row.phone || "—"}</TableCell>
                                <TableCell>{row.gst_no || "—"}</TableCell>
                                <TableCell>{row.vehicle_types || "—"}</TableCell>
                                <TableCell>
                                    <Chip label={row.is_active ? "Active" : "Inactive"} size="small"
                                        color={row.is_active ? "success" : "default"} variant="outlined" />
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpen(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editing ? "Edit Transporter" : "New Transporter"}</DialogTitle>
                <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField label="Transporter Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} fullWidth size="small" />
                    <TextField label="Owner / Contact Person" value={form.contact_person} onChange={e => setForm(p => ({ ...p, contact_person: e.target.value }))} fullWidth size="small" />
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        <TextField label="Mobile" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} size="small" />
                        <TextField label="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} size="small" />
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        <TextField label="GSTIN" value={form.gst_no} onChange={e => setForm(p => ({ ...p, gst_no: e.target.value }))} size="small" />
                        <TextField label="Vehicle Types (e.g., Truck, Tempo)" value={form.vehicle_types} onChange={e => setForm(p => ({ ...p, vehicle_types: e.target.value }))} size="small" />
                    </Box>
                    <TextField label="Address" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} fullWidth size="small" multiline rows={2} />
                    <FormControlLabel control={<Switch checked={!!form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} />} label="Active" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
