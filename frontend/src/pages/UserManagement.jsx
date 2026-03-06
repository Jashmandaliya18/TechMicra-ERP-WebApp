import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Add, Edit, Delete, Person } from "@mui/icons-material";
import { getUsers, getRoles, createUser, deleteUser } from "../services/api";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });

    const loadData = async () => {
        try {
            const [usersRes, rolesRes] = await Promise.all([getUsers(), getRoles()]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error("Failed to fetch users or roles", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpen = (user = null) => {
        if (user) {
            setEditUser(user);
            setFormData({ name: user.name, email: user.email, password: '', role: user.roles[0]?.name || '' });
        } else {
            setEditUser(null);
            setFormData({ name: '', email: '', password: '', role: '' });
        }
        setOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (editUser) {
                // Future implementation: Update User API
            } else {
                await createUser(formData);
            }
            setOpen(false);
            loadData(); // refresh the table
        } catch (error) {
            console.error("Failed to save user", error);
            alert("Error saving user. Please check the values.");
        }
    };

    const handleDelete = async (userToDelete) => {
        if (userToDelete.roles?.[0]?.name === "Super Admin") {
            alert("The Super Admin cannot be deleted.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete ${userToDelete.name}?`)) {
            try {
                await deleteUser(userToDelete.id);
                loadData(); // Refresh list after deletion
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Error deleting user.");
            }
        }
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
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Person color="primary" />
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip label={user.roles?.[0]?.name || "No Role"} color="primary" size="small" />
                                </TableCell>
                                <TableCell><Chip label="Active" color="success" variant="outlined" size="small" /></TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleOpen(user)}><Edit fontSize="small" /></IconButton>
                                    {user.roles?.[0]?.name !== "Super Admin" && (
                                        <IconButton size="small" color="error" onClick={() => handleDelete(user)}><Delete fontSize="small" /></IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" disableRestoreFocus>
                <DialogTitle>{editUser ? 'Edit User' : 'Create New User'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <TextField fullWidth label="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        {!editUser && (
                            <TextField fullWidth label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        )}
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                {roles.map((r) => (
                                    <MenuItem key={r.id} value={r.name}>{r.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>{editUser ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
