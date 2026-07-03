import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your server's IP if testing on a physical device.
// For local simulation, use localhost:5000
export const BASE_IP = '136.115.36.65';
const BASE_URL = `http://${BASE_IP}/api`;

console.log('🌐 API Base URL:', BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Interceptor to add JWT token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration and detailed logging
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (!error.response) {
            // This happens when there is a Network Error (e.g. blocked by Android Security)
            console.error('❌ Network Error: Could not reach the server. Possible causes: HTTP blocked by Android, Server Down, or No Internet.');
        } else if (error.response.status === 401 || error.response.status === 403) {
            console.warn('⚠️  Token Invalid/Expired - Clearing session');
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userData');

            const { authEvents } = require('./authEvents');
            authEvents.emitUnauthorized();
        }
        return Promise.reject(error);
    }
);

export default api;
