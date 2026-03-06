import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function ProtectedRoute({ allowedRoles, requiredPermission }) {
    const { user, role, hasPermission, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }} color="textSecondary">Loading TechMicra ERP...</Typography>
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check Role-based access
    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(role) && role !== 'Super Admin') {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Check Permission-based access
    if (requiredPermission) {
        if (!hasPermission(requiredPermission)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Outlet />;
}
