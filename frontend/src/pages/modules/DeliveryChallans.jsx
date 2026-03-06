import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel, useTheme, alpha, Alert, Tooltip
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { getDispatchAdvices, createDispatchAdvice, updateDispatchAdvice, deleteDispatchAdvice, getSaleOrders } from "../../services/api";

export default function DispatchAdvicePage() {
    const [rows, setRows] = useState([]);
    const [saleOrders, setSaleOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ sale_order_id: "", transporter_name: "", vehicle_no: "", driver_name: "" });
    const theme = useTheme();

    const load = async () => {
        try {
            const [da, so] = await Promise.all([getDispatchAdvices(), getSaleOrders()]);
            setRows(da.data);
            setSaleOrders(so.data.filter(s => s.status === "Pending"));
        } catch { setError("Failed to load."); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm({ sale_order_id: "", transporter_name: "", vehicle_no: "", driver_name: "" }); setEditing(null); setOpen(true); setError(""); };
    const openEdit = (row) => { setForm({ sale_order_id: row.sale_order_id, transporter_name: row.transporter_name || "", vehicle_no: row.vehicle_no || "", driver_name: row.driver_name || "" }); setEditing(row.id); setOpen(true); setError(""); };

    const handleSave = async () => {
        try {
            if (editing) await updateDispatchAdvice(editing, { transporter_name: form.transporter_name, vehicle_no: form.vehicle_no, driver_name: form.driver_name });
            else await createDispatchAdvice(form);
            setOpen(false); load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this dispatch advice?")) return;
        try { await deleteDispatchAdvice(id); load(); }
        catch { setError("Delete failed."); }
    };

    const f = (label, key, type = "text") => (
        <TextField fullWidth margin="dense" size="small" label={label} type={type}
            value={form[key] ?? ""} onChange={e => setForm(fm => ({ ...fm, [key]: e.target.value }))} />
    );

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Dispatch Advice</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Warehouse dispatch instructions — auto-marks Sale Order as Dispatched</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>New Dispatch</Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["Dispatch ID", "Sale Order", "Customer", "Transporter", "Vehicle", "Driver", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No dispatches yet.</Typography>
                                </TableCell></TableRow>
                            ) : rows.map(row => (
                                <TableRow key={row.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>{row.dispatch_id}</TableCell>
                                    <TableCell>{row.sale_order?.so_no || "—"}</TableCell>
                                    <TableCell>{row.sale_order?.customer?.name || "—"}</TableCell>
                                    <TableCell>{row.transporter_name || "—"}</TableCell>
                                    <TableCell>{row.vehicle_no || "—"}</TableCell>
                                    <TableCell>{row.driver_name || "—"}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(row)}><Edit fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight={700}>{editing ? "Edit Dispatch Advice" : "New Dispatch Advice"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
                    {!editing && (
                        <FormControl fullWidth margin="dense" size="small">
                            <InputLabel>Sale Order *</InputLabel>
                            <Select value={form.sale_order_id} label="Sale Order *" onChange={e => setForm(fm => ({ ...fm, sale_order_id: e.target.value }))}>
                                {saleOrders.map(s => <MenuItem key={s.id} value={s.id}>{s.so_no} – {s.customer?.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    )}
                    {f("Transporter Name", "transporter_name")}
                    {f("Vehicle Number", "vehicle_no")}
                    {f("Driver Name", "driver_name")}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save Dispatch</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
