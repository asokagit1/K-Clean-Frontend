import axios from 'axios';

const api = axios.create({
    // baseURL: `${import.meta.env.VITE_API_BASE_URL}/api` || 'http://localhost:8000/api', // Use env var with /api suffix
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`, // Use env var with /api suffix
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
