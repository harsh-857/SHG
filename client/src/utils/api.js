import axios from 'axios';

console.log('API Base URL:', import.meta.env.VITE_API_URL || '/api');

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
