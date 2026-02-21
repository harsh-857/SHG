import axios from 'axios';

console.log('API Base URL:', import.meta.env.VITE_API_URL || '/api');

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

console.log('Final API Request URL path will be:', (api.defaults.baseURL || '') + '/auth/register-user');

export default api;
