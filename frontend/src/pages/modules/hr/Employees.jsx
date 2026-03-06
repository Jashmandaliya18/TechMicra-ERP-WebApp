import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, useTheme, alpha, Chip, Tooltip, MenuItem
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { hrService } from "../../../services/api";

const EMPTY = {
    employee_code: "", name: "", department: "", designation: "", mobile: "",
    date_of_joining: new Date().toISOString().split("T")[0], basic_salary: "",
    bank_details: "", status: "Active"
};

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState("");
    const theme = useTheme();

    const load = async () => {
        try { const { data } = await hrService.getAll("employees"); setEmployees(data); }
        catch { setError("Failed to load employees."); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(EMPTY); setEditing(null); setOpen(true); setError(""); };
    const openEdit = (e) => { setForm({ ...e }); setEditing(e.id); setOpen(true); setError(""); };
    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            if (editing) await hrService.update("employees", editing, form);
            else await hrService.create("employees", form);
            setOpen(false);
            load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this employee?")) return;
        try { await hrService.delete("employees", id); load(); }
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
                    <Typography variant="h5" fontWeight={700}>Employee Master</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Manage employee records and details</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Employee</Button>
            </Box>
            {error && <Typography color="error" mb={2}>{error}</Typography>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["Emp Code", "Name", "Designation", "Department", "Joining Date", "Basic Salary", "Status", "Actions"].map((h) => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No employees found. Add your first employee.</Typography>
                                </TableCell></TableRow>
                            ) : employees.map((emp) => (
                                <TableRow key={emp.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 600 }}>{emp.employee_code}</TableCell>
                                    <TableCell>{emp.name}</TableCell>
                                    <TableCell>{emp.designation}</TableCell>
                                    <TableCell>{emp.department}</TableCell>
                                    <TableCell>{emp.date_of_joining}</TableCell>
                                    <TableCell>₹{parseFloat(emp.basic_salary || 0).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Chip size="small" label={emp.status}
                                            color={emp.status === "Active" ? "success" : emp.status === "On-Leave" ? "warning" : "error"} variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(emp)}><Edit fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(emp.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Edit Employee" : "Add New Employee"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Typography color="error" mb={1} variant="body2">{error}</Typography>}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        {field("Employee Code *", "employee_code")}
                        {field("Full Name *", "name")}
                        {field("Department", "department")}
                        {field("Designation", "designation")}
                        {field("Mobile", "mobile")}
                        <TextField fullWidth margin="dense" size="small" label="Joining Date *" type="date"
                            InputLabelProps={{ shrink: true }}
                            value={form.date_of_joining} onChange={(e) => setForm(f => ({ ...f, date_of_joining: e.target.value }))} />
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
                        {field("Basic Salary (₹) *", "basic_salary", "number")}
                        <TextField fullWidth margin="dense" select size="small" label="Status *"
                            value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="On-Leave">On-Leave</MenuItem>
                            <MenuItem value="Terminated">Terminated</MenuItem>
                        </TextField>
                    </Box>
                    {field("Bank Details", "bank_details", "text", { multiline: true, rows: 2 })}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
