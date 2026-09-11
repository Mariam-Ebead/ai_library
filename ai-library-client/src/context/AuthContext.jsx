import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await api.get("/me");
                    setUser(res.data.user);
                } catch {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post("/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } finally {
            localStorage.removeItem("token");
            setUser(null);
        }
    };

    const isAdmin = Boolean(
        user?.roles?.some((r) =>
            typeof r === "string" ? r === "admin" : r.name === "admin",
        ),
    );

    return (
        <AuthContext.Provider
            value={{ user, setUser, login, logout, isAdmin, loading }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
