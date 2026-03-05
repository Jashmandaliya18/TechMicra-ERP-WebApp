import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function ProtectedRoute({ allowedRoles }) {
    const { user, loading } = useAuth();

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

    if (allowedRoles && allowedRoles.length > 0) {
        // Check if the user has any of the allowed roles
        const userRoles = user.roles?.map(role => role.name) || [];
        const hasRole = allowedRoles.some(role => userRoles.includes(role));

        // Fallback: If no role match AND they aren't a Super Admin, deny
        if (!hasRole && !userRoles.includes('Super Admin')) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Outlet />;
}
