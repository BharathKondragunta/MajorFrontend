import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, FolderOpen, ShieldCheck, Clock, FileText, ChevronRight } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useCases, Case, Evidence } from '../../context/CaseContext';

export default function CaseDetails() {
    const { id } = useLocalSearchParams();
    const { colorScheme } = useColorScheme();
    const { cases, getAllEvidence } = useCases();
    const [caseData, setCaseData] = useState<Case | null>(null);
    const [caseEvidence, setCaseEvidence] = useState<Evidence[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const iconColor = colorScheme === 'dark' ? '#f8fafc' : '#111827';
    const secondaryIconColor = colorScheme === 'dark' ? '#94a3b8' : '#64748b';

    useEffect(() => {
        if (id) {
            const currentCase = cases.find(c => c.caseId === id);
            if (currentCase) {
                setCaseData(currentCase);
                // Filter global evidence by this caseId
                const evidence = getAllEvidence().filter(e => e.caseId === id);
                setCaseEvidence(evidence);
            }
        }
        setIsLoading(false);
    }, [id, cases]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-background dark:bg-black">
                <ActivityIndicator size="large" color={iconColor} />
            </View>
        );
    }

    if (!caseData) {
        return (
            <SafeAreaView className="flex-1 bg-background dark:bg-black" edges={['top']}>
                <View className="flex-row items-center px-6 py-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <ArrowLeft size={24} color={iconColor} />
                    </TouchableOpacity>
                    <Text className="ml-4 font-bold text-lg dark:text-white">Case Not Found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-black" edges={['top']}>
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={iconColor} />
                </TouchableOpacity>
                <Text className="ml-4 font-bold text-lg text-primary dark:text-white uppercase">CASE_{caseData.caseId}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="px-6 pt-6">
                {/* Case Header */}
                <View className="mb-8">
                    <Text className="text-3xl font-extrabold text-primary dark:text-white mb-2">{caseData.title}</Text>
                    <View className="flex-row items-center">
                        <Badge
                            label={caseData.status}
                            variant={caseData.status === 'Active' ? 'info' : 'default'}
                            className="mr-3"
                        />
                        <Text className="text-secondary text-xs dark:text-gray-400">{caseData.logTime}</Text>
                    </View>
                </View>

                {/* Quick Stats */}
                <View className="flex-row gap-3 mb-8">
                    <Card className="flex-1 p-4 mb-0">
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-1 dark:text-gray-400">EVIDENCE</Text>
                        <Text className="text-xl font-bold text-primary dark:text-white">{caseEvidence.length}</Text>
                    </Card>
                    <Card className="flex-1 p-4 mb-0">
                        <Text className="text-secondary text-[10px] font-bold uppercase mb-1 dark:text-gray-400">INTEGRITY</Text>
                        <Text className="text-xl font-bold text-success">100%</Text>
                    </Card>
                </View>

                {/* Evidence List for this case */}
                <View className="mb-12">
                    <View className="flex-row items-center mb-4">
                        <FolderOpen size={18} color={iconColor} className="mr-2" />
                        <Text className="text-sm font-bold text-primary dark:text-gray-300 uppercase tracking-wider">ASSOCIATED_EVIDENCE</Text>
                    </View>

                    {caseEvidence.length > 0 ? (
                        caseEvidence.map((item) => (
                            <TouchableOpacity
                                key={item.evidenceId}
                                activeOpacity={0.8}
                                onPress={() => router.push(`/evidence/${item.evidenceId}`)}
                            >
                                <Card className="mb-3 p-4 flex-row items-center">
                                    <View className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg items-center justify-center mr-4">
                                        <FileText size={20} color={secondaryIconColor} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-primary font-bold text-base mb-0.5 dark:text-white">{item.title}</Text>
                                        <Text className="text-secondary text-[10px] font-bold uppercase dark:text-gray-400">{item.evidenceId} • {item.type}</Text>
                                    </View>
                                    <ChevronRight size={18} color="#cbd5e1" />
                                </Card>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Card className="p-6 items-center">
                            <Text className="text-secondary text-sm italic dark:text-gray-500">No evidence logged for this case.</Text>
                        </Card>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
