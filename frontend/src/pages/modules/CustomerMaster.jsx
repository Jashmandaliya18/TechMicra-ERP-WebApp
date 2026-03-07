import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, useTheme, alpha, Chip, Tooltip
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../../services/api";

const EMPTY = { name: "", contact_person: "", email: "", mobile: "", billing_address: "", shipping_address: "", gst_no: "", credit_period_days: 30 };

export default function CustomerMaster() {
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState("");
    const theme = useTheme();

    const load = async () => {
        try { const { data } = await getCustomers(); setCustomers(data); }
        catch { setError("Failed to load customers."); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(EMPTY); setEditing(null); setOpen(true); setError(""); };
    const openEdit = (c) => { setForm({ ...c }); setEditing(c.id); setOpen(true); setError(""); };
    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            if (editing) await updateCustomer(editing, form);
            else await createCustomer(form);
            setOpen(false);
            load();
        } catch (e) {
            setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(", ") || "Save failed.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this customer?")) return;
        try { await deleteCustomer(id); load(); setError(""); }
        catch (e) { setError(e.response?.data?.error || e.response?.data?.message || "Delete failed."); }
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
                    <Typography variant="h5" fontWeight={700}>Customer Master</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>Manage customer accounts and contact details</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Customer</Button>
            </Box>
            {error && <Typography color="error" mb={2}>{error}</Typography>}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {["Name", "Contact Person", "Email", "Mobile", "GST No", "Credit (Days)", "Actions"].map((h) => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.length === 0 ? (
                                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No customers yet. Add your first customer.</Typography>
                                </TableCell></TableRow>
                            ) : customers.map((c) => (
                                <TableRow key={c.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                                    <TableCell>{c.contact_person || "—"}</TableCell>
                                    <TableCell>{c.email || "—"}</TableCell>
                                    <TableCell>{c.mobile || "—"}</TableCell>
                                    <TableCell>{c.gst_no || "—"}</TableCell>
                                    <TableCell>{c.credit_period_days} days</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(c)}><Edit fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(c.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Edit Customer" : "Add New Customer"}</DialogTitle>
                <DialogContent dividers>
                    {error && <Typography color="error" mb={1} variant="body2">{error}</Typography>}
                    {field("Customer Name *", "name")}
                    {field("Contact Person", "contact_person")}
                    {field("Email", "email", "email")}
                    {field("Mobile", "mobile")}
                    {field("GST Number", "gst_no")}
                    {field("Credit Period (Days)", "credit_period_days", "number")}
                    {field("Billing Address", "billing_address", "text", { multiline: true, rows: 2 })}
                    {field("Shipping Address", "shipping_address", "text", { multiline: true, rows: 2 })}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
