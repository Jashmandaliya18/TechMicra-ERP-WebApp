import { useState, useEffect } from "react";
import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem, Grid, Alert
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { getAssetSales, createAssetSale, getAssetMasters } from "../../services/api";

const initialForm = {
    asset_tag: "", sale_date: "", sale_value: "", book_value: ""
};

export default function AssetSales() {
    const [sales, setSales] = useState([]);
    const [assets, setAssets] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const saleRes = await getAssetSales();
            setSales(saleRes.data);
            const astRes = await getAssetMasters();
            setAssets(astRes.data.filter(a => a.status !== 'Disposed')); // Filter out already disposed
        } catch (err) {
            console.error("Failed to fetch", err);
        }
    };

    const handleSave = async () => {
        try {
            setError("");
            await createAssetSale(formData);
            fetchData();
            setOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to process sale");
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight="600">Asset Sales & Disposals</Typography>
                <Button variant="contained" color="error" startIcon={<AddIcon />} onClick={() => { setFormData(initialForm); setOpen(true); }}>
                    Dispose Asset
                </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sale Ref</TableCell>
                            <TableCell>Asset Tag</TableCell>
                            <TableCell>Sale Date</TableCell>
                            <TableCell>Sale Value (₹)</TableCell>
                            <TableCell>Book Value (₹)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sales.length > 0 ? sales.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell sx={{ fontWeight: 600 }}>{row.sale_id}</TableCell>
                                <TableCell>{row.asset_tag}</TableCell>
                                <TableCell>{row.sale_date}</TableCell>
                                <TableCell>{row.sale_value}</TableCell>
                                <TableCell>{row.book_value}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={5} align="center">No disposals found</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Process Asset Sale / Disposal</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth select label="Asset Tag (Active/Allocated)" value={formData.asset_tag} onChange={(e) => setFormData({ ...formData, asset_tag: e.target.value })}>
                                {assets.map(ast => <MenuItem key={ast.asset_tag} value={ast.asset_tag}>{ast.asset_tag} - {ast.name} ({ast.status})</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth type="date" label="Sale/Disposal Date" InputLabelProps={{ shrink: true }} value={formData.sale_date} onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth type="number" label="Sale Value (0 if scrapped)" value={formData.sale_value} onChange={(e) => setFormData({ ...formData, sale_value: e.target.value })} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth type="number" label="Current Book Value" value={formData.book_value} onChange={(e) => setFormData({ ...formData, book_value: e.target.value })} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleSave}>Confirm Disposal</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
