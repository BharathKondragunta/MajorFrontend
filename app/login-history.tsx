import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, Monitor, Smartphone, CheckCircle, XCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { formatDistanceToNow } from 'date-fns';

export default function LoginHistoryScreen() {
    const { colorScheme } = useColorScheme();
    const { loginLogs, fetchLoginLogs } = useAuth();
    const iconColor = colorScheme === 'dark' ? '#f8fafc' : '#111827';
    const secondaryIconColor = colorScheme === 'dark' ? '#94a3b8' : '#64748b';

    useEffect(() => {
        fetchLoginLogs(50); // Fetch more logs for detailed view
    }, []);

    const formatTimestamp = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
        } catch (e) {
            return 'Unknown time';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-black" edges={['top']}>
            <View className="px-6 py-4 flex-row items-center border-b border-gray-100 dark:border-gray-800">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color={iconColor} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-primary dark:text-white">Login History</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
                {loginLogs.map((log) => (
                    <Card key={log._id} className="mb-3 p-3 flex-row items-center">
                        <View className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg items-center justify-center mr-3">
                            {log.device.includes('Mobile') ? (
                                <Smartphone size={18} color={secondaryIconColor} />
                            ) : (
                                <Monitor size={18} color={secondaryIconColor} />
                            )}
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-primary dark:text-white text-sm">{log.email}</Text>
                            <Text className="text-secondary text-xs dark:text-gray-400">{log.ip} • {log.device}</Text>
                        </View>
                        <View className="items-end">
                            <View className="flex-row items-center mb-1">
                                {log.status === 'Success' ? (
                                    <CheckCircle size={12} color="#10b981" className="mr-1" />
                                ) : (
                                    <XCircle size={12} color="#ef4444" className="mr-1" />
                                )}
                                <Text className={`text-xs font-bold ${log.status === 'Success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {log.status}
                                </Text>
                            </View>
                            <Text className="text-secondary text-[10px] dark:text-gray-400">{formatTimestamp(log.timestamp)}</Text>
                        </View>
                    </Card>
                ))}
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
