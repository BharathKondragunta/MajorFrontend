import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '../utils/api';
import { authEvents } from '../utils/authEvents';

interface AuthContextType {
    session: string | null;
    user: any | null;
    isLoading: boolean;
    signIn: (email: string, key: string) => Promise<void>;
    signOut: () => void;
    loginLogs: LoginLog[];
    fetchLoginLogs: (limit?: number) => Promise<void>;
}

export interface LoginLog {
    _id: string;
    userId: string;
    email: string;
    ip: string;
    device: string;
    status: string;
    timestamp: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);

    useEffect(() => {
        // Check for existing token on mount
        const checkToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                const userData = await SecureStore.getItemAsync('userData');
                if (token && userData) {
                    setSession(token);
                    setUser(JSON.parse(userData));
                }
            } catch (e) {
                console.error('Failed to load token', e);
            } finally {
                setIsLoading(false);
            }
        };
        checkToken();
    }, []);

    useEffect(() => {
        // Listen for unauthorized events from the API
        const unsubscribe = authEvents.subscribe(() => {
            console.warn('🚨 AuthContext: Unauthorized access detected, clearing session');
            setSession(null);
            setUser(null);
        });
        return unsubscribe;
    }, []);

    const signIn = async (email: string, key: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: email.trim(),
                password: key.trim(),
            });

            const { token, user: userData } = response.data;

            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userData', JSON.stringify(userData));

            setSession(token);
            setUser(userData);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Authentication Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        setSession(null);
        setUser(null);
        router.replace('/(auth)/login');
        router.replace('/(auth)/login');
    };

    const fetchLoginLogs = async (limit = 20) => {
        try {
            const response = await api.get(`/auth/login-logs?limit=${limit}`);
            if (response.data.success) {
                setLoginLogs(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch login logs', error);
        }
    };

    return (
        <AuthContext.Provider value={{ session, user, isLoading, signIn, signOut, loginLogs, fetchLoginLogs }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
