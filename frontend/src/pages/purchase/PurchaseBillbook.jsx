import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { purchaseService } from '../../services/api';
import { Box, CircularProgress, Alert } from '@mui/material';

const PurchaseBillbook = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'bill_no', label: 'Bill ID' },
        { field: 'invoice_ref', label: 'Vendor Invoice No' },
        { field: 'invoice_date', label: 'Invoice Date' },
        { field: 'amount', label: 'Taxable Value', render: (val) => `₹${val}` },
        { field: 'gst_amount', label: 'GST Amount', render: (val) => `₹${val}` },
        { field: 'total_amount', label: 'Total', render: (val) => <strong>₹{val}</strong> }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getAll('purchase-billbooks');
            setData(res.data);
        } catch (err) {
            setError('Failed to fetch bills');
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
                title="Purchase Billbook"
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

export default PurchaseBillbook;
