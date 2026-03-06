import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, MenuItem, CircularProgress, Alert } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { purchaseService } from '../../services/api';
import DataTable from '../../components/DataTable';

const PurchaseSchedule = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        purchase_order_id: '',
        scheduled_date: new Date().toISOString().split('T')[0],
        followup_status: 'Scheduled'
    });

    const columns = [
        { field: 'purchase_order_id', label: 'PO ID' },
        { field: 'scheduled_date', label: 'Scheduled Date' },
        { field: 'followup_status', label: 'Followup Status' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getAll('purchase-schedules');
            setData(res.data);
        } catch (err) {
            setError('Failed to fetch schedule records');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await purchaseService.create('purchase-schedules', formData);
            setShowForm(false);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {showForm ? (
                <Paper sx={{ p: 4, mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>New Purchase Schedule</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="PO ID" value={formData.purchase_order_id} onChange={(e) => setFormData({ ...formData, purchase_order_id: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth type="date" label="Scheduled Date" value={formData.scheduled_date} onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })} InputLabelProps={{ shrink: true }} required />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth select label="Followup Status" value={formData.followup_status} onChange={(e) => setFormData({ ...formData, followup_status: e.target.value })}>
                                    <MenuItem value="Scheduled">Scheduled</MenuItem>
                                    <MenuItem value="Delivered">Delivered</MenuItem>
                                    <MenuItem value="Delayed">Delayed</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button variant="contained" type="submit" startIcon={<SaveIcon />}>Save Schedule</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            ) : (
                <DataTable
                    title="Purchase Schedules"
                    columns={columns}
                    data={data}
                    onAdd={() => setShowForm(true)}
                />
            )}
        </Box>
    );
};

export default PurchaseSchedule;
