import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid, Switch, Divider, List, ListItem, ListItemText, Button, CircularProgress } from "@mui/material";
import { Security, Save } from "@mui/icons-material";
import { getRoles, updateRolePermissions } from "../services/api";

export default function RoleManagement() {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const modules = [
        "Dashboard", "Sales", "Purchase", "Production", "Logistics",
        "Quality", "Maintenance", "Finance", "HR", "Contractors",
        "Stores", "Assets", "Reports", "User Management", "Roles"
    ];

    const loadRoles = async () => {
        try {
            const res = await getRoles();
            setRoles(res.data);
            if (res.data.length > 0) {
                const initialRole = res.data[0];
                setSelectedRole(initialRole);
                setPermissions(initialRole.permissions?.map(p => p.name) || []);
            }
        } catch (error) {
            console.error("Failed to load roles", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setPermissions(role.permissions?.map(p => p.name) || []);
    };

    const isModuleEnabled = (module) => {
        if (selectedRole?.name === "Super Admin") return true;
        // Check if the current role's dynamic permissions array at least includes the view permission
        return permissions.includes(`${module}.view`);
    };

    const handleToggleModule = (module) => {
        if (selectedRole?.name === "Super Admin") return;

        const actions = ['view', 'create', 'edit', 'delete'];
        const modulePermissions = actions.map(action => `${module}.${action}`);

        if (isModuleEnabled(module)) {
            // Remove permissions
            setPermissions(prev => prev.filter(p => !modulePermissions.includes(p)));
        } else {
            // Add permissions
            setPermissions(prev => [...prev, ...modulePermissions]);
        }
    };

    const handleSave = async () => {
        if (!selectedRole || selectedRole.name === "Super Admin") return;
        setSaving(true);
        try {
            await updateRolePermissions(selectedRole.id, { permissions });
            alert("Role permissions updated successfully");
            loadRoles(); // refresh
        } catch (error) {
            console.error("Failed to update permissions", error);
            alert("Failed to update permissions");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Role & Permissions</Typography>
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving || selectedRole?.name === "Super Admin"}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.hover' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>System Roles</Typography>
                        </Box>
                        <List disablePadding>
                            {roles.map((role) => (
                                <ListItem
                                    key={role.id}
                                    button
                                    selected={selectedRole?.id === role.id}
                                    onClick={() => handleRoleSelect(role)}
                                >
                                    <ListItemText primary={role.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    {selectedRole && (
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <Security color="primary" />
                                <Box>
                                    <Typography variant="h6" sx={{ lineHeight: 1 }}>{selectedRole.name} Permissions</Typography>
                                    <Typography variant="caption" color="text.secondary">Toggle module access for this role</Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {modules.map((module) => (
                                    <Box key={module} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{module} Module</Typography>
                                            <Typography variant="caption" color="text.secondary">View, Create, Edit, Delete access to {module} documents</Typography>
                                        </Box>
                                        <Switch
                                            checked={isModuleEnabled(module)}
                                            onChange={() => handleToggleModule(module)}
                                            disabled={selectedRole.name === "Super Admin"}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
