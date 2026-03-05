import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Search, FileText, HardDrive, Image as ImageIcon, FileCode, Filter, FolderOpen, X, MapPin, Hash, Clock, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useCases, Evidence } from '../../context/CaseContext';
import { LogEvidenceModal } from '../../components/LogEvidenceModal';

export default function EvidenceList() {
    const { colorScheme } = useColorScheme();
    const { cases, getAllEvidence, addEvidence } = useCases();
    const evidenceList = getAllEvidence();
    const [filterType, setFilterType] = useState('All');

    const iconColor = colorScheme === 'dark' ? '#f8fafc' : '#111827';
    const secondaryIconColor = colorScheme === 'dark' ? '#94a3b8' : '#64748b';

    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);

    const getIconForType = (type: string) => {
        switch (type) {
            case 'Document': return <FileText size={20} color={secondaryIconColor} />;
            case 'Disk Image': return <HardDrive size={20} color={secondaryIconColor} />;
            case 'Network': return <FileCode size={20} color={secondaryIconColor} />;
            case 'Image': return <ImageIcon size={20} color={secondaryIconColor} />;
            default: return <FileText size={20} color={secondaryIconColor} />;
        }
    };

    const filteredEvidence = evidenceList.filter(e => {
        if (filterType === 'All') return true;
        return e.type === filterType;
    });

    const types = ['All', ...new Set(evidenceList.map(e => e.type))];



    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-black" edges={['top']}>
            <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View className="mb-6">
                    <Text className="text-secondary font-bold text-xs uppercase tracking-wider mb-1 dark:text-gray-400">HASHGUARD</Text>
                    <View className="flex-row justify-between items-center">
                        <Text className="text-3xl font-extrabold text-primary dark:text-white">Evidence Vault</Text>
                        <TouchableOpacity className="bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-800">
                            <Search size={24} color={iconColor} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Filter Chips */}
                <View className="flex-row mb-6">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {types.map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setFilterType(type)}
                                className={`mr-2 px-4 py-2 rounded-lg border ${filterType === type ? 'bg-primary dark:bg-white border-primary dark:border-white' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'}`}
                            >
                                <Text className={`text-xs font-bold ${filterType === type ? 'text-white dark:text-black' : 'text-primary dark:text-white'}`}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Evidence List */}
                <View className="pb-24">
                    {filteredEvidence.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.9}
                            onPress={() => router.push(`/evidence/${item.evidenceId || (item as any)._id}`)}
                        >
                            <Card className="mb-3 p-4 flex-row items-center">
                                <View className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl items-center justify-center mr-4 border border-gray-100 dark:border-gray-800">
                                    {getIconForType(item.type)}
                                </View>

                                <View className="flex-1">
                                    <Text className="text-secondary text-[10px] font-bold uppercase mb-0.5 dark:text-gray-400">
                                        {item.evidenceId || 'LEGACY-ID'} • {item.caseId}
                                    </Text>
                                    <Text className="text-primary font-bold text-base mb-1 dark:text-white">{item.title}</Text>
                                    <View className="flex-row items-center">
                                        <Badge label={item.type} variant="default" className="mr-2 text-[10px] px-1.5 py-0.5" />
                                        <Text className="text-secondary text-xs dark:text-gray-400">{item.size} • {item.date}</Text>
                                    </View>
                                </View>

                                <View className="bg-green-500 w-2 h-2 rounded-full" />
                            </Card>
                        </TouchableOpacity>
                    ))}

                    {filteredEvidence.length === 0 && (
                        <View className="items-center py-10 opacity-50">
                            <FolderOpen size={48} color={secondaryIconColor} />
                            <Text className="text-secondary font-bold mt-4 dark:text-gray-400">No evidence found</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Log Evidence FAB */}
            <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
                className="absolute bottom-6 right-6 bg-black dark:bg-white rounded-lg px-6 py-4 flex-row items-center shadow-lg"
            >
                <Plus size={24} color={colorScheme === 'dark' ? 'black' : 'white'} className="mr-2" />
                <Text className="text-white dark:text-black font-bold uppercase tracking-wider">Log Evidence</Text>
            </TouchableOpacity>

            <LogEvidenceModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </SafeAreaView>
    );
}
