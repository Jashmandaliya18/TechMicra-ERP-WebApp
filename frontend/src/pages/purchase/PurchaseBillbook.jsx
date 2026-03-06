import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { purchaseService } from '../../services/api';
import DataTable from '../../components/DataTable';

const PurchaseBillbook = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        purchase_order_id: '',
        vendor_invoice_no: '',
        invoice_date: new Date().toISOString().split('T')[0],
        taxable_value: 0,
        gst_amount: 0,
        total_amount: 0
    });

    const columns = [
        { field: 'bill_id', label: 'Bill ID' },
        { field: 'purchase_order_id', label: 'PO ID' },
        { field: 'vendor_invoice_no', label: 'Invoice No' },
        { field: 'total_amount', label: 'Total Amount' },
        { field: 'invoice_date', label: 'Date' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getAll('purchase-billbooks');
            setData(res.data);
        } catch (err) {
            setError('Failed to fetch bill records');
        } finally {
            setLoading(false);
        }
    };

    const handleAmountChange = (e) => {
        const val = parseFloat(e.target.value) || 0;
        const name = e.target.name;
        const newFormData = { ...formData, [name]: val };

        if (name === 'taxable_value' || name === 'gst_amount') {
            newFormData.total_amount = (newFormData.taxable_value || 0) + (newFormData.gst_amount || 0);
        }

        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await purchaseService.create('purchase-billbooks', formData);
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
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>New Purchase Bill</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="PO ID" name="purchase_order_id" value={formData.purchase_order_id} onChange={(e) => setFormData({ ...formData, purchase_order_id: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="Vendor Invoice No" name="vendor_invoice_no" value={formData.vendor_invoice_no} onChange={(e) => setFormData({ ...formData, vendor_invoice_no: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth label="Invoice Date" type="date" value={formData.invoice_date} onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })} InputLabelProps={{ shrink: true }} required />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth type="number" label="Taxable Value" name="taxable_value" value={formData.taxable_value} onChange={handleAmountChange} required />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth type="number" label="GST Amount" name="gst_amount" value={formData.gst_amount} onChange={handleAmountChange} required />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" fontWeight="bold">Total Amount: {formData.total_amount.toFixed(2)}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button variant="contained" type="submit" startIcon={<SaveIcon />}>Save Bill</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            ) : (
                <DataTable
                    title="Purchase Billbook"
                    columns={columns}
                    data={data}
                    onAdd={() => setShowForm(true)}
                />
            )}
        </Box>
    );
};

export default PurchaseBillbook;
