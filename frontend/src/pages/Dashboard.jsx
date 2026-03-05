import { Box, Typography, Grid, Paper, useTheme, alpha } from "@mui/material";
import {
    ShoppingCart, RequestQuote, Factory, AccountBalance,
    People, LocalShipping, VerifiedUser, Badge,
    Construction, Warehouse, Business, TrendingUp
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const moduleCards = [
    { title: "Sales", desc: "Inquiries, Quotations, Orders, Invoices", icon: <ShoppingCart />, path: "/sales/inquiries", color: "#1565c0" },
    { title: "Purchase", desc: "Indents, POs, GRN, Billbooks", icon: <RequestQuote />, path: "/purchase/orders", color: "#7b1fa2" },
    { title: "Production", desc: "BOM, Routecards, Job Orders", icon: <Factory />, path: "/production/bom", color: "#e65100" },
    { title: "Logistics", desc: "Transporters, Bookings, Challans", icon: <LocalShipping />, path: "/logistics/bookings", color: "#00838f" },
    { title: "Quality", desc: "IQC, PQC, PDI, Rejections", icon: <VerifiedUser />, path: "/quality/inspections", color: "#2e7d32" },
    { title: "Maintenance", desc: "Tools, Calibration, Charts", icon: <Construction />, path: "/maintenance/tools", color: "#795548" },
    { title: "Finance", desc: "Journal, Vouchers, Bank Rec, GST", icon: <AccountBalance />, path: "/finance/journal", color: "#283593" },
    { title: "HR", desc: "Employees, Salary, Sheets, Advances", icon: <People />, path: "/hr/employees", color: "#ad1457" },
    { title: "Contractors", desc: "Staff, Salary, Payments", icon: <Badge />, path: "/contractors/employees", color: "#6a1b9a" },
    { title: "Stores", desc: "Inventory, Transfers, Receipts", icon: <Warehouse />, path: "/stores/inventory", color: "#4e342e" },
    { title: "Assets", desc: "Register, Allocations, Depreciation", icon: <Business />, path: "/assets/register", color: "#37474f" },
];

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box>
            {/* Welcome Banner */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: "#fff",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Welcome back, {user?.name || "User"}!
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.85, mt: 0.5 }}>
                            TechMicra ERP — Manage your entire business from one place
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Module Cards Grid */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Access
            </Typography>
            <Grid container spacing={2.5}>
                {moduleCards.map((mod) => (
                    <Grid key={mod.title} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Paper
                            elevation={0}
                            onClick={() => navigate(mod.path)}
                            sx={{
                                p: 3,
                                cursor: "pointer",
                                border: `1px solid ${theme.palette.divider}`,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    borderColor: mod.color,
                                    transform: "translateY(-2px)",
                                    boxShadow: `0 4px 20px ${alpha(mod.color, 0.15)}`,
                                },
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 42, height: 42, borderRadius: 2,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        bgcolor: alpha(mod.color, 0.1),
                                        color: mod.color,
                                    }}
                                >
                                    {mod.icon}
                                </Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {mod.title}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {mod.desc}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
