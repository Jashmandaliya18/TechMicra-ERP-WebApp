import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import { purchaseService } from '../../services/api';
import { Box, CircularProgress, Alert, Chip } from '@mui/material';

const MaterialIndents = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const columns = [
        { field: 'indent_no', label: 'Indent No' },
        { field: 'request_date', label: 'Request Date' },
        { field: 'department', label: 'Department' },
        {
            field: 'priority',
            label: 'Priority',
            render: (val) => (
                <Chip
                    label={val}
                    size="small"
                    color={val === 'High' ? 'error' : val === 'Medium' ? 'warning' : 'success'}
                    sx={{ fontWeight: 'bold' }}
                />
            )
        },
        { field: 'status', label: 'Status' }
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
                onAdd={() => navigate('/purchase/material-indents/new')}
                onView={(row) => navigate(`/purchase/material-indents/${row.id}`)}
                onEdit={(row) => navigate(`/purchase/material-indents/edit/${row.id}`)}
                onDelete={(row) => console.log('Delete', row)}
            />
        </Box>
    );
};

export default MaterialIndents;
