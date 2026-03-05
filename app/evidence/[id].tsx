import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, Share2, Shield, Info, Clock, CheckCircle2 } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { useCases, Evidence, LogEntry } from '../../context/CaseContext';
import { BASE_IP } from '../../utils/api';

const { width } = Dimensions.get('window');

export default function EvidenceDetails() {
    const { id } = useLocalSearchParams();
    const { colorScheme } = useColorScheme();
    const { getEvidenceById, logs } = useCases();
    const [evidence, setEvidence] = useState<Evidence | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const iconColor = colorScheme === 'dark' ? '#f8fafc' : '#111827';
    const secondaryIconColor = colorScheme === 'dark' ? '#94a3b8' : '#64748b';

    useEffect(() => {
        const fetchDetails = async () => {
            if (id) {
                const data = await getEvidenceById(id as string);
                setEvidence(data);
            }
            setIsLoading(false);
        };
        fetchDetails();
    }, [id]);

    const evidenceLogs = logs.filter(log => log.target === (evidence?.title || ''));

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#111827" />
            </View>
        );
    }

    if (!evidence) {
        return (
            <SafeAreaView className="flex-1 bg-background" edges={['top']}>
                <View className="flex-row items-center px-6 py-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <ArrowLeft size={24} color={iconColor} />
                    </TouchableOpacity>
                    <Text className="ml-4 font-bold text-lg dark:text-white">Evidence Not Found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-black" edges={['top']}>
            <View className="flex-row justify-between items-center px-6 py-4 bg-background dark:bg-black">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={iconColor} />
                </TouchableOpacity>
                <Text className="font-bold text-lg text-primary dark:text-white uppercase">EVIDENCE_ID: {evidence.evidenceId}</Text>
                <TouchableOpacity onPress={() => { }}>
                    <Share2 size={24} color={iconColor} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="h-64 bg-gray-900 mx-6 rounded-2xl overflow-hidden relative mb-6">
                    {evidence.filePath ? (
                        <Image
                            source={{ uri: `http://${BASE_IP}${evidence.filePath}` }}
                            className="w-full h-full opacity-60"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-full items-center justify-center bg-gray-800">
                            <Shield size={48} color="#4b5563" />
                        </View>
                    )}
                    <View className="absolute bottom-4 left-4 right-4">
                        <Text className="text-white text-2xl font-bold mb-1">{evidence.title}</Text>
                        <Text className="text-green-400 text-xs font-mono mb-2">SHA-256: {evidence.hashSHA256?.substring(0, 16)}...</Text>
                        <View className="self-end absolute bottom-2 right-0 border border-green-500 rounded px-2 py-1 bg-green-500/20">
                            <Text className="text-green-400 text-[10px] font-bold uppercase tracking-wider">SECURED</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row gap-3 px-6 mb-8">
                    <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100">
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-1">SIZE</Text>
                        <Text className="text-lg font-bold text-primary">{evidence.size || 'N/A'}</Text>
                    </View>
                    <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100">
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-1">TYPE</Text>
                        <Text className="text-lg font-bold text-primary">{evidence.type}</Text>
                    </View>
                    <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100">
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-1">LOCATION</Text>
                        <Text className="text-lg font-bold text-primary">{evidence.location || 'Unknown'}</Text>
                    </View>
                </View>

                <View className="px-6 mb-8">
                    <View className="flex-row items-center mb-4">
                        <Info size={18} color={iconColor} className="mr-2" />
                        <Text className="text-sm font-bold text-primary dark:text-gray-300 uppercase tracking-wider">SYSTEM_METADATA</Text>
                    </View>

                    <Card className="p-0 overflow-hidden">
                        {[
                            { label: 'Created', value: new Date(evidence.date || Date.now()).toLocaleString() },
                            { label: 'Current Custodian', value: evidence.currentCustodian?.username || 'N/A', valueBold: true },
                            { label: 'Original Owner', value: evidence.uploadedBy?.username || 'N/A', valueBold: true },
                            { label: 'Case Reference', value: evidence.caseId, valueBold: true },
                            { label: 'Forensic Hash', value: evidence.hashSHA256 || 'N/A' },
                        ].map((row, i) => (
                            <View key={i} className={`flex-row justify-between p-4 ${i !== 4 ? 'border-b border-gray-100' : ''}`}>
                                <Text className="text-secondary text-sm font-medium">{row.label}</Text>
                                <View className="flex-1 items-end ml-4">
                                    <Text className={`text-primary text-[13px] ${row.valueBold ? 'font-bold' : ''}`} numberOfLines={2}>
                                        {row.value}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </Card>
                </View>

                <View className="px-6 mb-12">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <Clock size={18} color={iconColor} className="mr-2" />
                            <Text className="text-sm font-bold text-primary dark:text-gray-300 uppercase tracking-wider">CHAIN_OF_CUSTODY</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push({
                                pathname: '/evidence/transfer',
                                params: { id: evidence.evidenceId, title: evidence.title }
                            })}
                            className="bg-black px-3 py-1.5 rounded-lg flex-row items-center"
                        >
                            <Text className="text-white text-[10px] font-bold mr-1">TRANSFER</Text>
                            <View className="w-1 h-1 bg-green-500 rounded-full" />
                        </TouchableOpacity>
                    </View>

                    <Card className="p-6">
                        {evidenceLogs.length > 0 ? (
                            evidenceLogs.map((log, index) => (
                                <View key={log.id} className={`flex-row relative ${index !== evidenceLogs.length - 1 ? 'pb-8' : ''}`}>
                                    <View className="w-8 flex-col items-center mr-4">
                                        <View className={`w-3 h-3 rounded-sm z-10 ${index === 0 ? 'bg-black' : 'bg-white border border-gray-200'}`} />
                                        {index !== evidenceLogs.length - 1 && (
                                            <View className="w-[1px] bg-gray-200 flex-1 absolute top-3 bottom-[-10]" />
                                        )}
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-secondary text-xs mb-1">{new Date(log.timestamp).toLocaleString()}</Text>
                                        <Text className="text-primary font-bold text-base mb-1">{log.action}</Text>
                                        <Text className="text-secondary text-sm">{log.performedBy?.username || 'Unknown'}</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text className="text-secondary text-sm italic">No custody history found.</Text>
                        )}
                    </Card>
                </View>
            </ScrollView >
        </SafeAreaView >
    );
}
