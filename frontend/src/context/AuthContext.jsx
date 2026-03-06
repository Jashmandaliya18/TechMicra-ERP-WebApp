import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Axios default configuration
    axios.defaults.baseURL = "http://localhost:8000/api";
    axios.defaults.headers.common["Accept"] = "application/json";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get("/profile");
            const { user: userData, role: userRole, permissions: userPermissions } = response.data;
            setUser(userData);
            setRole(userRole);
            setPermissions(userPermissions || []);
        } catch (error) {
            console.error("Profile fetch failed", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await axios.post("/login", { email, password });
        const { token, user: userData, role: userRole, permissions: userPermissions } = response.data;

        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userData);
        setRole(userRole);
        setPermissions(userPermissions || []);
        return true;
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setRole(null);
        setPermissions([]);
    };

    const hasPermission = (permission) => {
        return permissions.includes(permission) || role === "Super Admin";
    };

    return (
        <AuthContext.Provider value={{ user, role, permissions, loading, login, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
