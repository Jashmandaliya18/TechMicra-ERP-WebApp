import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeMode } from "../context/ThemeContext";
import {
    Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItemButton,
    ListItemIcon, ListItemText, Divider, Avatar, Menu, MenuItem, Tooltip,
    Collapse, useTheme, alpha
} from "@mui/material";
import {
    Menu as MenuIcon,
    DarkMode, LightMode,
    Dashboard as DashboardIcon,
    ShoppingCart, RequestQuote, Inventory, Receipt,
    Factory, Engineering, Build,
    AccountBalance, CreditCard,
    People, Badge,
    LocalShipping, DirectionsCar,
    VerifiedUser, GppGood,
    Construction, Handyman,
    Warehouse, MoveToInbox,
    Business, AccountTree,
    ExpandLess, ExpandMore,
    ChevronLeft
} from "@mui/icons-material";

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED = 72;

const navSections = [
    {
        label: "Overview",
        items: [{ text: "Dashboard", icon: <DashboardIcon />, path: "/" }],
    },
    {
        label: "Operations",
        items: [
            {
                text: "Sales",
                icon: <ShoppingCart />,
                children: [
                    { text: "Customer Master", path: "/sales/customers" },
                    { text: "Product Master", path: "/sales/products" },
                    { text: "Inquiries", path: "/sales/inquiries" },
                    { text: "Quotations", path: "/sales/quotations" },
                    { text: "Sale Orders", path: "/sales/orders" },
                    { text: "Dispatch Advice", path: "/sales/dispatch" },
                    { text: "Invoices", path: "/sales/invoices" },
                    { text: "Payment Receipts", path: "/sales/receipts" },
                ],
            },
            {
                text: "Purchase",
                icon: <RequestQuote />,
                children: [
                    { text: "Dashboard", path: "/purchase/dashboard" },
                    { text: "Material Indents", path: "/purchase/material-indents" },
                    { text: "Purchase Orders", path: "/purchase/orders" },
                    { text: "Purchase Schedule", path: "/purchase/schedules" },
                    { text: "GRN (Goods Receipt)", path: "/purchase/grn" },
                    { text: "Quality Control (IQC)", path: "/purchase/iqc" },
                    { text: "Material Receipt", path: "/purchase/receipts" },
                    { text: "Purchase Billbook", path: "/purchase/billbook" },
                    { text: "Voucher Payments", path: "/purchase/payments" },
                ],
            },
            {
                text: "Production",
                icon: <Factory />,
                children: [
                    { text: "Bill of Materials", path: "/production/bom" },
                    { text: "Routecards", path: "/production/routecards" },
                    { text: "Material Issues", path: "/production/material-issues" },
                    { text: "MTA", path: "/production/mta" },
                    { text: "Daily Reports", path: "/production/reports" },
                    { text: "Job Orders", path: "/production/job-orders" },
                    { text: "External GRN", path: "/production/external-grn" },
                    { text: "Job Work Bills", path: "/production/job-bills" },
                ],
            },
            {
                text: "Logistics",
                icon: <LocalShipping />,
                children: [
                    { text: "Transporters", path: "/logistics/transporters" },
                    { text: "Transport Orders", path: "/logistics/bookings" },
                    { text: "Challan Out", path: "/logistics/challans" },
                    { text: "Freight Billbook", path: "/logistics/freight" },
                ],
            },
        ],
    },
    {
        label: "Quality & Maintenance",
        items: [
            {
                text: "Quality",
                icon: <VerifiedUser />,
                children: [
                    { text: "Inspections (IQC)", path: "/quality/inspections" },
                    { text: "Material Transfer (MTS)", path: "/quality/mts" },
                    { text: "Process QC", path: "/quality/pqc" },
                    { text: "Pre-Dispatch (PDI)", path: "/quality/pdi" },
                    { text: "Rejections", path: "/quality/rejections" },
                ],
            },
            {
                text: "Maintenance",
                icon: <Construction />,
                children: [
                    { text: "Tool Master", path: "/maintenance/tools" },
                    { text: "Maintenance Chart", path: "/maintenance/chart" },
                    { text: "Calibration", path: "/maintenance/calibration" },
                    { text: "Repairs / Rectification", path: "/maintenance/repairs" },
                ],
            },
        ],
    },
    {
        label: "Finance & HR",
        items: [
            {
                text: "Finance",
                icon: <AccountBalance />,
                children: [
                    { text: "Voucher Journal", path: "/finance/journal" },
                    { text: "Payment & Receipt", path: "/finance/vouchers" },
                    { text: "Contra Voucher", path: "/finance/contra" },
                    { text: "GST Journal", path: "/finance/gst" },
                    { text: "Bank Reconciliation", path: "/finance/bank-rec" },
                    { text: "Credit Card Statement", path: "/finance/credit-card" },
                ],
            },
            {
                text: "HR",
                icon: <People />,
                children: [
                    { text: "Employees", path: "/hr/employees" },
                    { text: "Salary Heads", path: "/hr/salary-heads" },
                    { text: "Salary Structure", path: "/hr/salary" },
                    { text: "Monthly Sheets", path: "/hr/sheets" },
                    { text: "Advances / Loans", path: "/hr/advances" },
                ],
            },
            {
                text: "Contractors",
                icon: <Badge />,
                children: [
                    { text: "Contractor Staff", path: "/contractors/employees" },
                    { text: "Salary & Payments", path: "/contractors/salary" },
                ],
            },
        ],
    },
    {
        label: "Inventory & Assets",
        items: [
            {
                text: "Stores",
                icon: <Warehouse />,
                children: [
                    { text: "Warehouse Master", path: "/stores/warehouses" },
                    { text: "Opening Stock", path: "/stores/openings" },
                    { text: "Dispatch SRV", path: "/stores/dispatch" },
                    { text: "Stock Transfers", path: "/stores/transfers" },
                    { text: "Material Receipts", path: "/stores/receipts" },
                ],
            },
            {
                text: "Assets",
                icon: <Business />,
                children: [
                    { text: "Asset Register", path: "/assets/register" },
                    { text: "Allocations", path: "/assets/allocations" },
                    { text: "Depreciation", path: "/assets/depreciation" },
                ],
            },
        ],
    },
];

function NavItem({ item, open, location, navigate }) {
    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.path && location.pathname === item.path;
    const isChildActive = hasChildren && item.children.some((c) => location.pathname === c.path);

    const handleClick = () => {
        if (hasChildren) {
            setExpanded(!expanded);
        } else if (item.path) {
            navigate(item.path);
        }
    };

    return (
        <>
            <ListItemButton
                onClick={handleClick}
                selected={isActive || isChildActive}
                sx={{
                    mx: 1.5,
                    px: open ? 2 : 1.5,
                    justifyContent: open ? "initial" : "center",
                    minHeight: 44,
                    ...(isActive || isChildActive
                        ? {
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.main,
                            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.18) },
                        }
                        : {}),
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 2 : "auto",
                        justifyContent: "center",
                        color: isActive || isChildActive ? theme.palette.primary.main : "inherit",
                    }}
                >
                    {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: isActive || isChildActive ? 600 : 400 }} />}
                {open && hasChildren && (expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
            </ListItemButton>
            {hasChildren && open && (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map((child) => (
                            <ListItemButton
                                key={child.path}
                                onClick={() => navigate(child.path)}
                                selected={location.pathname === child.path}
                                sx={{
                                    pl: 7,
                                    mx: 1.5,
                                    minHeight: 38,
                                    ...(location.pathname === child.path
                                        ? {
                                            color: theme.palette.primary.main,
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                        }
                                        : {}),
                                }}
                            >
                                <ListItemText primary={child.text} primaryTypographyProps={{ fontSize: "0.8125rem", fontWeight: location.pathname === child.path ? 600 : 400 }} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
}

export default function DashboardLayout() {
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useThemeMode();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const handleLogout = () => {
        setAnchorEl(null);
        logout();
    };

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
        : "U";

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED,
                        boxSizing: "border-box",
                        overflowX: "hidden",
                        transition: theme.transitions.create("width", {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        bgcolor: theme.palette.background.paper,
                        borderRight: `1px solid ${theme.palette.divider}`,
                    },
                }}
            >
                {/* Logo Area */}
                <Box sx={{ display: "flex", alignItems: "center", px: 2.5, py: 2, gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36, height: 36, borderRadius: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 800, fontSize: "0.875rem",
                            flexShrink: 0,
                        }}
                    >
                        TM
                    </Box>
                    {drawerOpen && (
                        <Box sx={{ overflow: "hidden" }}>
                            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                TechMicra
                            </Typography>
                            <Typography variant="caption" noWrap sx={{ color: "text.secondary" }}>
                                ERP System
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ mx: 2, mb: 1 }} />

                {/* Navigation */}
                <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", py: 1 }}>
                    {navSections.map((section) => (
                        <Box key={section.label} sx={{ mb: 1 }}>
                            {drawerOpen && (
                                <Typography
                                    variant="overline"
                                    sx={{ px: 3, pt: 1.5, pb: 0.5, display: "block", color: "text.secondary", fontSize: "0.65rem", letterSpacing: "0.1em" }}
                                >
                                    {section.label}
                                </Typography>
                            )}
                            <List disablePadding>
                                {section.items.map((item) => (
                                    <NavItem key={item.text} item={item} open={drawerOpen} location={location} navigate={navigate} />
                                ))}
                            </List>
                        </Box>
                    ))}
                </Box>

                {/* Collapse Toggle */}
                <Divider />
                <Box sx={{ p: 1.5, display: "flex", justifyContent: drawerOpen ? "flex-end" : "center" }}>
                    <IconButton size="small" onClick={() => setDrawerOpen(!drawerOpen)}>
                        {drawerOpen ? <ChevronLeft /> : <MenuIcon />}
                    </IconButton>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {/* Top AppBar */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: "blur(8px)",
                        color: theme.palette.text.primary,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Toolbar sx={{ gap: 1 }}>
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                            {getPageTitle(location.pathname)}
                        </Typography>

                        {/* Dark Mode Toggle */}
                        <Tooltip title={mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}>
                            <IconButton onClick={toggleTheme} color="inherit" id="theme-toggle-btn">
                                {mode === "light" ? <DarkMode /> : <LightMode />}
                            </IconButton>
                        </Tooltip>

                        {/* User Avatar */}
                        <Tooltip title="Account">
                            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} id="user-menu-btn">
                                <Avatar
                                    sx={{
                                        width: 34, height: 34,
                                        bgcolor: theme.palette.primary.main,
                                        fontSize: "0.8rem", fontWeight: 700,
                                    }}
                                >
                                    {initials}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        >
                            <MenuItem disabled>
                                <Typography variant="body2">{user?.name} ({user?.roles?.[0]?.name || "User"})</Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                {/* Page Content */}
                <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

function getPageTitle(pathname) {
    const titles = {
        "/": "Dashboard",
        "/sales/customers": "Customer Master",
        "/sales/products": "Product Master",
        "/sales/inquiries": "Sales Inquiries",
        "/sales/quotations": "Quotations",
        "/sales/orders": "Sale Orders",
        "/sales/dispatch": "Dispatch Advice",
        "/sales/invoices": "Invoices",
        "/sales/receipts": "Payment Receipts",
        "/purchase/dashboard": "Purchase Dashboard",
        "/purchase/material-indents": "Material Indents",
        "/purchase/material-indents/new": "Create Material Indent",
        "/purchase/orders": "Purchase Orders",
        "/purchase/orders/new": "Create Purchase Order",
        "/purchase/schedules": "Purchase Schedules",
        "/purchase/grn": "Goods Receipt Notes",
        "/purchase/grn/new": "Create GRN",
        "/purchase/iqc": "Quality Inspections (IQC)",
        "/purchase/receipts": "Material Receipts",
        "/purchase/billbook": "Purchase Billbook",
        "/purchase/payments": "Voucher Payments",
        "/production/bom": "Bill of Materials",
        "/production/routecards": "Routecards",
        "/production/material-issues": "Material Issues",
        "/production/mta": "Material Transfer Acknowledgements",
        "/production/reports": "Daily Production Reports",
        "/production/job-orders": "External Job Orders",
        "/production/external-grn": "External GRN & IQC",
        "/production/job-bills": "Job Work Billbooks",
        "/logistics/transporters": "Transport Master",
        "/logistics/bookings": "Transport Orders",
        "/logistics/challans": "Challan Out",
        "/logistics/freight": "Freight Billbook",
        "/quality/inspections": "Quality Inspections (IQC)",
        "/quality/mts": "Material Transfer Slips (MTS)",
        "/quality/pqc": "Process Quality Control",
        "/quality/pdi": "Pre-Dispatch Inspection",
        "/quality/rejections": "Rejection & Disposals",
        "/maintenance/tools": "Tool Master",
        "/maintenance/chart": "Maintenance Chart",
        "/maintenance/calibration": "Calibration Records",
        "/maintenance/repairs": "Tool Repairs / Rectification",
        "/finance/journal": "Journal Entries",
        "/finance/vouchers": "Payment / Receipt Vouchers",
        "/finance/bank-rec": "Bank Reconciliation",
        "/finance/gst": "GST Adjustments",
        "/hr/employees": "Employees",
        "/hr/salary-heads": "Salary Head Master",
        "/hr/salary": "Employee Salary Structure",
        "/hr/sheets": "Employee Salary Sheet (Payroll)",
        "/hr/advances": "Employee Advance Memo",
        "/contractors/employees": "Contractor Staff",
        "/contractors/salary": "Contractor Salary & Payments",
        "/stores/warehouses": "Warehouse Master",
        "/stores/openings": "Warehouse Openings",
        "/stores/dispatch": "Dispatch Service Voucher",
        "/stores/transfers": "Store Transfers",
        "/stores/receipts": "Store Material Receipts",
        "/assets/register": "Asset Register",
        "/assets/allocations": "Asset Allocations",
        "/assets/depreciation": "Asset Depreciation",
    };
    return titles[pathname] || "TechMicra ERP";
}
