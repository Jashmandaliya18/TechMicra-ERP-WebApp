import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { purchaseService } from '../../services/api';
import { Box, CircularProgress, Alert } from '@mui/material';

const PurchaseSchedule = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'purchase_order', label: 'PO Ref', render: (po) => po?.po_no || 'N/A' },
        { field: 'expected_date', label: 'Expected Date' },
        {
            field: 'follow_up_status',
            label: 'Follow-up Status',
            render: (val) => (
                <Box component="span" sx={{
                    color: val === 'Delayed' ? 'error.main' : val === 'On-Time' ? 'success.main' : 'warning.main',
                    fontWeight: 'bold'
                }}>
                    {val}
                </Box>
            )
        },
        { field: 'remarks', label: 'Remarks' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getAll('purchase-schedules');
            setData(res.data);
        } catch (err) {
            setError('Failed to fetch schedules');
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
                title="Purchase Schedule"
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

export default PurchaseSchedule;
