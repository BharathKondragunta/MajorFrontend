import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ShieldCheck, UploadCloud, FileImage, Calendar, Camera, ChevronDown, Lock } from 'lucide-react-native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCases } from '../../context/CaseContext';

export default function EvidenceIntake() {
    const { addEvidence } = useCases();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                setSelectedFile(result.assets[0]);
            }
        } catch (err) {
            console.error('Error picking document:', err);
        }
    };

    const handleLogEvidence = async () => {
        if (!title.trim() || !location.trim()) {
            Alert.alert('Error', 'Please enter a title and location.');
            return;
        }

        setIsUploading(true);
        try {
            // Simulated hash for demo purposes - in production use expo-crypto
            const mockHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

            // Note: We're using a hardcoded Case ID for now or it could be passed via params
            const caseId = 'CG-2024-0892';

            await addEvidence(
                caseId,
                title.trim(),
                'Image', // This should be dynamic based on file type
                location.trim(),
                mockHash,
                selectedFile
            );

            Alert.alert('Success', 'Evidence has been securely logged.');
            router.back();
        } catch (error: any) {
            Alert.alert('Upload Failed', error.message || 'There was an error uploading the evidence.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="flex-row justify-between items-start px-6 py-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <X size={24} color="#111827" />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-lg font-bold text-primary">Evidence Intake</Text>
                    <Text className="text-xs font-bold text-secondary">Case ID: CG-2024-0892</Text>
                </View>
                <ShieldCheck size={28} color="#22c55e" />
            </View>

            <ScrollView className="px-6 mt-4" showsVerticalScrollIndicator={false}>

                {/* Evidence Source Indicator */}
                <View className="flex-row items-center mb-4">
                    <Text className="text-xs font-bold text-primary mr-1">Evidence Source</Text>
                    <Text className="text-red-500 text-xs">*</Text>
                </View>

                {/* Upload Area */}
                <TouchableOpacity
                    onPress={pickDocument}
                    className="bg-white border-2 border-dashed border-gray-200 rounded-2xl h-48 items-center justify-center mb-8"
                >
                    <UploadCloud size={48} color={selectedFile ? "#22c55e" : "#94a3b8"} className="mb-4" />
                    <Text className="text-secondary font-medium mb-1">
                        {selectedFile ? selectedFile.name : 'Click to browse forensic image'}
                    </Text>
                    <Text className="text-secondary text-[10px] font-bold uppercase">
                        {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : 'Supports .E01, .RAW, .AFF4, .ZIP'}
                    </Text>
                </TouchableOpacity>

                {/* Cryptographic Integrity */}
                <Card className="mb-8 p-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="font-bold text-primary">Cryptographic Integrity</Text>
                        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded px-2 py-1">
                            <ShieldCheck size={12} color="#475569" className="mr-1" />
                            <Text className="text-[10px] font-bold text-slate-600 uppercase">Auto-Generated</Text>
                        </View>
                    </View>

                    <View className="mb-4">
                        <View className="flex-row mb-2">
                            <Text className="text-[10px] font-bold text-primary mr-1">SHA-256 Hash</Text>
                        </View>
                        <View className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <Text className="text-xs font-mono text-gray-600 leading-5">Verification pending upload...</Text>
                        </View>
                    </View>
                </Card>

                {/* Form Fields */}
                <Input
                    label="Evidence Title *"
                    placeholder="e.g. Suspect Primary Mobile Device Dump"
                    value={title}
                    onChangeText={setTitle}
                />

                <Input
                    label="Capture Location *"
                    placeholder="e.g. Crime Scene Alpha - Sector 4"
                    value={location}
                    onChangeText={setLocation}
                />

                <Button
                    label={isUploading ? "UPLOADING..." : "Log Evidence"}
                    onPress={handleLogEvidence}
                    isLoading={isUploading}
                    icon={!isUploading && <Lock size={18} color="white" />}
                    className="mb-12 bg-black"
                />

            </ScrollView>
        </SafeAreaView>
    );
}
