import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const verifyToken = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get('/api/v1/auth/verify', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setUser(response.data.data.user);
                } else {
                    setUser(null);
                    localStorage.removeItem('token');
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Verification failed", error);
            setUser(null);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/v1/auth/login', { email, password });
            if (response.data.success) {
                setUser(response.data.data.user);
                localStorage.setItem('token', response.data.data.token);
                return { success: true, role: response.data.data.user.role };
            }
            return { success: false, message: 'Login failed' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
