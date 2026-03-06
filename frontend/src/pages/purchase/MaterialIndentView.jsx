import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Divider, CircularProgress, Alert, Button, Link, Chip, useTheme } from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { purchaseService } from '../../services/api';
import { ArrowBack as BackIcon } from '@mui/icons-material';

const MaterialIndentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const [indent, setIndent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIndent = async () => {
            try {
                const res = await purchaseService.getById('material-indents', id);
                setIndent(res.data);
            } catch (err) {
                setError('Failed to fetch indent details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchIndent();
    }, [id]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!indent) return <Alert severity="warning">Indent not found</Alert>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button startIcon={<BackIcon />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    Back to List
                </Button>
                <Typography variant="h4" fontWeight="bold">Indent Details: {indent.indent_no}</Typography>
                <Chip
                    label={indent.status}
                    color={indent.status === 'Pending' ? 'warning' : 'success'}
                    sx={{ ml: 2, fontWeight: 'bold' }}
                />
            </Box>

            <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Typography color="textSecondary" variant="subtitle2">Request Date</Typography>
                        <Typography variant="body1" fontWeight="medium">{indent.request_date}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography color="textSecondary" variant="subtitle2">Department</Typography>
                        <Typography variant="body1" fontWeight="medium">{indent.department}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography color="textSecondary" variant="subtitle2">Priority</Typography>
                        <Typography variant="body1" fontWeight="medium">{indent.priority}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Items Requested</Typography>
                        <Box component="div" sx={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'inherit' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: `2px solid ${theme.palette.divider}` }}>
                                        <th style={{ padding: '12px' }}>Item Name</th>
                                        <th style={{ padding: '12px' }}>Current Stock</th>
                                        <th style={{ padding: '12px' }}>Requested Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {indent.items.map((item, index) => (
                                        <tr key={index} style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                                            <td style={{ padding: '12px' }}>{item.item_name}</td>
                                            <td style={{ padding: '12px' }}>{item.current_stock}</td>
                                            <td style={{ padding: '12px' }}>{item.requested_qty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to={`/purchase/orders/new?indent_id=${indent.id}`}
                >
                    Convert to Purchase Order
                </Button>
            </Box>
        </Box>
    );
};

export default MaterialIndentView;
