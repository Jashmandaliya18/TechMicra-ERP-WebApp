import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';

const DataTable = ({ title, columns, data, onAdd, onEdit, onDelete, onView }) => {
    return (
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2" color="primary">
                    {title}
                </Typography>
                {onAdd && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
                        Add New
                    </Button>
                )}
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.field} sx={{ fontWeight: 'bold' }}>
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? data.map((row, index) => (
                            <TableRow key={row.id || index} hover>
                                {columns.map((column) => (
                                    <TableCell key={column.field}>
                                        {column.render ? column.render(row[column.field], row) : row[column.field]}
                                    </TableCell>
                                ))}
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {onView && (
                                            <Tooltip title="View">
                                                <IconButton size="small" onClick={() => onView(row)} color="info">
                                                    <ViewIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {onEdit && (
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => onEdit(row)} color="primary">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {onDelete && (
                                            <Tooltip title="Delete">
                                                <IconButton size="small" onClick={() => onDelete(row)} color="error">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body2" color="textSecondary">No records found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default DataTable;
