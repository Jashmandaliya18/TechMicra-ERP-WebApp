import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, useTheme, alpha } from "@mui/material";
import { Add } from "@mui/icons-material";

export default function ModulePage({ title, subtitle, columns = [], sampleData = [], statusField, addLabel = "Add New" }) {
    const theme = useTheme();

    const getStatusColor = (status) => {
        const map = {
            Active: "success", Open: "info", Draft: "default", Pending: "warning",
            Closed: "error", Paid: "success", Approved: "success", Pass: "success",
            Fail: "error", Processing: "info", Quoted: "secondary", Completed: "success",
            "In-Progress": "info", "In-Transit": "info", Booked: "info", Delivered: "success",
            Scheduled: "warning", Rejected: "error", Conditional: "warning",
        };
        return map[status] || "default";
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Button variant="contained" startIcon={<Add />} id={`add-${title.toLowerCase().replace(/\s/g, "-")}-btn`} sx={{ px: 3, py: 1 }}>
                    {addLabel}
                </Button>
            </Box>

            {/* Table */}
            <Paper
                elevation={0}
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: "hidden",
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                {columns.map((col) => (
                                    <TableCell key={col}>{col}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sampleData.length > 0 ? (
                                sampleData.map((row, idx) => (
                                    <TableRow key={idx} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                        {columns.map((col) => (
                                            <TableCell key={col}>
                                                {statusField && col === statusField ? (
                                                    <Chip label={row[col]} size="small" color={getStatusColor(row[col])} variant="outlined" />
                                                ) : (
                                                    row[col] || "—"
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No records found. Click "{addLabel}" to create your first entry.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
