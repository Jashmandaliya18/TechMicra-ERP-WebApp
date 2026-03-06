import React, { useState } from "react";
import { Box, Typography, Paper, Grid, Chip, Switch, Divider, List, ListItem, ListItemText, ListItemSecondaryAction, Button } from "@mui/material";
import { Security, Save } from "@mui/icons-material";

export default function RoleManagement() {
    const roles = ["Super Admin", "Sales Manager", "Purchase Manager", "Production Manager"];
    const [selectedRole, setSelectedRole] = useState("Sales Manager");

    const modules = [
        "Sales", "Purchase", "Production", "Logistics", "Quality",
        "Maintenance", "Finance", "HR", "Contractors", "Stores", "Assets"
    ];

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Role & Permissions</Typography>
                <Button variant="contained" startIcon={<Save />}>Save Changes</Button>
            </Box>

            <Grid container spacing={3}>
                {/* Roles List */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.hover' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>System Roles</Typography>
                        </Box>
                        <List disablePadding>
                            {roles.map((role) => (
                                <ListItem
                                    key={role}
                                    button
                                    selected={selectedRole === role}
                                    onClick={() => setSelectedRole(role)}
                                >
                                    <ListItemText primary={role} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Permissions Grid */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Security color="primary" />
                            <Box>
                                <Typography variant="h6" sx={{ lineHeight: 1 }}>{selectedRole} Permissions</Typography>
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
                                    <Switch defaultChecked={selectedRole === "Super Admin" || selectedRole.includes(module)} />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
