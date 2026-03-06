import { useState, useEffect } from "react";
import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem, Grid, Alert
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { getAssetAllocations, createAssetAllocation, getAssetMasters } from "../../services/api";

const initialForm = {
    asset_tag: "", employee_name: "", department: "", date_assigned: ""
};

export default function AssetAllocations() {
    const [allocations, setAllocations] = useState([]);
    const [assets, setAssets] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const alcRes = await getAssetAllocations();
            setAllocations(alcRes.data);
            const astRes = await getAssetMasters();
            setAssets(astRes.data.filter(a => a.status === 'Active')); // Only active assets
        } catch (err) {
            console.error("Failed to fetch", err);
        }
    };

    const handleSave = async () => {
        try {
            setError("");
            await createAssetAllocation(formData);
            fetchData();
            setOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save allocation");
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight="600">Asset Allocations</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setFormData(initialForm); setOpen(true); }}>
                    Allocate Asset
                </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Allocation Ref</TableCell>
                            <TableCell>Asset Tag</TableCell>
                            <TableCell>Employee Name</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Date Assigned</TableCell>
                            <TableCell>Date Returned</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allocations.length > 0 ? allocations.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell sx={{ fontWeight: 600 }}>{row.allocation_id}</TableCell>
                                <TableCell>{row.asset_tag}</TableCell>
                                <TableCell>{row.employee_name}</TableCell>
                                <TableCell>{row.department}</TableCell>
                                <TableCell>{row.date_assigned}</TableCell>
                                <TableCell>{row.date_returned || "-"}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={6} align="center">No allocations found</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Allocate Asset</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth select label="Asset Tag (Active Only)" value={formData.asset_tag} onChange={(e) => setFormData({ ...formData, asset_tag: e.target.value })}>
                                {assets.map(ast => <MenuItem key={ast.asset_tag} value={ast.asset_tag}>{ast.asset_tag} - {ast.name}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Employee Name" value={formData.employee_name} onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth type="date" label="Date Assigned" InputLabelProps={{ shrink: true }} value={formData.date_assigned} onChange={(e) => setFormData({ ...formData, date_assigned: e.target.value })} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Confirm Allocation</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
