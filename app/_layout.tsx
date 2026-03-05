import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { View, StatusBar, ActivityIndicator } from 'react-native';
import { CaseProvider } from '../context/CaseContext';
import { UserProvider } from '../context/UserContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { useColorScheme } from 'nativewind';

function RootLayoutNav() {
    const { colorScheme } = useColorScheme();
    const { session, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!session && !inAuthGroup) {
            // Redirect to the sign-in page if user is not signed in
            router.replace('/(auth)/login');
        } else if (session && inAuthGroup) {
            // Redirect away from the sign-in page if user is signed in
            // Try /home first as expo-router often flattens groups
            router.replace('/home');
        }
    }, [session, isLoading, segments]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
                <ActivityIndicator size="large" color="#111827" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colorScheme === 'dark' ? '#000000' : '#f8fafc' } }}>
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="evidence/[id]" options={{ presentation: 'card', headerTitle: 'Evidence Details' }} />
            <Stack.Screen name="report" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    const { colorScheme } = useColorScheme();

    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    return (
        <AuthProvider>
            <UserProvider>
                <CaseProvider>
                    <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
                    <RootLayoutNav />
                </CaseProvider>
            </UserProvider>
        </AuthProvider>
    );
}
