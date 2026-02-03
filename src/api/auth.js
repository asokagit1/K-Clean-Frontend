import api from './axios';

export const login = async (email, password) => {
    // CSRF protection for Laravel Sanctum if needed (usually for SPA on same domain, but good validation)
    // await api.get('/sanctum/csrf-cookie'); 
    const response = await api.post('/login', { email, password });
    return response.data;
};

export const register = async (data) => {
    const response = await api.post('/register', data);
    return response.data;
};

export const logout = async () => {
    await api.post('/logout');
};

export const resendVerification = async () => {
    await api.post('/email/verification-notification');
};

export const getUser = async () => {
    return await api.get('/user'); // Assuming there's a user endpoint or we use the data from login
};
