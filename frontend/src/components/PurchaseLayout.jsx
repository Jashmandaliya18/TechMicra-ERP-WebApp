import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    Typography, AppBar, Toolbar, CssBaseline, Divider, useTheme, alpha
} from '@mui/material';
import {
    Description,
    ShoppingCart,
    Schedule,
    LocalShipping,
    FactCheck,
    Inventory,
    Receipt,
    Payment,
    Dashboard as DashboardIcon,
    ChevronLeft
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/purchase/dashboard' },
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
    const theme = useTheme();
    const location = useLocation();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        bgcolor: theme.palette.background.paper,
                        borderRight: `1px solid ${theme.palette.divider}`,
                    },
                }}
            >
                {/* Logo Area */}
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5, py: 2, gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36, height: 36, borderRadius: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 800, fontSize: '0.875rem',
                            flexShrink: 0,
                        }}
                    >
                        TM
                    </Box>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            TechMicra
                        </Typography>
                        <Typography variant="caption" noWrap sx={{ color: 'text.secondary' }}>
                            ERP System
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mx: 2, mb: 1 }} />

                <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
                    <Typography
                        variant="overline"
                        sx={{ px: 3, pt: 1.5, pb: 0.5, display: 'block', color: 'text.secondary', fontSize: '0.65rem', letterSpacing: '0.1em' }}
                    >
                        Purchase Management
                    </Typography>
                    <List disablePadding>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <ListItemButton
                                    key={item.text}
                                    component={NavLink}
                                    to={item.path}
                                    selected={isActive}
                                    sx={{
                                        mx: 1.5,
                                        my: 0.2,
                                        borderRadius: 2,
                                        minHeight: 44,
                                        ...(isActive
                                            ? {
                                                bgcolor: alpha(theme.palette.primary.main, 0.12),
                                                color: theme.palette.primary.main,
                                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.18) },
                                            }
                                            : {}),
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: 2,
                                            color: isActive ? theme.palette.primary.main : 'inherit',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: '0.875rem',
                                            fontWeight: isActive ? 600 : 400
                                        }}
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(8px)',
                        color: theme.palette.text.primary,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                            Purchase Management Module
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default PurchaseLayout;
