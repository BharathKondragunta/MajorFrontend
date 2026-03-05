import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your server's IP if testing on a physical device. r
// For local simulation, use localhost:5000
export const BASE_IP = '136.115.36.65';
const BASE_URL = `http://${BASE_IP}/api`;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            console.log('🔐 Attaching Token:', token.substring(0, 10) + '...');
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('⚠️  No Auth Token found in SecureStore - Request will likely fail 403');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
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
