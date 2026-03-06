import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Divider, CircularProgress, Alert, Button, Chip, useTheme } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { purchaseService } from '../../services/api';
import { ArrowBack as BackIcon } from '@mui/icons-material';

const PurchaseOrderView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const [po, setPo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPo = async () => {
            try {
                const res = await purchaseService.getById('purchase-orders', id);
                setPo(res.data);
            } catch (err) {
                setError('Failed to fetch PO details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPo();
    }, [id]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!po) return <Alert severity="warning">Purchase Order not found</Alert>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button startIcon={<BackIcon />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    Back to List
                </Button>
                <Typography variant="h4" fontWeight="bold">PO Details: {po.po_no}</Typography>
                <Chip
                    label={po.status}
                    color={po.status === 'Pending' ? 'warning' : 'success'}
                    sx={{ ml: 2, fontWeight: 'bold' }}
                />
            </Box>

            <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Typography color="textSecondary" variant="subtitle2">Vendor</Typography>
                        <Typography variant="body1" fontWeight="medium">{po.vendor_name}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography color="textSecondary" variant="subtitle2">PO Date</Typography>
                        <Typography variant="body1" fontWeight="medium">{po.po_date}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography color="textSecondary" variant="subtitle2">Valid Until</Typography>
                        <Typography variant="body1" fontWeight="medium">{po.valid_until || 'N/A'}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Order Items</Typography>
                        <Box component="div" sx={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'inherit' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: `2px solid ${theme.palette.divider}` }}>
                                        <th style={{ padding: '12px' }}>Item Name</th>
                                        <th style={{ padding: '12px' }}>Quantity</th>
                                        <th style={{ padding: '12px' }}>Rate</th>
                                        <th style={{ padding: '12px', textAlign: 'right' }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {po.items.map((item, index) => (
                                        <tr key={index} style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                                            <td style={{ padding: '12px' }}>{item.item_name}</td>
                                            <td style={{ padding: '12px' }}>{item.quantity}</td>
                                            <td style={{ padding: '12px' }}>{item.rate}</td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>{item.subtotal}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={3} style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Total Amount</td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{po.total_amount}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/purchase/grn/new?po_id=${po.id}`)}
                >
                    Create GRN
                </Button>
            </Box>
        </Box>
    );
};

export default PurchaseOrderView;
