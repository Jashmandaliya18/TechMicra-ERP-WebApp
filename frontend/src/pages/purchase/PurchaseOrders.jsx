import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import { purchaseService } from '../../services/api';
import { Box, CircularProgress, Alert, Chip } from '@mui/material';

const PurchaseOrders = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const columns = [
        { field: 'po_no', label: 'PO No' },
        { field: 'po_date', label: 'PO Date' },
        { field: 'vendor_name', label: 'Vendor' },
        { field: 'total_amount', label: 'Total Amount' },
        {
            field: 'status',
            label: 'Status',
            render: (val) => (
                <Chip
                    label={val}
                    size="small"
                    color={val === 'Pending' ? 'warning' : 'success'}
                    sx={{ fontWeight: 'bold' }}
                />
            )
        }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getAll('purchase-orders');
            setData(res.data);
        } catch (err) {
            setError('Failed to fetch purchase orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (row) => {
        if (window.confirm('Are you sure you want to delete this purchase order?')) {
            try {
                await purchaseService.delete('purchase-orders', row.id);
                fetchData();
            } catch (err) {
                console.error('Failed to delete', err);
                const errMsg = err.response?.data?.message || 'Failed to delete purchase order';
                setError(errMsg);
            }
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
            <DataTable
                title="Purchase Orders"
                columns={columns}
                data={data}
                onAdd={() => navigate('/purchase/orders/new')}
                onView={(row) => navigate(`/purchase/orders/${row.id}`)}
                onEdit={(row) => navigate(`/purchase/orders/edit/${row.id}`)}
                onDelete={handleDelete}
            />
        </Box>
    );
};

export default PurchaseOrders;
