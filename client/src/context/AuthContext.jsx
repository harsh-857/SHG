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
                    try {
                        // Omit profilePicture from local cache to prevent 5MB QuotaExceededError crashes
                        const cacheUser = { ...res.data };
                        delete cacheUser.profilePicture;
                        localStorage.setItem('user', JSON.stringify(cacheUser)); // Update cache
                    } catch (storageError) {
                        console.warn("Could not cache user in localStorage (Quota exceeded):", storageError);
                    }
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
        try {
            localStorage.setItem('token', token);
            // Omit profilePicture from local cache
            const cacheUser = { ...userData };
            delete cacheUser.profilePicture;
            localStorage.setItem('user', JSON.stringify(cacheUser));
        } catch (storageError) {
            console.warn("Could not store to localStorage during login:", storageError);
        }
        setToken(token);
        setUser(userData);
        api.defaults.headers.common['x-auth-token'] = token;
    };

    const logout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (e) {}
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
