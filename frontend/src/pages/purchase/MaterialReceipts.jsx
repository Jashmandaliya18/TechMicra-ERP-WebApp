import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { purchaseService } from '../../services/api';
import DataTable from '../../components/DataTable';

const MaterialReceipts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        goods_receipt_note_id: '',
        storage_location: '',
        batch_no: ''
    });

    const columns = [
        { field: 'receipt_id', label: 'Receipt ID' },
        { field: 'goods_receipt_note_id', label: 'GRN ID' },
        { field: 'storage_location', label: 'Location' },
        { field: 'batch_no', label: 'Batch No' },
        { field: 'created_at', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getAll('material-receipts');
            setData(res.data);
        } catch (err) {
            setError('Failed to fetch receipt records');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await purchaseService.create('material-receipts', formData);
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
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>New Material Receipt</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth label="GRN ID" name="goods_receipt_note_id" value={formData.goods_receipt_note_id} onChange={(e) => setFormData({ ...formData, goods_receipt_note_id: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth label="Storage Location" name="storage_location" value={formData.storage_location} onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth label="Batch No" name="batch_no" value={formData.batch_no} onChange={(e) => setFormData({ ...formData, batch_no: e.target.value })} required />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button variant="contained" type="submit" startIcon={<SaveIcon />}>Save Receipt</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            ) : (
                <DataTable
                    title="Material Receipts"
                    columns={columns}
                    data={data}
                    onAdd={() => setShowForm(true)}
                />
            )}
        </Box>
    );
};

export default MaterialReceipts;
