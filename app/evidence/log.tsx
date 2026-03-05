import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, Eye, Download, Shield, FileText } from 'lucide-react-native';
import { router } from 'expo-router';
import { Card } from '../../components/ui/Card';

export default function CustodyLog() {
    const events = [
        { type: 'transfer', title: 'Custody Transfer', user: 'Det. Reynolds -> Agent Chen', time: 'Oct 26, 10:00', icon: <ArrowLeft size={16} color="#fff" /> },
        { type: 'view', title: 'Evidence Viewed', user: 'Agent Chen', time: 'Oct 26, 10:15', icon: <Eye size={16} color="#fff" /> },
        { type: 'log', title: 'Evidence Secured', user: 'Det. Reynolds', time: 'Oct 25, 16:30', icon: <Shield size={16} color="#fff" /> },
        { type: 'action', title: 'File Exported', user: 'Admin', time: 'Oct 25, 12:00', icon: <Download size={16} color="#fff" /> },
    ];

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="flex-row items-center px-6 py-4 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text className="font-bold text-lg text-primary">Full Audit Log</Text>
            </View>

            <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
                {events.map((e, i) => (
                    <View key={i} className="flex-row mb-6 relative">
                        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 z-10 ${e.type === 'transfer' ? 'bg-blue-500' : 'bg-gray-400'}`}>
                            {e.icon}
                        </View>
                        {i !== events.length - 1 && <View className="absolute top-10 left-5 w-[1px] bg-gray-200 h-full -z-10" />}

                        <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100">
                            <Text className="font-bold text-primary mb-1">{e.title}</Text>
                            <Text className="text-secondary text-xs mb-2">{e.user}</Text>
                            <View className="flex-row items-center">
                                <Clock size={12} color="#94a3b8" className="mr-1" />
                                <Text className="text-[10px] text-gray-400 font-bold">{e.time}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
