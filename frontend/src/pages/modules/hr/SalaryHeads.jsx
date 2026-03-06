import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, useTheme, alpha, Chip, Tooltip, MenuItem, Switch, FormControlLabel
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { hrService } from "../../../services/api";

const EMPTY = { head_name: "", type: "Earning", is_active: true };

export default function SalaryHeads() {
    const [heads, setHeads] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState("");
    const theme = useTheme();

    const load = async () => {
        try { const { data } = await hrService.getAll("salary-heads"); setHeads(data); }
        catch { setError("Failed to load salary heads."); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(EMPTY); setEditing(null); setOpen(true); setError(""); };
    const openEdit = (h) => { setForm({ ...h, is_active: Boolean(h.is_active) }); setEditing(h.id); setOpen(true); setError(""); };
    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            if (editing) await hrService.update("salary-heads", editing, form);
            else await hrService.create("salary-heads", form);
            setOpen(false);
            load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this salary head?")) return;
        try { await hrService.delete("salary-heads", id); load(); }
        catch { setError("Delete failed."); }
    };

    const field = (label, key, type = "text", props = {}) => (
        <TextField fullWidth margin="dense" size="small" label={label} type={type}
            value={form[key] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            {...props} />
    );

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Salary Head Master</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Define earnings and deductions components</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Salary Head</Button>
            </Box>
            {error && <Typography color="error" mb={2}>{error}</Typography>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["Head Name", "Type", "Status", "Actions"].map((h) => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {heads.length === 0 ? (
                                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No salary heads found.</Typography>
                                </TableCell></TableRow>
                            ) : heads.map((h) => (
                                <TableRow key={h.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 600 }}>{h.head_name}</TableCell>
                                    <TableCell>
                                        <Chip size="small" label={h.type}
                                            color={h.type === "Earning" ? "success" : "error"} variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="small" label={h.is_active ? "Active" : "Inactive"}
                                            color={h.is_active ? "primary" : "default"} />
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(h)}><Edit fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(h.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Edit Salary Head" : "Add Salary Head"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Typography color="error" mb={1} variant="body2">{error}</Typography>}
                    {field("Head Name *", "head_name")}
                    <TextField fullWidth margin="dense" select size="small" label="Type *"
                        value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}>
                        <MenuItem value="Earning">Earning</MenuItem>
                        <MenuItem value="Deduction">Deduction</MenuItem>
                    </TextField>
                    <FormControlLabel control={
                        <Switch checked={form.is_active} onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))} color="primary" />
                    } label="Active Status" sx={{ mt: 1 }} />
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
