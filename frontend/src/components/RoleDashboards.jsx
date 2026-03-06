import React from "react";
import { Grid, Paper, Typography, Box, alpha, useTheme } from "@mui/material";
import {
    TrendingUp, Assignment, Warning, CheckCircle,
    People, LocalShipping, Build, VerifiedUser,
    RequestQuote, Factory, AccountBalance, Badge, Warehouse, Business,
    Receipt, CreditCard
} from "@mui/icons-material";

export const StatCard = ({ title, value, icon, color, trend }) => {
    const theme = useTheme();
    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: alpha(color, 0.1), color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                </Box>
                {trend && (
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600, bgcolor: alpha(theme.palette.success.main, 0.1), px: 1, py: 0.5, borderRadius: 1 }}>
                        {trend}
                    </Typography>
                )}
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{value}</Typography>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Paper>
    );
};

export const SalesDashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={2.4}><StatCard title="New Inquiries" value="12" icon={<Assignment />} color="#1565c0" /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><StatCard title="Pending Quotations" value="8" icon={<RequestQuote />} color="#7b1fa2" /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><StatCard title="Orders Confirmed" value="45" icon={<CheckCircle />} color="#2e7d32" /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><StatCard title="Invoices Generated" value="38" icon={<Receipt />} color="#1565c0" /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><StatCard title="Overdue Payments" value="₹2.4L" icon={<Warning />} color="#d32f2f" /></Grid>
    </Grid>
);

export const HRDashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Total Employees" value="124" icon={<People />} color="#ad1457" /></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Payroll This Month" value="₹18.5L" icon={<AccountBalance />} color="#1565c0" /></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Employee Advances" value="₹45K" icon={<TrendingUp />} color="#e65100" /></Grid>
    </Grid>
);

export const ProductionDashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Active Route Cards" value="18" icon={<VerifiedUser />} color="#e65100" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Production Today" value="450 units" icon={<CheckCircle />} color="#2e7d32" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Machine Utilization" value="94%" icon={<Build />} color="#1565c0" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Rejected Quantity" value="12" icon={<Warning />} color="#d32f2f" /></Grid>
    </Grid>
);

export const PurchaseDashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Material Indents Pending" value="14" icon={<Assignment />} color="#7b1fa2" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Pending Purchase Orders" value="8" icon={<RequestQuote />} color="#1565c0" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="GRN Pending" value="22" icon={<Warehouse />} color="#e65100" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Vendor Deliveries" value="5" icon={<LocalShipping />} color="#2e7d32" /></Grid>
    </Grid>
);

export const LogisticsDashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Transport Orders" value="12" icon={<LocalShipping />} color="#00838f" /></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Pending Dispatch" value="18" icon={<Assignment />} color="#e65100" /></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Freight Bills" value="34" icon={<RequestQuote />} color="#7b1fa2" /></Grid>
    </Grid>
);

export const QualityDashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Incoming Quality Checks" value="7" icon={<VerifiedUser />} color="#2e7d32" /></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Process Quality Checks" value="15" icon={<Build />} color="#1565c0" /></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Rejected Materials" value="3" icon={<Warning />} color="#d32f2f" /></Grid>
    </Grid>
);

export const FinanceDashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Accounts Receivable" value="₹45.2L" icon={<TrendingUp />} color="#2e7d32" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Accounts Payable" value="₹12.8L" icon={<RequestQuote />} color="#d32f2f" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Bank Balance" value="₹85.0L" icon={<AccountBalance />} color="#1565c0" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="GST Liability" value="₹4.2L" icon={<CreditCard />} color="#e65100" /></Grid>
    </Grid>
);

export const StoreDashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Low Stock" value="112" icon={<Warning />} color="#d32f2f" /></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Incoming Materials" value="8" icon={<Warehouse />} color="#2e7d32" /></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Warehouse Transfers" value="5" icon={<Assignment />} color="#1565c0" /></Grid>
    </Grid>
);

export const MaintenanceDashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Pending Repairs" value="4" icon={<Build />} color="#d32f2f" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Calibration Due" value="12" icon={<VerifiedUser />} color="#e65100" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Scheduled Today" value="6" icon={<Assignment />} color="#1565c0" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Machinery Uptime" value="96%" icon={<CheckCircle />} color="#2e7d32" /></Grid>
    </Grid>
);

export const AssetDashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Assets" value="450" icon={<Business />} color="#37474f" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Allocated" value="412" icon={<Assignment />} color="#1565c0" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Depreciation (YTD)" value="₹3.4L" icon={<TrendingUp />} color="#e65100" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Maintenance Due" value="8" icon={<Build />} color="#d32f2f" /></Grid>
    </Grid>
);

export const ContractorDashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Total Staff" value="85" icon={<People />} color="#ad1457" /></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Pending Payments" value="₹1.2L" icon={<RequestQuote />} color="#e65100" /></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Daily Attendance" value="92%" icon={<CheckCircle />} color="#2e7d32" /></Grid>
    </Grid>
);
