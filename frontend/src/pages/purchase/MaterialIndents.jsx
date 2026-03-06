import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { purchaseService } from '../../services/api';
import { Box, CircularProgress, Alert } from '@mui/material';

const MaterialIndents = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'indent_no', label: 'Indent No' },
        { field: 'request_date', label: 'Request Date' },
        { field: 'department', label: 'Department' },
        {
            field: 'priority',
            label: 'Priority',
            render: (val) => (
                <Box component="span" sx={{
                    color: val === 'High' ? 'error.main' : val === 'Medium' ? 'warning.main' : 'success.main',
                    fontWeight: 'bold'
                }}>
                    {val}
                </Box>
            )
        },
        {
            field: 'items',
            label: 'Items Qty',
            render: (items) => items ? items.reduce((acc, item) => acc + item.requested_qty, 0) : 0
        }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getAll('material-indents');
            setData(res.data);
        } catch (err) {
            setError('Failed to fetch material indents');
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
                title="Material Indents"
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

export default MaterialIndents;
