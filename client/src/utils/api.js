import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://shg-6s8l.onrender.com/api' || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
