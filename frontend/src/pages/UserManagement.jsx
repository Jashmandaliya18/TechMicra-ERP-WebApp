import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Add, Edit, Delete, Person } from "@mui/icons-material";
import axios from "axios";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: '' });

    useEffect(() => {
        // Fetch users and roles from API
        // For demonstration, these would be API calls
        // setUsers(response.data);
    }, []);

    const handleOpen = (user = null) => {
        if (user) {
            setEditUser(user);
            setFormData({ name: user.name, email: user.email, role: user.role });
        } else {
            setEditUser(null);
            setFormData({ name: '', email: '', role: '' });
        }
        setOpen(true);
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>User Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add User</Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Person color="primary" />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Super Admin</Typography>
                                </Box>
                            </TableCell>
                            <TableCell>admin@techmicra.com</TableCell>
                            <TableCell><Chip label="Super Admin" color="primary" size="small" /></TableCell>
                            <TableCell><Chip label="Active" color="success" variant="outlined" size="small" /></TableCell>
                            <TableCell align="right">
                                <IconButton size="small"><Edit fontSize="small" /></IconButton>
                                <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                            </TableCell>
                        </TableRow>
                        {/* More rows will be map-ped here */}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" disableRestoreFocus>
                <DialogTitle>{editUser ? 'Edit User' : 'Create New User'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <TextField fullWidth label="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                <MenuItem value="Super Admin">Super Admin</MenuItem>
                                <MenuItem value="Sales Manager">Sales Manager</MenuItem>
                                <MenuItem value="Purchase Manager">Purchase Manager</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => setOpen(false)}>{editUser ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
