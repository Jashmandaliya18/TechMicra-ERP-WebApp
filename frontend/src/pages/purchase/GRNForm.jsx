import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, IconButton, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert } from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { purchaseService } from '../../services/api';

const GRNForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const poId = query.get('po_id');

    const [formData, setFormData] = useState({
        purchase_order_id: poId || '',
        received_date: new Date().toISOString().split('T')[0],
        vendor_challan_no: '',
        vehicle_no: '',
        items: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (poId) {
            const fetchPo = async () => {
                try {
                    const res = await purchaseService.getById('purchase-orders', poId);
                    const poData = res.data;
                    setFormData(prev => ({
                        ...prev,
                        items: poData.items.map(item => ({
                            item_name: item.item_name,
                            product_id: item.product_id,
                            received_qty: item.quantity
                        }))
                    }));
                } catch (error) {
                    console.error('Failed to fetch PO for GRN', error);
                }
            };
            fetchPo();
        }
    }, [poId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, e) => {
        const newItems = [...formData.items];
        newItems[index][e.target.name] = e.target.name === 'item_name' ? e.target.value : parseInt(e.target.value) || 0;
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await purchaseService.create('goods-receipt-notes', formData);
            navigate('/purchase/grn');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save GRN');
            console.error('Failed to create GRN', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <BackIcon />
                </IconButton>
                <Typography variant="h4" fontWeight="bold">Create Goods Receipt Note (GRN)</Typography>
            </Box>

            {loading && <Box sx={{ mb: 2 }}><CircularProgress size={24} sx={{ mr: 1 }} /> Loading...</Box>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="PO ID"
                                name="purchase_order_id"
                                value={formData.purchase_order_id}
                                onChange={handleChange}
                                disabled={!!poId}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Vendor Challan No"
                                name="vendor_challan_no"
                                value={formData.vendor_challan_no}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Gate Entry Date"
                                type="date"
                                name="gate_entry_date"
                                value={formData.gate_entry_date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Vehicle No"
                                name="vehicle_no"
                                value={formData.vehicle_no}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Received Items</Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item Name</TableCell>
                                        <TableCell>Received Qty</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formData.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.item_name}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    name="received_qty"
                                                    value={item.received_qty}
                                                    onChange={(e) => handleItemChange(index, e)}
                                                    size="small"
                                                    required
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<SaveIcon />}
                                type="submit"
                                sx={{ px: 5, py: 1.5, borderRadius: 2 }}
                            >
                                Save GRN
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default GRNForm;
