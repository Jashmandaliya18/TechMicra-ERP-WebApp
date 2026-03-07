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

export const SalesDashboard = ({ stats, formatCurrency }) => {
    // Fallback if stats are loading or undefined
    if (!stats) return null;

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '__REPLACE_ME__', gap: 3 }}>
            <Box><StatCard title="New Inquiries" value={stats.newInquiries} icon={<Assignment />} color="#1565c0" /></Box>
            <Box><StatCard title="Pending Quotations" value={stats.pendingQuotations} icon={<RequestQuote />} color="#7b1fa2" /></Box>
            <Box><StatCard title="Orders Confirmed" value={stats.ordersConfirmed} icon={<CheckCircle />} color="#2e7d32" /></Box>
            <Box><StatCard title="Invoices Generated" value={stats.invoicesGenerated} icon={<Receipt />} color="#1565c0" /></Box>
            <Box><StatCard title="Overdue Payments" value={formatCurrency ? formatCurrency(stats.overduePayments) : `₹${stats.overduePayments}`} icon={<Warning />} color="#d32f2f" /></Box>
        </Box>
    );
};

export const HRDashboard = ({ stats, formatCurrency }) => {
    if (!stats) return null;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Box><StatCard title="Total Employees" value={stats.totalEmployees || 0} icon={<People />} color="#ad1457" /></Box>
            <Box><StatCard title="Payroll This Month" value={formatCurrency ? formatCurrency(0) : "₹0"} icon={<AccountBalance />} color="#1565c0" /></Box>
            <Box><StatCard title="Employee Advances" value={formatCurrency ? formatCurrency(0) : "₹0"} icon={<TrendingUp />} color="#e65100" /></Box>
        </Box>
    );
};

export const ProductionDashboard = ({ stats }) => {
    if (!stats) return null;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            <Box><StatCard title="Active Route Cards" value={stats.runningBatches || 0} icon={<VerifiedUser />} color="#e65100" /></Box>
            <Box><StatCard title="Production Today" value="0 units" icon={<CheckCircle />} color="#2e7d32" /></Box>
            <Box><StatCard title="Machine Utilization" value="0%" icon={<Build />} color="#1565c0" /></Box>
            <Box><StatCard title="Rejected Quantity" value="0" icon={<Warning />} color="#d32f2f" /></Box>
        </Box>
    );
};

export const PurchaseDashboard = ({ stats }) => {
    if (!stats) return null;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            <Box><StatCard title="Material Indents Pending" value="0" icon={<Assignment />} color="#7b1fa2" /></Box>
            <Box><StatCard title="Pending Purchase Orders" value={stats.pendingPOs || 0} icon={<RequestQuote />} color="#1565c0" /></Box>
            <Box><StatCard title="GRN Pending" value="0" icon={<Warehouse />} color="#e65100" /></Box>
            <Box><StatCard title="Vendor Deliveries" value="0" icon={<LocalShipping />} color="#2e7d32" /></Box>
        </Box>
    );
};

export const LogisticsDashboard = ({ stats }) => {
    if (!stats) return null;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Box><StatCard title="Transport Orders" value="0" icon={<LocalShipping />} color="#00838f" /></Box>
            <Box><StatCard title="Pending Dispatch" value={stats.dispatchPending || 0} icon={<Assignment />} color="#e65100" /></Box>
            <Box><StatCard title="Freight Bills" value="0" icon={<RequestQuote />} color="#7b1fa2" /></Box>
        </Box>
    );
};

export const QualityDashboard = ({ stats }) => {
    if (!stats) return null;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Box><StatCard title="Incoming Quality Checks" value="0" icon={<VerifiedUser />} color="#2e7d32" /></Box>
            <Box><StatCard title="Process Quality Checks" value="0" icon={<Build />} color="#1565c0" /></Box>
            <Box><StatCard title="Rejected Materials" value="0" icon={<Warning />} color="#d32f2f" /></Box>
        </Box>
    );
};

export const FinanceDashboard = ({ stats, formatCurrency }) => {
    if (!stats) return null;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            <Box><StatCard title="Accounts Receivable" value={formatCurrency ? formatCurrency(0) : "₹0"} icon={<TrendingUp />} color="#2e7d32" /></Box>
            <Box><StatCard title="Accounts Payable" value={formatCurrency ? formatCurrency(stats.pendingPayments || 0) : "₹0"} icon={<RequestQuote />} color="#d32f2f" /></Box>
            <Box><StatCard title="Bank Balance" value={formatCurrency ? formatCurrency(stats.cashFlow || 0) : "₹0"} icon={<AccountBalance />} color="#1565c0" /></Box>
            <Box><StatCard title="GST Liability" value={formatCurrency ? formatCurrency(0) : "₹0"} icon={<CreditCard />} color="#e65100" /></Box>
        </Box>
    );
};

export const StoreDashboard = ({ stats }) => {
    if (!stats) return null;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Box><StatCard title="Low Stock" value={stats.lowStockItems || 0} icon={<Warning />} color="#d32f2f" /></Box>
            <Box><StatCard title="Incoming Materials" value="0" icon={<Warehouse />} color="#2e7d32" /></Box>
            <Box><StatCard title="Warehouse Transfers" value="0" icon={<Assignment />} color="#1565c0" /></Box>
        </Box>
    );
};

export const MaintenanceDashboard = ({ stats }) => {
    if (!stats) return null;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            <Box><StatCard title="Pending Repairs" value="0" icon={<Build />} color="#d32f2f" /></Box>
            <Box><StatCard title="Calibration Due" value="0" icon={<VerifiedUser />} color="#e65100" /></Box>
            <Box><StatCard title="Scheduled Today" value="0" icon={<Assignment />} color="#1565c0" /></Box>
            <Box><StatCard title="Machinery Uptime" value="100%" icon={<CheckCircle />} color="#2e7d32" /></Box>
        </Box>
    );
};

export const AssetDashboard = ({ stats, formatCurrency }) => {
    if (!stats) return null;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            <Box><StatCard title="Total Assets" value="0" icon={<Business />} color="#37474f" /></Box>
            <Box><StatCard title="Allocated" value="0" icon={<Assignment />} color="#1565c0" /></Box>
            <Box><StatCard title="Depreciation (YTD)" value={formatCurrency ? formatCurrency(0) : "₹0"} icon={<TrendingUp />} color="#e65100" /></Box>
            <Box><StatCard title="Maintenance Due" value="0" icon={<Build />} color="#d32f2f" /></Box>
        </Box>
    );
};

export const ContractorDashboard = ({ stats, formatCurrency }) => {
    if (!stats) return null;
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Box><StatCard title="Total Staff" value="0" icon={<People />} color="#ad1457" /></Box>
            <Box><StatCard title="Pending Payments" value={formatCurrency ? formatCurrency(0) : "₹0"} icon={<RequestQuote />} color="#e65100" /></Box>
            <Box><StatCard title="Daily Attendance" value="0%" icon={<CheckCircle />} color="#2e7d32" /></Box>
        </Box>
    );
};
