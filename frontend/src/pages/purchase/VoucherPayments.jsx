import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { purchaseService } from '../../services/api';
import DataTable from '../../components/DataTable';

const VoucherPayments = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        vendor: '',
        billbook_id: '',
        payment_date: new Date().toISOString().split('T')[0],
        bank_account: '',
        amount: 0
    });

    const columns = [
        { field: 'voucher_no', label: 'Voucher No' },
        { field: 'vendor', label: 'Vendor' },
        { field: 'billbook_id', label: 'Bill ID' },
        { field: 'amount', label: 'Amount' },
        { field: 'payment_date', label: 'Date' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getAll('voucher-payments');
            setData(res.data);
        } catch (err) {
            setError('Failed to fetch voucher records');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await purchaseService.create('voucher-payments', formData);
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
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>New Voucher Payment</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="Vendor" value={formData.vendor} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="Bill ID" value={formData.billbook_id} onChange={(e) => setFormData({ ...formData, billbook_id: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth label="Payment Date" type="date" value={formData.payment_date} onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })} InputLabelProps={{ shrink: true }} required />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth label="Bank Account" value={formData.bank_account} onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth type="number" label="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} required />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button variant="contained" type="submit" startIcon={<SaveIcon />}>Save Payment</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            ) : (
                <DataTable
                    title="Voucher Payments"
                    columns={columns}
                    data={data}
                    onAdd={() => setShowForm(true)}
                />
            )}
        </Box>
    );
};

export default VoucherPayments;
