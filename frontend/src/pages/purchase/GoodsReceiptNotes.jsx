import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import { purchaseService } from '../../services/api';
import { Box, CircularProgress, Alert } from '@mui/material';

const GoodsReceiptNotes = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const columns = [
        { field: 'grn_no', label: 'GRN No' },
        { field: 'gate_entry_date', label: 'Entry Date' },
        { field: 'vendor_challan_no', label: 'Challan No' },
        { field: 'vehicle_no', label: 'Vehicle No' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getAll('goods-receipt-notes');
            setData(res.data);
        } catch (err) {
            setError('Failed to fetch GRNs');
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
                title="Goods Receipt Notes"
                columns={columns}
                data={data}
                onAdd={() => navigate('/purchase/grn/new')}
                onView={(row) => console.log('View', row)}
                onEdit={(row) => console.log('Edit', row)}
                onDelete={(row) => console.log('Delete', row)}
            />
        </Box>
    );
};

export default GoodsReceiptNotes;
