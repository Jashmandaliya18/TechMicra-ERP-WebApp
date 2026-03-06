import React from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { Description, ShoppingCart, LocalShipping, Payment } from '@mui/icons-material';

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
    return (
        <Box>
            <Typography variant="h4" gutterBottom color="primary">
                Purchase Dashboard
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Open Indents" value="12" icon={<Description />} color="primary" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Pending POs" value="5" icon={<ShoppingCart />} color="warning" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Today's Deliveries" value="8" icon={<LocalShipping />} color="success" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Due Payments" value="₹45,200" icon={<Payment />} color="error" />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Recent Activity
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Latest purchase transactions and status updates will appear here.
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default PurchaseDashboard;
