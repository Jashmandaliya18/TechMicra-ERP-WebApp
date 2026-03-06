import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, useTheme, alpha, Tooltip, MenuItem, Chip
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { hrService } from "../../../services/api";

const EMPTY = {
    memo_no: "", employee_id: "", loan_date: new Date().toISOString().split("T")[0],
    amount: "", installments_months: 1, deduction_per_month: "", remaining_amount: "",
    purpose: "", recovery_month: "", remarks: ""
};

export default function EmployeeAdvances() {
    const [advances, setAdvances] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState("");
    const theme = useTheme();

    const load = async () => {
        try {
            const [aRes, eRes] = await Promise.all([
                hrService.getAll("employee-advances"),
                hrService.getAll("employees")
            ]);
            setAdvances(aRes.data);
            setEmployees(eRes.data);
        }
        catch { setError("Failed to load data."); }
    };

    useEffect(() => { load(); }, []);

    // Auto calculate deduction per month
    useEffect(() => {
        const amt = parseFloat(form.amount) || 0;
        const inst = parseInt(form.installments_months) || 1;
        setForm(f => ({ ...f, deduction_per_month: inst > 0 ? (amt / inst).toFixed(2) : amt, remaining_amount: amt }));
    }, [form.amount, form.installments_months]);

    const openAdd = () => { setForm(EMPTY); setEditing(null); setOpen(true); setError(""); };
    const openEdit = (a) => { setForm({ ...a }); setEditing(a.id); setOpen(true); setError(""); };
    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            if (editing) await hrService.update("employee-advances", editing, form);
            else await hrService.create("employee-advances", form);
            setOpen(false);
            load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this advance record?")) return;
        try { await hrService.delete("employee-advances", id); load(); }
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
                    <Typography variant="h5" fontWeight={700}>Employee Advance & Loan Memo</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Manage salary advances and loan deductions</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Issue Advance</Button>
            </Box>
            {error && <Typography color="error" mb={2}>{error}</Typography>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["Memo No", "Employee", "Date", "Original Amount", "Instalments", "Deduction/Mo", "Balance", "Actions"].map((h) => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {advances.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No advances found.</Typography>
                                </TableCell></TableRow>
                            ) : advances.map((a) => (
                                <TableRow key={a.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 600 }}>{a.memo_no}</TableCell>
                                    <TableCell>{a.employee?.name || `Emp #${a.employee_id}`}</TableCell>
                                    <TableCell>{a.loan_date}</TableCell>
                                    <TableCell>₹{parseFloat(a.amount || 0).toFixed(2)}</TableCell>
                                    <TableCell>{a.installments_months} Mos</TableCell>
                                    <TableCell>₹{parseFloat(a.deduction_per_month || 0).toFixed(2)}</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: a.remaining_amount > 0 ? "error.main" : "success.main" }}>
                                        ₹{parseFloat(a.remaining_amount || 0).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(a)}><Edit fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(a.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Edit Advance Memo" : "Issue Advance Memo"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Typography color="error" mb={1} variant="body2">{error}</Typography>}

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 1 }}>
                        <TextField fullWidth margin="dense" size="small" label="Memo No *" value={form.memo_no}
                            onChange={(e) => setForm(f => ({ ...f, memo_no: e.target.value }))} disabled={!!editing} />
                        <TextField fullWidth margin="dense" select size="small" label="Employee *"
                            value={form.employee_id} onChange={(e) => setForm(f => ({ ...f, employee_id: e.target.value }))}
                            disabled={!!editing}>
                            {employees.map(emp => (
                                <MenuItem key={emp.id} value={emp.id}>{emp.name} ({emp.employee_code})</MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 1 }}>
                        <TextField fullWidth margin="dense" size="small" label="Date of Advance *" type="date"
                            InputLabelProps={{ shrink: true }}
                            value={form.loan_date} onChange={(e) => setForm(f => ({ ...f, loan_date: e.target.value }))} />
                        {field("Total Amount (₹) *", "amount", "number")}
                    </Box>

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 700, color: "text.secondary" }}>Repayment Terms</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        {field("Installment Months *", "installments_months", "number", { inputProps: { min: 1 } })}
                        {field("Deduction Per Month (₹) *", "deduction_per_month", "number")}
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        {field("Start Recovery From", "recovery_month", "text", { placeholder: "e.g., Apr 2026" })}
                        {field("Remaining Balance (₹) *", "remaining_amount", "number")}
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        {field("Purpose", "purpose")}
                        {field("Remarks", "remarks", "text", { multiline: true, rows: 2 })}
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
