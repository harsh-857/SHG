import axios from 'axios';

// During development, Vite proxy handles '/api'
// In production on Vercel, 'vercel.json' handles '/api'
// Alternatively, VITE_API_URL can be set to the full backend URL
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the token in headers if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default api;
