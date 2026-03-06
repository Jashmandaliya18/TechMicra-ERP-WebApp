import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { purchaseService } from '../../services/api';
import { Box, CircularProgress, Alert } from '@mui/material';

const IQC = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'goods_receipt_note', label: 'GRN Ref', render: (grn) => grn?.grn_no || 'N/A' },
        { field: 'product', label: 'Item', render: (p) => p?.name || 'N/A' },
        { field: 'total_qty', label: 'Total Qty' },
        { field: 'sample_size', label: 'Sample Size' },
        { field: 'accepted_qty', label: 'Accepted', render: (val) => <Box sx={{ color: 'success.main' }}>{val}</Box> },
        { field: 'rejected_qty', label: 'Rejected', render: (val) => <Box sx={{ color: 'error.main' }}>{val}</Box> }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getAll('incoming-quality-controls');
            setData(res.data);
        } catch (err) {
            setError('Failed to fetch IQC records');
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
                title="Incoming Quality Control (IQC)"
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

export default IQC;
