import { useState, useEffect, useMemo } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, useTheme, alpha, Tooltip, MenuItem, Grid
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { hrService } from "../../../services/api";

const EMPTY = {
    employee_id: "", effective_date: new Date().toISOString().split("T")[0],
    basic: "", hra: "", da: "", pf_percentage: "", other_allowances: ""
};

export default function SalaryStructures() {
    const [structures, setStructures] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState("");
    const theme = useTheme();

    const load = async () => {
        try {
            const [sRes, eRes] = await Promise.all([
                hrService.getAll("salary-structures"),
                hrService.getAll("employees")
            ]);
            setStructures(sRes.data);
            setEmployees(eRes.data);
        }
        catch { setError("Failed to load data."); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(EMPTY); setEditing(null); setOpen(true); setError(""); };
    const openEdit = (s) => { setForm({ ...s }); setEditing(s.id); setOpen(true); setError(""); };
    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            if (editing) await hrService.update("salary-structures", editing, form);
            else await hrService.create("salary-structures", form);
            setOpen(false);
            load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this salary structure?")) return;
        try { await hrService.delete("salary-structures", id); load(); }
        catch { setError("Delete failed."); }
    };

    const field = (label, key, type = "text", props = {}) => (
        <TextField fullWidth margin="dense" size="small" label={label} type={type}
            value={form[key] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            {...props} />
    );

    const calcTotal = (s) => {
        return (parseFloat(s.basic) || 0) + (parseFloat(s.hra) || 0) + (parseFloat(s.da) || 0) + (parseFloat(s.other_allowances) || 0);
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Employee Salary Structures</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Define salary breakdowns for each employee</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Assign Structure</Button>
            </Box>
            {error && <Typography color="error" mb={2}>{error}</Typography>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["Employee", "Effective From", "Basic", "HRA", "DA", "Other", "Total Gross", "PF %", "Actions"].map((h) => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {structures.length === 0 ? (
                                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No salary structures found.</Typography>
                                </TableCell></TableRow>
                            ) : structures.map((s) => (
                                <TableRow key={s.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 600 }}>{s.employee?.name || `Emp #${s.employee_id}`}</TableCell>
                                    <TableCell>{s.effective_date || "N/A"}</TableCell>
                                    <TableCell>₹{parseFloat(s.basic || 0).toFixed(2)}</TableCell>
                                    <TableCell>₹{parseFloat(s.hra || 0).toFixed(2)}</TableCell>
                                    <TableCell>₹{parseFloat(s.da || 0).toFixed(2)}</TableCell>
                                    <TableCell>₹{parseFloat(s.other_allowances || 0).toFixed(2)}</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: "success.main" }}>₹{calcTotal(s).toFixed(2)}</TableCell>
                                    <TableCell>{parseFloat(s.pf_percentage || 0).toFixed(1)}%</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(s)}><Edit fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(s.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Edit Salary Structure" : "Assign Salary Structure"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Typography color="error" mb={1} variant="body2">{error}</Typography>}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 1 }}>
                        <TextField fullWidth margin="dense" select size="small" label="Employee *"
                            value={form.employee_id} onChange={(e) => setForm(f => ({ ...f, employee_id: e.target.value }))}
                            disabled={!!editing}>
                            {employees.map(emp => (
                                <MenuItem key={emp.id} value={emp.id}>{emp.name} ({emp.employee_code})</MenuItem>
                            ))}
                        </TextField>
                        <TextField fullWidth margin="dense" size="small" label="Effective Date *" type="date"
                            InputLabelProps={{ shrink: true }}
                            value={form.effective_date} onChange={(e) => setForm(f => ({ ...f, effective_date: e.target.value }))} />
                    </Box>

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 700, color: "text.secondary" }}>Earnings</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        {field("Basic (₹) *", "basic", "number")}
                        {field("HRA (₹)", "hra", "number")}
                        {field("DA (₹)", "da", "number")}
                        {field("Other Allowances (₹)", "other_allowances", "number")}
                    </Box>

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 700, color: "text.secondary" }}>Deductions Setup</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
                        {field("PF Percentage (%)", "pf_percentage", "number", { inputProps: { min: 0, max: 100, step: 0.1 } })}
                    </Box>
                    <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 1 }}>
                        <Typography variant="body2" fontWeight={600} color="success.dark">
                            Total Gross Pay: ₹{calcTotal(form).toFixed(2)}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
