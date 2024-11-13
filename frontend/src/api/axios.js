import axios from 'axios';

export const instance = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,  // Important for sending cookies
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor to attach token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);