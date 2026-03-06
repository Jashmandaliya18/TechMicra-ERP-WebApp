import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                primary: { main: "#1565c0", light: "#1976d2", dark: "#0d47a1" },
                secondary: { main: "#7c4dff" },
                background: { default: "#f5f7fa", paper: "#ffffff" },
                text: { primary: "#1a2027", secondary: "#5f6368" },
                divider: "rgba(0,0,0,0.08)",
            }
            : {
                primary: { main: "#64b5f6", light: "#90caf9", dark: "#2196f3" },
                secondary: { main: "#b388ff" },
                background: { default: "#070e17", paper: "#0b1523" },
                text: { primary: "#f1f5f9", secondary: "#94a3b8" },
                divider: "rgba(255,255,255,0.06)",
            }),
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 500 },
    },
    shape: { borderRadius: 16 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 10,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backdropFilter: mode === "dark" ? "blur(12px)" : "none",
                    backgroundColor: mode === "dark" ? "rgba(11, 21, 35, 0.8)" : "#fff",
                    border: mode === "dark" ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    border: "none",
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    marginBottom: 2,
                    "&.Mui-selected": {
                        fontWeight: 600,
                    },
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    "& .MuiTableCell-head": {
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        letterSpacing: "0.08em",
                    },
                },
            },
        },
    },
});

export function ThemeModeProvider({ children }) {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem("techmicra-theme");
        return saved || "light";
    });

    useEffect(() => {
        localStorage.setItem("techmicra-theme", mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
    };

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
