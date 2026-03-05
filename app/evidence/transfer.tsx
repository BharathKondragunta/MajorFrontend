import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, ArrowRightLeft, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCases } from '../../context/CaseContext';
import { useAuth } from '../../context/AuthContext';

export default function FieldTransfer() {
    const { id, title } = useLocalSearchParams();
    const { fetchUsers, transferEvidence } = useCases();
    const { user: currentUser } = useAuth();

    const [users, setUsers] = useState<any[]>([]);
    const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(null);
    const [reason, setReason] = useState('');
    const [location, setLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            const data = await fetchUsers();
            // Filter out current user from the list
            setUsers(data.filter(u => u._id !== currentUser?.id));
            setIsLoadingUsers(false);
        };
        loadUsers();
    }, []);

    const handleTransfer = async () => {
        if (!selectedReceiverId || !reason || !location) {
            Alert.alert('Missing Information', 'Please select a receiver and provide reason and location.');
            return;
        }

        setIsSubmitting(true);
        try {
            await transferEvidence(id as string, selectedReceiverId, reason, location);
            Alert.alert('Success', 'Chain of Custody has been updated successfully.', [
                { text: 'OK', onPress: () => router.push('/evidence_tab') }
            ]);
        } catch (error: any) {
            Alert.alert('Transfer Failed', error.message || 'An error occurred during transfer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="flex-row items-center px-6 py-4 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <View>
                    <Text className="font-bold text-lg text-primary">Custody Transfer</Text>
                    <Text className="text-[10px] text-secondary font-bold uppercase">SECURE HANDOVER PROTOCOL</Text>
                </View>
            </View>

            <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
                <Card className="mb-6 bg-blue-50 border-blue-100">
                    <Text className="text-secondary text-[10px] font-bold uppercase mb-1">EVIDENCE REFERENCE</Text>
                    <Text className="text-lg font-bold text-primary mb-1">{id}</Text>
                    <Text className="text-xs text-blue-600 font-bold">{title}</Text>
                </Card>

                <View className="flex-row items-center justify-between mb-8 px-4">
                    <View className="items-center">
                        <View className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-full items-center justify-center mb-2">
                            <User size={32} color="#64748b" />
                        </View>
                        <Text className="font-bold text-primary text-xs" numberOfLines={1}>{currentUser?.username || 'You'}</Text>
                        <Text className="text-[10px] text-secondary uppercase font-bold">Transferor</Text>
                    </View>

                    <View className="items-center justify-center pb-6">
                        <ArrowRightLeft size={24} color="#94a3b8" />
                    </View>

                    <View className="items-center">
                        <View className={`w-16 h-16 rounded-full items-center justify-center mb-2 border-2 ${selectedReceiverId ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-dashed border-blue-300'}`}>
                            {selectedReceiverId ? (
                                <CheckCircle2 size={32} color="#22c55e" />
                            ) : (
                                <User size={32} color="#3b82f6" />
                            )}
                        </View>
                        <Text className="font-bold text-primary text-xs" numberOfLines={1}>
                            {selectedReceiverId ? users.find(u => u._id === selectedReceiverId)?.username : 'Select Receiver'}
                        </Text>
                        <Text className="text-[10px] text-secondary uppercase font-bold">Receiver</Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-secondary text-[10px] font-bold uppercase mb-3">SELECT AUTHORIZED RECEIVER</Text>
                    {isLoadingUsers ? (
                        <ActivityIndicator color="#111827" />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pb-2">
                            {users.map(u => (
                                <TouchableOpacity
                                    key={u._id}
                                    onPress={() => setSelectedReceiverId(u._id)}
                                    className={`mr-3 p-3 rounded-xl border w-28 items-center ${selectedReceiverId === u._id ? 'bg-primary border-primary' : 'bg-white border-gray-100'}`}
                                >
                                    <View className={`w-10 h-10 rounded-full items-center justify-center mb-2 ${selectedReceiverId === u._id ? 'bg-white/20' : 'bg-gray-100'}`}>
                                        <User size={20} color={selectedReceiverId === u._id ? '#fff' : '#64748b'} />
                                    </View>
                                    <Text className={`font-bold text-[10px] text-center mb-0.5 ${selectedReceiverId === u._id ? 'text-white' : 'text-primary'}`} numberOfLines={1}>{u.username}</Text>
                                    <Text className={`text-[8px] uppercase font-bold ${selectedReceiverId === u._id ? 'text-gray-400' : 'text-secondary'}`}>{u.clearance}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <Input
                    label="Transfer Reason"
                    placeholder="e.g. Transport to Lab for Analysis"
                    value={reason}
                    onChangeText={setReason}
                />

                <Input
                    label="Handover Location"
                    placeholder="e.g. Forensic Lab Intake"
                    value={location}
                    onChangeText={setLocation}
                />

                <View className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-8 mt-4">
                    <View className="flex-row">
                        <ShieldCheck size={20} color="#eab308" className="mr-2" />
                        <Text className="font-bold text-yellow-800 text-sm">Chain of Custody Alert</Text>
                    </View>
                    <Text className="text-yellow-700 text-[10px] mt-1">This action will be permanently logged in the distributed ledger. Verify the receiver's identity before completing handover.</Text>
                </View>

                <Button
                    label="Authorize Transfer"
                    onPress={handleTransfer}
                    isLoading={isSubmitting}
                    disabled={!selectedReceiverId}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
