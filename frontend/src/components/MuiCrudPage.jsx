import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    useTheme, alpha, Snackbar, Alert
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

export default function TailwindCrudPage({ title, endpoint, columns, fields }) {
    const [data, setData] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [editId, setEditId] = useState(null);
    const [toast, setToast] = useState({ open: false, message: "", type: "success" });
    const theme = useTheme();

    useEffect(() => {
        fetchData();
    }, []);

    const showToast = (message, type = "success") => {
        setToast({ open: true, message, type });
    };

    const handleCloseToast = () => {
        setToast({ ...toast, open: false });
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(endpoint);
            setData(res.data);
        } catch (error) {
            showToast("Failed to fetch data", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`${endpoint}/${editId}`, formData);
                showToast("Updated successfully");
            } else {
                await axios.post(endpoint, formData);
                showToast("Created successfully");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            showToast("Failed to save data. Please check inputs.", "error");
        }
    };

    const handleEdit = (item) => {
        setFormData(item);
        setEditId(item.id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await axios.delete(`${endpoint}/${id}`);
            showToast("Deleted successfully");
            fetchData();
        } catch (error) {
            showToast("Failed to delete", "error");
        }
    };

    const openCreateDialog = () => {
        setFormData({});
        setEditId(null);
        setIsDialogOpen(true);
    };

    return (
        <Box>
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseToast} severity={toast.type} sx={{ width: '100%' }}>
                    {toast.message}
                </Alert>
            </Snackbar>

            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {title}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={openCreateDialog}
                    sx={{ px: 3, py: 1 }}
                >
                    Add New
                </Button>
            </Box>

            {/* Table */}
            <Paper
                elevation={0}
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: "hidden",
                    borderRadius: 2
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {columns.map((col, idx) => (
                                    <TableCell key={idx} sx={{ fontWeight: 600 }}>
                                        {col.label}
                                    </TableCell>
                                ))}
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((item, idx) => (
                                    <TableRow key={idx} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                        {columns.map((col, i) => (
                                            <TableCell key={i}>
                                                {item[col.key] || "—"}
                                            </TableCell>
                                        ))}
                                        <TableCell align="right">
                                            <IconButton color="primary" onClick={() => handleEdit(item)} size="small" title="Edit">
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(item.id)} size="small" title="Delete">
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 6 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No records found. Click "Add New" to create your first entry.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Modal Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editId ? "Edit" : "Create"} {title}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent dividers>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                            {fields.map((field, idx) => (
                                field.type === "select" ? (
                                    <TextField
                                        key={idx}
                                        select
                                        fullWidth
                                        label={field.label}
                                        name={field.name}
                                        value={formData[field.name] || ""}
                                        onChange={handleInputChange}
                                        required={field.required !== false}
                                        size="medium"
                                    >
                                        {field.options.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                ) : (
                                    <TextField
                                        key={idx}
                                        fullWidth
                                        label={field.label}
                                        name={field.name}
                                        type={field.type || "text"}
                                        value={formData[field.name] || ""}
                                        onChange={handleInputChange}
                                        required={field.required !== false}
                                        size="medium"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: field.type === "date" ? true : undefined
                                            }
                                        }}
                                    />
                                )
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5 }}>
                        <Button onClick={() => setIsDialogOpen(false)} color="inherit">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}
