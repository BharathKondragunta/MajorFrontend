import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Search, Filter, Archive, ArrowRight, FolderOpen, Clock, X, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useCases } from '../../context/CaseContext';
import { NewCaseModal } from '../../components/NewCaseModal';

export default function CaseList() {
    const { colorScheme } = useColorScheme();
    const { cases, addCase, toggleCaseStatus } = useCases();
    const [activeTab, setActiveTab] = useState('All Cases');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const iconColor = colorScheme === 'dark' ? '#f8fafc' : '#111827';
    const secondaryIconColor = colorScheme === 'dark' ? '#94a3b8' : '#64748b';

    const filteredCases = cases.filter(c => {
        if (activeTab === 'All Cases') return true;
        return c.status === activeTab;
    });

    const activeCount = cases.filter(c => c.status === 'Active').length;



    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-black" edges={['top']}>
            <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View className="mb-6">
                    <Text className="text-secondary font-bold text-xs uppercase tracking-wider mb-1 dark:text-gray-400">HASHGUARD</Text>
                    <View className="flex-row justify-between items-center">
                        <Text className="text-3xl font-extrabold text-primary dark:text-white">Forensic Case List</Text>
                        <TouchableOpacity className="bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-800">
                            <Search size={24} color={iconColor} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Row */}
                <View className="flex-row justify-between mb-8 gap-3">
                    <View className="flex-1 bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-1 dark:text-gray-400">Total Cases</Text>
                        <Text className="text-2xl font-bold text-primary dark:text-white">{cases.length}</Text>
                    </View>
                    <View className="flex-1 bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-1 dark:text-gray-400">Active</Text>
                        <Text className="text-2xl font-bold text-accent">{activeCount}</Text>
                    </View>
                    <View className="flex-1 bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-1 dark:text-gray-400">Integrity</Text>
                        <Text className="text-2xl font-bold text-success">100%</Text>
                    </View>
                </View>

                {/* Tabs / Filter */}
                <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-row gap-2">
                        {['All Cases', 'Active', 'Archived'].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg border ${activeTab === tab ? 'bg-primary dark:bg-white border-primary dark:border-white' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'}`}
                            >
                                <Text className={`text-xs font-bold ${activeTab === tab ? 'text-white dark:text-black' : 'text-primary dark:text-white'}`}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Filter size={20} color={secondaryIconColor} />
                </View>

                {/* Case List */}
                {filteredCases.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/cases/${item.caseId}`)}
                    >
                        <Card className="mb-4">
                            <View className="flex-row justify-between items-start mb-2">
                                <Text className="text-secondary text-xs font-bold dark:text-gray-400">{item.caseId}</Text>
                                <Badge
                                    label={item.status}
                                    variant={item.status === 'Active' ? 'info' : 'default'}
                                    className={item.status === 'Archived' ? 'bg-gray-800 text-white' : ''}
                                />
                            </View>

                            <Text className="text-lg font-bold text-primary dark:text-white mb-4 leading-6">{item.title}</Text>

                            <View className="flex-row justify-between mb-6">
                                <View>
                                    <Text className="text-secondary text-[10px] font-bold uppercase mb-1 dark:text-gray-400">EVIDENCE ITEMS</Text>
                                    <View className="flex-row items-center">
                                        <FolderOpen size={14} color={secondaryIconColor} className="mr-1" />
                                        <Text className="text-primary dark:text-white font-bold text-sm">{item.files} Files</Text>
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-secondary text-[10px] font-bold uppercase mb-1 dark:text-gray-400">LAST LOG</Text>
                                    <View className="flex-row items-center">
                                        <Clock size={14} color={secondaryIconColor} className="mr-1" />
                                        <Text className="text-primary dark:text-white font-bold text-sm">{item.logTime}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                                <View className="flex-row justify-between items-center w-full">
                                    <View className="flex-row">
                                        <TouchableOpacity
                                            className="mr-3 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded"
                                            onPress={() => toggleCaseStatus(item.caseId, item.status)}
                                        >
                                            <Text className="text-xs font-bold text-accent">
                                                {item.status === 'Active' ? 'Archive' : 'Activate'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Text className="text-secondary text-xs font-bold mr-2 uppercase dark:text-gray-400">Integrity Verified</Text>
                                        <ShieldCheck size={16} color="#10b981" />
                                    </View>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}

                <View className="h-24" />
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
                className="absolute bottom-6 right-6 bg-black dark:bg-white rounded-lg px-6 py-4 flex-row items-center shadow-lg"
            >
                <View className="mr-2"><Text className="text-white dark:text-black text-xl">+</Text></View>
                <Text className="text-white dark:text-black font-bold uppercase tracking-wider">New Case</Text>
            </TouchableOpacity>

            <NewCaseModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </SafeAreaView>
    );
}
