import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, IconButton, Table, TableHead, TableRow, TableCell, TableBody, MenuItem, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { purchaseService } from '../../services/api';

const MaterialIndentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        request_date: new Date().toISOString().split('T')[0],
        department: '',
        priority: 'Medium',
        items: [{ item_name: '', requested_qty: 1, current_stock: 0 }]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEdit) {
            const fetchIndent = async () => {
                try {
                    setLoading(true);
                    const res = await purchaseService.getById('material-indents', id);
                    setFormData(res.data);
                } catch (err) {
                    setError('Failed to fetch indent details');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchIndent();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, e) => {
        const newItems = [...formData.items];
        newItems[index][e.target.name] = e.target.value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { item_name: '', requested_qty: 1, current_stock: 0 }]
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
                await purchaseService.update('material-indents', id, formData);
            } else {
                await purchaseService.create('material-indents', formData);
            }
            navigate('/purchase/material-indents');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save indent');
            console.error('Failed to save indent', err);
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
                <Typography variant="h4" fontWeight="bold">
                    {isEdit ? 'Edit Material Indent' : 'Create Material Indent'}
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
                                label="Request Date"
                                type="date"
                                name="request_date"
                                value={formData.request_date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                select
                                label="Priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Items</Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item Name</TableCell>
                                        <TableCell>Current Stock</TableCell>
                                        <TableCell>Requested Qty</TableCell>
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
                                                    name="current_stock"
                                                    value={item.current_stock}
                                                    onChange={(e) => handleItemChange(index, e)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    name="requested_qty"
                                                    value={item.requested_qty}
                                                    onChange={(e) => handleItemChange(index, e)}
                                                    size="small"
                                                    required
                                                />
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

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<SaveIcon />}
                                type="submit"
                                sx={{ px: 5, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1.1rem' }}
                            >
                                Save Indent
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default MaterialIndentForm;
