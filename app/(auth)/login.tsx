import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Lock, Briefcase, Fingerprint, ShieldCheck, ChevronRight } from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useCases } from '../../context/CaseContext';

export default function LoginScreen() {
    const { signIn, isLoading } = useAuth();
    const { addLog } = useCases();
    const [investigatorId, setInvestigatorId] = useState('');
    const [accessKey, setAccessKey] = useState('');

    const handleLogin = async () => {
        if (!investigatorId.trim() || !accessKey.trim()) {
            Alert.alert('Error', 'Please enter your Investigator ID and Access Key.');
            return;
        }

        try {
            await signIn(investigatorId.trim(), accessKey.trim());
            addLog('User Authenticated', investigatorId.trim(), 'Profile', 'Updated');
        } catch (error: any) {
            Alert.alert('Authentication Failed', error.message || 'Check your credentials and try again.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="flex-1 px-8 justify-center">

                {/* Header / Logo Section */}
                <View className="items-center mb-12">
                    <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center mb-6 shadow-lg">
                        <ShieldCheck size={40} color="white" />
                    </View>
                    <Text className="text-3xl font-extrabold text-primary tracking-tight">HASHGUARD</Text>
                    <Text className="text-accent font-bold tracking-widest text-xs mt-1">FORENSIC LOGGING SYSTEM</Text>
                </View>

                {/* Title */}
                <View className="mb-8">
                    <Text className="text-2xl font-bold text-primary">Secure Access</Text>
                    <Text className="text-secondary mt-1">Authorized Personnel Only</Text>
                </View>

                {/* Form */}
                <View>
                    <Input
                        label="Email Address"
                        placeholder="officer@hashguard.agency"
                        icon={<Briefcase size={20} color="#94a3b8" />}
                        value={investigatorId} // Keep state name or change to email
                        onChangeText={setInvestigatorId}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Input
                        label="Access Key"
                        placeholder="••••••••"
                        secureTextEntry
                        icon={<Lock size={20} color="#94a3b8" />}
                        value={accessKey}
                        onChangeText={setAccessKey}
                    />

                    <View className="flex-row justify-between items-center mb-8">
                        <TouchableOpacity className="flex-row items-center">
                            <View className="w-5 h-5 border border-gray-300 rounded mr-2" />
                            <Text className="text-secondary text-sm">Remember device</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text className="text-primary font-bold text-sm">Reset Access</Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                        label="AUTHENTICATE"
                        onPress={handleLogin}
                        isLoading={isLoading}
                        icon={<ShieldCheck size={20} color="white" />}
                    />

                    <TouchableOpacity
                        className="mt-4 flex-row items-center justify-between border border-gray-200 rounded-xl p-4 active:bg-gray-50 bg-white"
                        onPress={handleLogin}
                    >
                        <View className="flex-row items-center">
                            <View className="mr-4">
                                <Fingerprint size={32} color="#111827" />
                            </View>
                            <View>
                                <Text className="font-bold text-primary">Biometric Login</Text>
                                <Text className="text-secondary text-xs">Use Touch ID or Face ID</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="mt-12 bg-primary p-4 rounded-xl">
                    <View className="flex-row items-center mb-2">
                        <ShieldCheck size={16} color="#22c55e" className="mr-2" />
                        <Text className="text-green-500 font-bold text-xs">End-to-End Encrypted Session</Text>
                    </View>
                    <Text className="text-gray-400 text-xs leading-4">
                        All login attempts are logged with GPS coordinates and timestamped for chain-of-custody integrity.
                    </Text>
                </View>

                <Text className="text-center text-gray-300 text-[10px] mt-6 font-bold">
                    v2.4.0-STABLE | NODE: FSC-09
                </Text>
            </View>
        </SafeAreaView>
    );
}
