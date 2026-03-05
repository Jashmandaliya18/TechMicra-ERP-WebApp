import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 10, textAlign: "center" }}>
                <Typography variant="h3" color="error" gutterBottom>
                    403 - Access Denied
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    You do not have the required permissions to view this page.
                </Typography>
                <Button variant="contained" onClick={() => navigate("/")}>
                    Return to Dashboard
                </Button>
            </Box>
        </Container>
    );
}
