import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { sendLocalNotification } from '../../utils/notifications';
import {
    User,
    Bell,
    Moon,
    Shield,
    Smartphone,
    Lock,
    Info,
    ChevronRight,
    LogOut,
    HelpCircle,
    Edit
} from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { useCases } from '../../context/CaseContext';
import { EditProfileModal } from '../../components/EditProfileModal';

export default function SettingsScreen() {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const { user } = useUser();
    const { signOut } = useAuth();
    const { addLog } = useCases();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [biometricsEnabled, setBiometricsEnabled] = useState(true);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const iconColor = colorScheme === 'dark' ? '#f8fafc' : '#111827';
    const secondaryIconColor = colorScheme === 'dark' ? '#94a3b8' : '#64748b';

    const handleDarkModeToggle = (value: boolean) => {
        toggleColorScheme();
        const status = value ? 'Enabled' : 'Disabled';
        sendLocalNotification('Theme Updated', `Dark Mode has been ${status}.`);
    };

    const darkModeEnabled = colorScheme === 'dark';

    const SettingItem = ({
        icon: Icon,
        label,
        value,
        onValueChange,
        type = 'toggle',
        destructive = false
    }: {
        icon: any,
        label: string,
        value?: boolean | string,
        onValueChange?: (val: boolean) => void,
        type?: 'toggle' | 'link' | 'info',
        destructive?: boolean
    }) => (
        <View className="flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <View className="flex-row items-center">
                <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${destructive ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                    <Icon size={18} color={destructive ? '#ef4444' : iconColor} />
                </View>
                <Text className={`text-base font-medium ${destructive ? 'text-red-500' : 'text-primary dark:text-white'}`}>{label}</Text>
            </View>

            {type === 'toggle' && (
                <Switch
                    trackColor={{ false: '#e2e8f0', true: colorScheme === 'dark' ? '#ffffff' : '#111827' }}
                    thumbColor={colorScheme === 'dark' ? '#111827' : '#ffffff'}
                    ios_backgroundColor="#e2e8f0"
                    onValueChange={onValueChange}
                    value={value as boolean}
                />
            )}

            {type === 'link' && (
                <ChevronRight size={20} color={secondaryIconColor} />
            )}

            {type === 'info' && (
                <Text className="text-secondary dark:text-gray-400 text-sm">{value as string}</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-black" edges={['top']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View className="px-6 py-4 mb-2">
                    <Text className="text-3xl font-extrabold text-primary dark:text-white">Settings</Text>
                </View>

                {/* Profile Section */}
                <View className="px-6 mb-8">
                    <Card className="flex-row items-center p-4">
                        <View className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
                            <Image
                                source={{ uri: user.avatar }}
                                className="w-full h-full"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-primary dark:text-white" numberOfLines={1}>{user.name}</Text>
                            <Text className="text-secondary dark:text-gray-400 text-sm" numberOfLines={1}>{user.email}</Text>
                            <View className="flex-row items-center mt-1">
                                <Shield size={12} color="#16a34a" className="mr-1" />
                                <Text className="text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">{user.clearance}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full"
                            onPress={() => setIsEditModalVisible(true)}
                        >
                            <Edit size={20} color={iconColor} />
                        </TouchableOpacity>
                    </Card>
                </View>

                {/* Preferences */}
                <View className="px-6 mb-6">
                    <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase tracking-wider mb-3 ml-1">App Preferences</Text>
                    <Card className="py-1 px-4">
                        <SettingItem
                            icon={Bell}
                            label="Push Notifications"
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                        />
                        <SettingItem
                            icon={Moon}
                            label="Dark Mode"
                            value={darkModeEnabled}
                            onValueChange={handleDarkModeToggle}
                        />
                    </Card>
                </View>

                {/* Security */}
                <View className="px-6 mb-6">
                    <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase tracking-wider mb-3 ml-1">Security</Text>
                    <Card className="py-1 px-4">
                        <SettingItem
                            icon={Smartphone}
                            label="Biometric Login"
                            value={biometricsEnabled}
                            onValueChange={setBiometricsEnabled}
                        />
                        <SettingItem
                            icon={Lock}
                            label="Change PIN"
                            type="link"
                        />
                        <SettingItem
                            icon={Shield}
                            label="2FA Settings"
                            type="link"
                        />
                    </Card>
                </View>

                {/* About */}
                <View className="px-6 mb-8">
                    <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase tracking-wider mb-3 ml-1">Support & Info</Text>
                    <Card className="py-1 px-4">
                        <SettingItem
                            icon={HelpCircle}
                            label="Help Center"
                            type="link"
                        />
                        <SettingItem
                            icon={Info}
                            label="Version"
                            value="1.0.0 (Build 142)"
                            type="info"
                        />
                        <TouchableOpacity
                            className="flex-row items-center justify-between py-4"
                            onPress={() => {
                                addLog('User Logged Out', user.name, 'Profile', 'Updated');
                                signOut();
                            }}
                        >
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-lg items-center justify-center mr-3 bg-red-50 dark:bg-red-900/20">
                                    <LogOut size={18} color="#ef4444" />
                                </View>
                                <Text className="text-base font-medium text-red-500">Log Out</Text>
                            </View>
                            <ChevronRight size={20} color={secondaryIconColor} />
                        </TouchableOpacity>
                    </Card>
                </View>

                <View className="items-center mb-8">
                    <Text className="text-gray-300 dark:text-gray-600 text-xs text-center">
                        HashGuard Forensic Systems{'\n'}
                        © 2026 Secure Evidence Corp
                    </Text>
                </View>

            </ScrollView>
            <EditProfileModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
            />
        </SafeAreaView>
    );
}
