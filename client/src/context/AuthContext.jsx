import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Determine initial user from localStorage to prevent flash of unauthorized state on reload
    const getInitialUser = () => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            return null;
        }
    };

    const [user, setUser] = useState(getInitialUser());
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                api.defaults.headers.common['x-auth-token'] = token;
                try {
                    const res = await api.get('/auth/user');
                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data)); // Update cache
                } catch (err) {
                    console.error("Auth verification failed or timed out:", err.message);
                    // Only clear token if it's explicitly a 401 Unauthorized, not a network timeout from Render cold start
                    if (err.response && err.response.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setToken(null);
                        setUser(null);
                        delete api.defaults.headers.common['x-auth-token'];
                    }
                }
            } else {
                setUser(null); // Ensure user is null if no token exists
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(token);
        setUser(userData);
        api.defaults.headers.common['x-auth-token'] = token;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['x-auth-token'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
