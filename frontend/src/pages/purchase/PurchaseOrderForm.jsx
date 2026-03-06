import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, IconButton, Table, TableHead, TableRow, TableCell, TableBody, MenuItem, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { purchaseService } from '../../services/api';

const PurchaseOrderForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const indentId = query.get('indent_id');
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        vendor_name: '',
        po_date: new Date().toISOString().split('T')[0],
        valid_until: '',
        items: [{ item_name: '', quantity: 1, rate: 0, subtotal: 0 }]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEdit) {
            const fetchPO = async () => {
                try {
                    setLoading(true);
                    const res = await purchaseService.getById('purchase-orders', id);
                    setFormData(res.data);
                } catch (err) {
                    setError('Failed to fetch PO details');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchPO();
        } else if (indentId) {
            const fetchIndent = async () => {
                try {
                    setLoading(true);
                    const res = await purchaseService.getById('material-indents', indentId);
                    const indentData = res.data;
                    setFormData(prev => ({
                        ...prev,
                        items: indentData.items.map(item => ({
                            item_name: item.item_name,
                            quantity: item.requested_qty,
                            rate: 0,
                            subtotal: 0
                        }))
                    }));
                } catch (err) {
                    setError('Failed to fetch indent details');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchIndent();
        }
    }, [indentId, id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, e) => {
        const newItems = [...formData.items];
        newItems[index][e.target.name] = e.target.name === 'item_name' ? e.target.value : parseFloat(e.target.value) || 0;
        if (e.target.name === 'quantity' || e.target.name === 'rate') {
            newItems[index].subtotal = newItems[index].quantity * newItems[index].rate;
        }
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { item_name: '', quantity: 1, rate: 0, subtotal: 0 }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            if (isEdit) {
                await purchaseService.update('purchase-orders', id, formData);
            } else {
                await purchaseService.create('purchase-orders', formData);
            }
            navigate('/purchase/orders');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save PO');
            console.error('Failed to save PO', err);
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = formData.items.reduce((acc, item) => acc + item.subtotal, 0);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <BackIcon />
                </IconButton>
                <Typography variant="h4" fontWeight="bold">
                    {isEdit ? 'Edit Purchase Order' : 'Create Purchase Order'}
                </Typography>
            </Box>

            {loading && <Box sx={{ mb: 2 }}><CircularProgress size={24} sx={{ mr: 1 }} /> Loading...</Box>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Vendor Name"
                                name="vendor_name"
                                value={formData.vendor_name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="PO Date"
                                type="date"
                                name="po_date"
                                value={formData.po_date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Valid Until"
                                type="date"
                                name="valid_until"
                                value={formData.valid_until}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Items</Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item Name</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Rate</TableCell>
                                        <TableCell>Subtotal</TableCell>
                                        <TableCell width={50}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formData.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    name="item_name"
                                                    value={item.item_name}
                                                    onChange={(e) => handleItemChange(index, e)}
                                                    size="small"
                                                    required
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    name="quantity"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, e)}
                                                    size="small"
                                                    required
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    name="rate"
                                                    value={item.rate}
                                                    onChange={(e) => handleItemChange(index, e)}
                                                    size="small"
                                                    required
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{item.subtotal.toFixed(2)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => removeItem(index)} color="error" disabled={formData.items.length === 1}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Button startIcon={<AddIcon />} onClick={addItem} sx={{ mt: 2 }}>
                                Add Item
                            </Button>
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                            <Typography variant="h5" fontWeight="bold">Total Amount: {totalAmount.toFixed(2)}</Typography>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<SaveIcon />}
                                type="submit"
                                sx={{ px: 5, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1.1rem' }}
                            >
                                Save Purchase Order
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default PurchaseOrderForm;
