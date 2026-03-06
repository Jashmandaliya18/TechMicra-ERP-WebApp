import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { purchaseService } from '../../services/api';
import { Box, CircularProgress, Alert } from '@mui/material';

const VoucherPayments = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'voucher_no', label: 'Voucher No' },
        { field: 'vendor', label: 'Vendor', render: (v) => v?.name || 'N/A' },
        { field: 'payment_date', label: 'Payment Date' },
        { field: 'amount_paid', label: 'Amount', render: (val) => `₹${val}` },
        { field: 'payment_mode', label: 'Mode' },
        { field: 'bank_account', label: 'Bank Account' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getAll('voucher-payments');
            setData(res.data);
        } catch (err) {
            setError('Failed to fetch payments');
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
                title="Voucher Payments"
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

export default VoucherPayments;
