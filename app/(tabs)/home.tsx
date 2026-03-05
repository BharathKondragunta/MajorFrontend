import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Camera, Scan, CheckSquare, ChevronRight, FileImage, Video, FileText, Plus, FolderSync, ShieldCheck, User as UserIcon } from 'lucide-react-native';
import { router } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LogEvidenceModal } from '../../components/LogEvidenceModal';
import { NewCaseModal } from '../../components/NewCaseModal';
import { useAuth } from '../../context/AuthContext';
import { useCases } from '../../context/CaseContext';
import { useUser } from '../../context/UserContext';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
    const { colorScheme } = useColorScheme();
    const { logs, refreshData } = useCases();
    const { user } = useUser();
    const { loginLogs, fetchLoginLogs } = useAuth();
    const [isLogModalVisible, setIsLogModalVisible] = useState(false);
    const [isCaseModalVisible, setIsCaseModalVisible] = useState(false);

    useEffect(() => {
        refreshData();
        fetchLoginLogs(5);
    }, []);

    const iconColor = colorScheme === 'dark' ? '#f8fafc' : '#111827';
    const secondaryIconColor = colorScheme === 'dark' ? '#94a3b8' : '#64748b';

    const getLogIcon = (type: string, status: string) => {
        if (type === 'Case') return <FolderSync size={24} color={iconColor} />;
        if (type === 'Profile') return <UserIcon size={24} color="#a855f7" />;
        if (status === 'Secured') return <ShieldCheck size={24} color="#10b981" />;
        return <FileText size={24} color={iconColor} />;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Secured': return 'text-green-600';
            case 'Transferred': return 'text-blue-500';
            case 'In Review': return 'text-gray-500';
            case 'Created': return 'text-purple-500';
            case 'Updated': return 'text-purple-500';
            default: return 'text-gray-500';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true }).replace('about ', '');
        } catch (e) {
            return 'Just now';
        }
    };

    const getUserInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-black" edges={['top']}>
            <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-1 mr-4">
                        <Text className="text-secondary font-bold text-xs uppercase tracking-wider dark:text-gray-400">HashGuard Forensic</Text>
                        <Text className="text-2xl font-extrabold text-primary dark:text-white" numberOfLines={1}>{user.name}</Text>
                    </View>
                    <View className="w-10 h-10 bg-black dark:bg-white rounded-full items-center justify-center border border-gray-800 dark:border-gray-200">
                        <Text className="text-white dark:text-black font-bold">{getUserInitials(user.name)}</Text>
                    </View>
                </View>

                {/* KPI Cards */}
                <View className="flex-row justify-between mb-6 gap-3">
                    <Card className="flex-1 p-3 mb-0 min-h-[100px] justify-center">
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-1 dark:text-gray-400">Active Cases</Text>
                        <View className="flex-row items-end">
                            <Text className="text-2xl font-bold text-primary mr-2 dark:text-white">12</Text>
                            <Badge label="+2" variant="success" className="mb-1 py-0.5 px-1.5" />
                        </View>
                    </Card>

                    <Card className="flex-1 p-3 mb-0 min-h-[100px] justify-center">
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-1 dark:text-gray-400">Total Evidence</Text>
                        <View className="flex-row items-end">
                            <Text className="text-2xl font-bold text-primary mr-2 dark:text-white">148</Text>
                            <Badge label="-1" variant="error" className="mb-1 py-0.5 px-1.5" />
                        </View>
                    </Card>

                    <Card className="flex-1 p-3 mb-0 min-h-[100px] justify-center">
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-1 dark:text-gray-400">Integrity Score</Text>
                        <Text className="text-2xl font-bold text-primary dark:text-white">99.9%</Text>
                    </Card>
                </View>

                {/* Graph Card */}
                <Card className="mb-8 overflow-hidden" title="Evidence Logging Activity">
                    <View className="absolute right-4 top-4">
                        <Text className="text-secondary text-[10px] font-bold dark:text-gray-400">Last 7 Days</Text>
                    </View>
                    <View className="h-40 bg-gray-50 dark:bg-gray-800 rounded-xl mt-2 items-center justify-center relative overflow-hidden border border-gray-100 dark:border-gray-700">
                        {/* Simple CSS curve simulation */}
                        <View className="absolute bottom-0 left-0 right-0 h-24 bg-gray-100 dark:bg-gray-900 rounded-t-full opacity-50 scale-150 translate-y-4" />
                        <View className="absolute bottom-0 left-10 right-10 h-32 bg-gray-200 dark:bg-gray-800 rounded-t-full opacity-50 scale-125 translate-y-8" />
                        <View className="w-full flex-row justify-between items-end h-full px-4 pb-2 absolute bottom-0">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <View key={i} className="align-center items-center">
                                    <View className="w-2 h-2 bg-primary dark:bg-white rounded-full mb-1" style={{ marginBottom: 10 + Math.random() * 50 }} />
                                    <Text className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{d}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </Card>

                {/* Quick Actions */}
                <Text className="text-primary font-bold text-lg mb-4 dark:text-white">Quick Actions</Text>
                <View className="flex-row justify-between mb-8 gap-3">
                    <TouchableOpacity
                        className="flex-1 bg-white dark:bg-gray-900 p-4 rounded-xl flex-row items-center justify-center border border-gray-200 dark:border-gray-800 shadow-sm"
                        onPress={() => setIsLogModalVisible(true)}
                    >
                        <Camera size={20} color={iconColor} className="mr-2" />
                        <Text className="font-bold text-primary dark:text-white text-xs">Log New Evidence</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-1 bg-white dark:bg-gray-900 p-4 rounded-xl flex-row items-center justify-center border border-gray-200 dark:border-gray-800 shadow-sm">
                        <Scan size={20} color={iconColor} className="mr-2" />
                        <Text className="font-bold text-primary dark:text-white text-xs">Scan Tag</Text>
                    </TouchableOpacity>
                </View>

                {/* Login History Section */}
                <View className="flex-row justify-between items-center mb-4 mt-2">
                    <Text className="text-lg font-bold text-primary dark:text-white">Login History</Text>
                    <TouchableOpacity onPress={() => router.push('/login-history')}>
                        <Text className="text-accent font-bold text-sm">View More</Text>
                    </TouchableOpacity>
                </View>

                {loginLogs.slice(0, 5).map((log) => (
                    <View key={log._id} className="mb-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex-row items-center">
                        <View className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-lg items-center justify-center mr-3">
                            <ShieldCheck size={20} color={log.status === 'Success' ? '#10b981' : '#ef4444'} />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-primary dark:text-white text-sm">{log.email}</Text>
                            <Text className="text-secondary text-xs dark:text-gray-400">
                                {log.ip} • {log.device.length > 20 ? log.device.substring(0, 20) + '...' : log.device}
                            </Text>
                        </View>
                        <Text className="text-secondary text-[10px] dark:text-gray-400 font-bold">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                ))}

                {/* Recent Section */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-primary font-bold text-lg dark:text-white">Recent Custody Logs</Text>
                    <Text className="text-primary text-xs font-bold dark:text-white">View All</Text>
                </View>

                {/* List Items */}
                {logs.map((log) => (
                    <TouchableOpacity key={log.id} onPress={() => log.type === 'Evidence' && router.push('/evidence_tab')}>
                        <Card className="flex-row items-center p-3 mb-3">
                            <View className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg items-center justify-center mr-4">
                                {getLogIcon(log.type, log.status)}
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-primary dark:text-white mb-1" numberOfLines={1}>{log.target}</Text>
                                <View className="flex-row items-center">
                                    <Text className="text-secondary text-xs font-bold mr-2 dark:text-gray-400">{log.caseId}</Text>
                                    <Text className={`text-xs font-bold ${getStatusColor(log.status)}`}>• {log.status}</Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-secondary text-[10px] font-bold mb-1 dark:text-gray-400">{formatTimestamp(log.timestamp)}</Text>
                                <ChevronRight size={16} color="#cbd5e1" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}

                {logs.length === 0 && (
                    <View className="items-center py-10 opacity-50">
                        <FileText size={48} color={secondaryIconColor} />
                        <Text className="text-secondary font-bold mt-4 dark:text-gray-400">No recent activity</Text>
                    </View>
                )}

            </ScrollView>

            {/* Floating AB Component */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 bg-black dark:bg-white rounded-2xl px-6 py-4 flex-row items-center shadow-lg z-50"
                onPress={() => setIsCaseModalVisible(true)}
            >
                <Plus size={24} color={colorScheme === 'dark' ? 'black' : 'white'} className="mr-2" />
                <Text className="text-white dark:text-black font-bold">New Case</Text>
            </TouchableOpacity>
            <LogEvidenceModal
                visible={isLogModalVisible}
                onClose={() => setIsLogModalVisible(false)}
            />
            <NewCaseModal
                visible={isCaseModalVisible}
                onClose={() => setIsCaseModalVisible(false)}
            />
        </SafeAreaView>
    );
}
