import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, useTheme, alpha, Chip, Tooltip, MenuItem
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { hrService } from "../../../services/api";

const EMPTY = {
    employee_id: "", month: new Date().getMonth() + 1, year: new Date().getFullYear(),
    total_days: 30, present_days: 30, calculated_gross: 0, deductions: 0,
    net_pay: 0, payment_status: "Pending"
};

export default function Payroll() {
    const [payrolls, setPayrolls] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState("");
    const theme = useTheme();

    const load = async () => {
        try {
            const [pRes, eRes] = await Promise.all([
                hrService.getAll("payroll"),
                hrService.getAll("employees")
            ]);
            setPayrolls(pRes.data);
            setEmployees(eRes.data);
        }
        catch { setError("Failed to load data."); }
    };

    useEffect(() => { load(); }, []);

    // Auto calculate net pay when gross or deductions change
    useEffect(() => {
        const net = (parseFloat(form.calculated_gross) || 0) - (parseFloat(form.deductions) || 0);
        setForm(f => ({ ...f, net_pay: net > 0 ? net : 0 }));
    }, [form.calculated_gross, form.deductions]);

    const openAdd = () => { setForm(EMPTY); setEditing(null); setOpen(true); setError(""); };
    const openEdit = (p) => { setForm({ ...p }); setEditing(p.id); setOpen(true); setError(""); };
    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            if (editing) await hrService.update("payroll", editing, form);
            else await hrService.create("payroll", form);
            setOpen(false);
            load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this payroll record?")) return;
        try { await hrService.delete("payroll", id); load(); }
        catch { setError("Delete failed."); }
    };

    const field = (label, key, type = "text", props = {}) => (
        <TextField fullWidth margin="dense" size="small" label={label} type={type}
            value={form[key] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            {...props} />
    );

    const getMonthName = (m) => new Date(2000, m - 1, 1).toLocaleString('default', { month: 'short' });

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Employee Salary Sheets (Payroll)</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Generate and manage monthly payroll</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Generate Payroll</Button>
            </Box>
            {error && <Typography color="error" mb={2}>{error}</Typography>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["Employee", "Period", "Attendance", "Gross", "Deductions", "Net Pay", "Status", "Actions"].map((h) => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payrolls.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No payroll records found.</Typography>
                                </TableCell></TableRow>
                            ) : payrolls.map((p) => (
                                <TableRow key={p.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 600 }}>{p.employee?.name || `Emp #${p.employee_id}`}</TableCell>
                                    <TableCell>{getMonthName(p.month)} {p.year}</TableCell>
                                    <TableCell>{p.present_days} / {p.total_days} Days</TableCell>
                                    <TableCell>₹{parseFloat(p.calculated_gross || 0).toFixed(2)}</TableCell>
                                    <TableCell sx={{ color: "error.main" }}>-₹{parseFloat(p.deductions || 0).toFixed(2)}</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: "success.main" }}>₹{parseFloat(p.net_pay || 0).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Chip size="small" label={p.payment_status}
                                            color={p.payment_status === "Paid" ? "success" : "warning"} variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(p)}><Edit fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Edit Payroll" : "Generate Payroll"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Typography color="error" mb={1} variant="body2">{error}</Typography>}

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr", mb: 2 }}>
                        <TextField fullWidth margin="dense" select size="small" label="Employee *"
                            value={form.employee_id} onChange={(e) => setForm(f => ({ ...f, employee_id: e.target.value }))}
                            disabled={!!editing}>
                            {employees.map(emp => (
                                <MenuItem key={emp.id} value={emp.id}>{emp.name} ({emp.employee_code})</MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 1 }}>
                        <TextField fullWidth margin="dense" select size="small" label="Month *"
                            value={form.month} onChange={(e) => setForm(f => ({ ...f, month: e.target.value }))}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <MenuItem key={m} value={m}>{getMonthName(m)}</MenuItem>
                            ))}
                        </TextField>
                        {field("Year *", "year", "number")}
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 1 }}>
                        {field("Total Days", "total_days", "number")}
                        {field("Present Days", "present_days", "number")}
                    </Box>

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 700, color: "text.secondary" }}>Salary Details</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        {field("Calculated Gross (₹) *", "calculated_gross", "number")}
                        {field("Total Deductions (₹) *", "deductions", "number")}
                    </Box>

                    <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body1" fontWeight={600} color="success.dark">
                            Net Pay: ₹{parseFloat(form.net_pay || 0).toFixed(2)}
                        </Typography>
                        <Box sx={{ width: "150px" }}>
                            <TextField fullWidth margin="dense" select size="small" label="Status"
                                value={form.payment_status} onChange={(e) => setForm(f => ({ ...f, payment_status: e.target.value }))}>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Paid">Paid</MenuItem>
                            </TextField>
                        </Box>
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
