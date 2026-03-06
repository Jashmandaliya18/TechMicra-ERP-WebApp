import { useState, useEffect } from "react";
import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem, Grid, Alert
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { getAssetDepreciations, createAssetDepreciation, getAssetMasters } from "../../services/api";

const initialForm = {
    year: new Date().getFullYear(), asset_tag: "", opening_balance: "", depreciation_amount: "", closing_balance: ""
};

export default function AssetDepreciation() {
    const [records, setRecords] = useState([]);
    const [assets, setAssets] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const depRes = await getAssetDepreciations();
            setRecords(depRes.data);
            const astRes = await getAssetMasters();
            setAssets(astRes.data.filter(a => a.status !== 'Disposed'));
        } catch (err) {
            console.error("Failed to fetch", err);
        }
    };

    const handleSave = async () => {
        try {
            setError("");
            await createAssetDepreciation(formData);
            fetchData();
            setOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to log depreciation");
        }
    };

    // Auto calculate closing balance
    const handleAmountsChanged = (field, value) => {
        const newData = { ...formData, [field]: value };
        const openBal = parseFloat(newData.opening_balance) || 0;
        const depAmt = parseFloat(newData.depreciation_amount) || 0;
        newData.closing_balance = (openBal - depAmt).toFixed(2);
        setFormData(newData);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight="600">Asset Depreciation Logs</Typography>
                <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => { setFormData(initialForm); setOpen(true); }}>
                    Log Depreciation
                </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Dep. Ref</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Asset Tag</TableCell>
                            <TableCell>Opening Bal (₹)</TableCell>
                            <TableCell>Depreciation (₹)</TableCell>
                            <TableCell>Closing Bal (₹)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.length > 0 ? records.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell sx={{ fontWeight: 600 }}>{row.depreciation_id}</TableCell>
                                <TableCell>{row.year}</TableCell>
                                <TableCell>{row.asset_tag}</TableCell>
                                <TableCell>{row.opening_balance}</TableCell>
                                <TableCell>{row.depreciation_amount}</TableCell>
                                <TableCell>{row.closing_balance}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={6} align="center">No depreciation records found</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Log Yearly Depreciation</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth type="number" label="Financial Year" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <TextField fullWidth select label="Asset Tag" value={formData.asset_tag} onChange={(e) => setFormData({ ...formData, asset_tag: e.target.value })}>
                                {assets.map(ast => <MenuItem key={ast.asset_tag} value={ast.asset_tag}>{ast.asset_tag} - {ast.name}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth type="number" label="Opening Balance" value={formData.opening_balance} onChange={(e) => handleAmountsChanged('opening_balance', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth type="number" label="Depreciation Amt" value={formData.depreciation_amount} onChange={(e) => handleAmountsChanged('depreciation_amount', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth type="number" label="Closing Balance" value={formData.closing_balance} InputProps={{ readOnly: true }} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="secondary" onClick={handleSave}>Log Entry</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
