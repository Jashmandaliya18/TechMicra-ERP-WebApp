import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { Description, ShoppingCart, LocalShipping, Payment } from '@mui/icons-material';
import api from '../../services/api';

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ p: 2, backgroundColor: `${color}.light`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {React.cloneElement(icon, { sx: { color: `${color}.main`, fontSize: 40 } })}
        </Box>
        <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h5" component="div">
                {value}
            </Typography>
        </CardContent>
    </Card>
);

const PurchaseDashboard = () => {
    const [stats, setStats] = useState({
        openIndents: 0,
        pendingPurchaseOrders: 0,
        todaysDeliveries: 0,
        duePaymentsAmount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch purchase dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                Purchase Dashboard
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Open Indents" value={stats.openIndents || 0} icon={<Description />} color="primary" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Pending POs" value={stats.pendingPurchaseOrders || 0} icon={<ShoppingCart />} color="warning" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Today's Deliveries" value={stats.todaysDeliveries || 0} icon={<LocalShipping />} color="success" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Due Payments" value={formatCurrency(stats.duePaymentsAmount)} icon={<Payment />} color="error" />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Recent Activity
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Latest purchase transactions and status updates will appear here. Activity feed integration pending.
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default PurchaseDashboard;
