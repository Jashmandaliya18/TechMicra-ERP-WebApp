import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Grid, MenuItem, CircularProgress, Alert } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { purchaseService } from '../../services/api';
import DataTable from '../../components/DataTable';

const IQC = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // For initial data fetch
    const [error, setError] = useState(null); // For initial data fetch
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        goods_receipt_note_id: '',
        item_name: '',
        total_qty: 0,
        sample_size: 0,
        accepted_qty: 0,
        rejected_qty: 0,
        inspection_date: new Date().toISOString().split('T')[0],
        status: 'Pending'
    });
    const [formLoading, setFormLoading] = useState(false); // For form submission
    const [formError, setFormError] = useState(null); // For form submission

    const navigate = useNavigate();

    const columns = [
        { field: 'item_name', label: 'Item Name' },
        { field: 'total_qty', label: 'Total' },
        { field: 'accepted_qty', label: 'Accepted' },
        { field: 'rejected_qty', label: 'Rejected' },
        { field: 'status', label: 'Status' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getAll('iqc-checks');
            setData(res.data);
        } catch (err) {
            const errMsg = err.response?.data?.message || "";
            if (errMsg.includes("Base table or view not found") || err.response?.status === 404) {
                setData([]);
            } else {
                console.error('Failed to fetch IQC records', err);
                setError('Failed to fetch IQC records');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setFormLoading(true);
            setFormError(null);
            await purchaseService.create('iqc-checks', formData);
            navigate('/purchase/iqc'); // Assuming this navigates to a list view or refreshes
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save IQC');
            console.error('Failed to save IQC', err);
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {showForm ? (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Add IQC Check</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="GRN ID"
                                    value={formData.goods_receipt_note_id}
                                    onChange={(e) => setFormData({ ...formData, goods_receipt_note_id: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Item Name"
                                    value={formData.item_name}
                                    onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Total Qty"
                                    value={formData.total_qty}
                                    onChange={(e) => setFormData({ ...formData, total_qty: Number(e.target.value) })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Sample Size"
                                    value={formData.sample_size}
                                    onChange={(e) => setFormData({ ...formData, sample_size: Number(e.target.value) })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Accepted Qty"
                                    value={formData.accepted_qty}
                                    onChange={(e) => {
                                        const accepted = Number(e.target.value);
                                        setFormData({
                                            ...formData,
                                            accepted_qty: accepted,
                                            rejected_qty: formData.total_qty - accepted
                                        });
                                    }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Rejected Qty"
                                    value={formData.rejected_qty}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <MenuItem value="Passed">Passed</MenuItem>
                                    <MenuItem value="Failed">Failed</MenuItem>
                                    <MenuItem value="Partial">Partial</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Inspection Date"
                                    value={formData.inspection_date}
                                    onChange={(e) => setFormData({ ...formData, inspection_date: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            {formError && (
                                <Grid item xs={12}>
                                    <Alert severity="error">{formError}</Alert>
                                </Grid>
                            )}
                            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button onClick={() => setShowForm(false)} disabled={formLoading}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    startIcon={formLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                                    disabled={formLoading}
                                >
                                    {formLoading ? 'Saving...' : 'Save Inspection'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            ) : (
                <DataTable
                    title="Incoming Quality Control (IQC)"
                    columns={columns}
                    data={data}
                    onAdd={() => setShowForm(true)}
                />
            )}
        </Box >
    );
};

export default IQC;
