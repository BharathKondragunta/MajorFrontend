import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, FileText, FileBarChart, Image as ImageIcon } from 'lucide-react-native';
import { router } from 'expo-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function ReportModal() {
    const [includeLogs, setIncludeLogs] = useState(true);
    const [includeHash, setIncludeHash] = useState(true);
    const [includeMeta, setIncludeMeta] = useState(true);
    const [includeNotes, setIncludeNotes] = useState(false);
    const [selectedType, setSelectedType] = useState('Full Audit');

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-6 pt-4">

                {/* Header */}
                <View className="flex-row justify-between items-start mb-8">
                    <View>
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-1">REPORT GENERATOR</Text>
                        <Text className="text-2xl font-extrabold text-primary">Export Legal Trail</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.back()} className="p-2 border border-gray-200 rounded-lg">
                        <X size={20} color="#111827" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* Select Report Type */}
                    <Text className="text-secondary font-bold text-sm mb-4">Select Report Type</Text>
                    <View className="flex-row gap-3 mb-8">
                        {[
                            { icon: <FileText size={24} color="#111827" />, label: 'Full Audit' },
                            { icon: <FileBarChart size={24} color="#64748b" />, label: 'Summary' },
                            { icon: <ImageIcon size={24} color="#64748b" />, label: 'Evidence Only' }
                        ].map((item) => (
                            <TouchableOpacity
                                key={item.label}
                                onPress={() => setSelectedType(item.label)}
                                className={`flex-1 p-4 rounded-xl border items-center justify-center h-28 ${selectedType === item.label ? 'border-primary bg-white' : 'border-gray-100 bg-gray-50'}`}
                            >
                                <View className="mb-3">{item.icon}</View>
                                <Text className={`text-xs font-bold text-center ${selectedType === item.label ? 'text-primary' : 'text-secondary'}`}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Report Parameters */}
                    <Card className="mb-8">
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-4 border-b border-gray-100 pb-2">REPORT PARAMETERS</Text>

                        <View className="mb-6">
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-primary font-medium">Chain of Custody Logs</Text>
                                <Switch
                                    value={includeLogs}
                                    onValueChange={setIncludeLogs}
                                    trackColor={{ false: '#e2e8f0', true: '#22c55e' }}
                                    thumbColor={'#fff'}
                                />
                            </View>
                            <Text className="text-secondary text-xs">Include every hand-off and signature</Text>
                        </View>

                        <View className="mb-6">
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-primary font-medium">Hash Verification</Text>
                                <Switch
                                    value={includeHash}
                                    onValueChange={setIncludeHash}
                                    trackColor={{ false: '#e2e8f0', true: '#22c55e' }}
                                />
                            </View>
                            <Text className="text-secondary text-xs">SHA-256 Integrity check results</Text>
                        </View>

                        <View className="mb-6">
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-primary font-medium">Metadata Details</Text>
                                <Switch
                                    value={includeMeta}
                                    onValueChange={setIncludeMeta}
                                    trackColor={{ false: '#e2e8f0', true: '#22c55e' }}
                                />
                            </View>
                            <Text className="text-secondary text-xs">EXIF, timestamps, and GPS coordinates</Text>
                        </View>

                        <View className="mb-2">
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-primary font-medium">Investigator Notes</Text>
                                <Switch
                                    value={includeNotes}
                                    onValueChange={setIncludeNotes}
                                    trackColor={{ false: '#e2e8f0', true: '#22c55e' }}
                                />
                            </View>
                            <Text className="text-secondary text-xs">Private field observations</Text>
                        </View>
                    </Card>

                    {/* Evidence Distribution */}
                    <Text className="text-secondary font-bold text-sm mb-4">Evidence Distribution</Text>
                    <Card className="h-48 justify-center items-center mb-8">
                        {/* Mock Bar Chart */}
                        <View className="flex-row items-end h-32 w-full justify-between px-8">
                            {[
                                { label: 'Img', h: 'h-28' },
                                { label: 'Vid', h: 'h-20' },
                                { label: 'Doc', h: 'h-14' },
                                { label: 'Aud', h: 'h-10' }
                            ].map((bar) => (
                                <View key={bar.label} className="items-center">
                                    <View className={`w-12 bg-black rounded-sm mb-2 ${bar.h}`} />
                                    <Text className="text-[10px] font-bold text-secondary uppercase">{bar.label}</Text>
                                </View>
                            ))}
                        </View>
                    </Card>

                    <Button label="GENERATE REPORT (PDF)" onPress={() => router.back()} className="mb-8" />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
