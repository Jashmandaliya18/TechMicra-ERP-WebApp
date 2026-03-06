import { useState, useEffect } from "react";
import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem, IconButton,
    Chip, Grid, Alert
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
    getAssetMasters, createAssetMaster, updateAssetMaster, deleteAssetMaster,
    createAssetAddition
} from "../../services/api";

const initialForm = {
    name: "", group: "IT", purchase_date: "", value: "",
    // Addition details
    invoice_ref: "", installation_date: "", depreciation_rate_percent: ""
};

export default function AssetRegister() {
    const [assets, setAssets] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialForm);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await getAssetMasters();
            setAssets(res.data);
        } catch (err) {
            console.error("Failed to fetch assets", err);
        }
    };

    const handleSave = async () => {
        try {
            setError("");
            if (isEdit) {
                await updateAssetMaster(editId, {
                    name: formData.name,
                    group: formData.group,
                    purchase_date: formData.purchase_date,
                    value: formData.value
                });
            } else {
                // 1. Create Master
                const masterRes = await createAssetMaster({
                    name: formData.name,
                    group: formData.group,
                    purchase_date: formData.purchase_date,
                    value: formData.value
                });

                // 2. Create Addition
                if (masterRes.data && masterRes.data.asset_tag) {
                    await createAssetAddition({
                        asset_tag: masterRes.data.asset_tag,
                        invoice_ref: formData.invoice_ref || "NA",
                        installation_date: formData.installation_date || formData.purchase_date,
                        depreciation_rate_percent: formData.depreciation_rate_percent || 0
                    });
                }
            }
            fetchAssets();
            setOpen(false);
        } catch (err) {
            setError("Failed to save asset");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this asset?")) {
            await deleteAssetMaster(id);
            fetchAssets();
        }
    };

    const handleEdit = (asset) => {
        setFormData({
            ...initialForm,
            name: asset.name,
            group: asset.group,
            purchase_date: asset.purchase_date,
            value: asset.value
        });
        setEditId(asset.id);
        setIsEdit(true);
        setOpen(true);
    };

    const handleAdd = () => {
        setFormData(initialForm);
        setIsEdit(false);
        setOpen(true);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight="600">Asset Register</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
                    Add Asset
                </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Asset Tag</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Group</TableCell>
                            <TableCell>Purchase Date</TableCell>
                            <TableCell>Value (₹)</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assets.map((st) => (
                            <TableRow key={st.id}>
                                <TableCell sx={{ fontWeight: 600 }}>{st.asset_tag}</TableCell>
                                <TableCell>{st.name}</TableCell>
                                <TableCell>{st.group}</TableCell>
                                <TableCell>{st.purchase_date}</TableCell>
                                <TableCell>{st.value}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={st.status}
                                        size="small"
                                        color={st.status === 'Active' ? 'success' : st.status === 'Allocated' ? 'primary' : 'default'}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleEdit(st)}><EditIcon fontSize="small" /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(st.id)}><DeleteIcon fontSize="small" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{isEdit ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Typography variant="subtitle2" color="primary" gutterBottom>Master Details</Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Asset Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth select label="Group" value={formData.group} onChange={(e) => setFormData({ ...formData, group: e.target.value })}>
                                {['IT', 'Plant', 'Furniture'].map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth type="date" label="Purchase Date" InputLabelProps={{ shrink: true }} value={formData.purchase_date} onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth type="number" label="Value" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
                        </Grid>
                    </Grid>

                    {!isEdit && (
                        <>
                            <Typography variant="subtitle2" color="secondary" gutterBottom>Addition & Depreciation Info</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Invoice Ref" value={formData.invoice_ref} onChange={(e) => setFormData({ ...formData, invoice_ref: e.target.value })} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth type="date" label="Installation Date" InputLabelProps={{ shrink: true }} value={formData.installation_date} onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth type="number" label="Depreciation Rate (%)" value={formData.depreciation_rate_percent} onChange={(e) => setFormData({ ...formData, depreciation_rate_percent: e.target.value })} />
                                </Grid>
                            </Grid>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save Asset</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
