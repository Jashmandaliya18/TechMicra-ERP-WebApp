import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, AppBar, Toolbar, CssBaseline } from '@mui/material';
import {
    Description,
    ShoppingCart,
    Schedule,
    LocalShipping,
    FactCheck,
    Inventory,
    Receipt,
    Payment,
    Dashboard
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/purchase/dashboard' },
    { text: 'Material Indent', icon: <Description />, path: '/purchase/material-indents' },
    { text: 'Purchase Order', icon: <ShoppingCart />, path: '/purchase/orders' },
    { text: 'Purchase Schedule', icon: <Schedule />, path: '/purchase/schedules' },
    { text: 'GRN (Goods Receipt)', icon: <LocalShipping />, path: '/purchase/grn' },
    { text: 'IQC (Quality Control)', icon: <FactCheck />, path: '/purchase/iqc' },
    { text: 'Material Receipt', icon: <Inventory />, path: '/purchase/receipts' },
    { text: 'Purchase Billbook', icon: <Receipt />, path: '/purchase/billbook' },
    { text: 'Voucher Payment', icon: <Payment />, path: '/purchase/payments' },
];

const PurchaseLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Purchase Management Module
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                component={NavLink}
                                to={item.path}
                                sx={{
                                    '&.active': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                                        '& .MuiListItemText-primary': { fontWeight: 'bold' }
                                    }
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default PurchaseLayout;
