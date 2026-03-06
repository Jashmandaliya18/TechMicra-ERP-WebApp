import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { purchaseService } from '../../services/api';
import { Box, CircularProgress, Alert } from '@mui/material';

const PurchaseOrders = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'po_no', label: 'PO No' },
        { field: 'vendor', label: 'Vendor', render: (v) => v?.name || 'N/A' },
        { field: 'po_date', label: 'PO Date' },
        { field: 'valid_until', label: 'Valid Until' },
        {
            field: 'status',
            label: 'Status',
            render: (val) => (
                <Box component="span" sx={{
                    color: val === 'Closed' ? 'error.main' : val === 'Approved' ? 'success.main' : 'warning.main',
                    fontWeight: 'bold'
                }}>
                    {val}
                </Box>
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

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <DataTable
                title="Purchase Orders"
                columns={columns}
                data={data}
                onAdd={() => console.log('Add')}
                onEdit={(row) => console.log('Edit', row)}
                onDelete={(row) => console.log('Delete', row)}
                onView={(row) => console.log('View', row)}
            />
        </Box>
    );
};

export default PurchaseOrders;
