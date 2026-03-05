import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard, TextInput, Image } from 'react-native';
import { useColorScheme } from 'nativewind';
import { X, MapPin, Hash, Clock, Image as ImageIcon, FileText, Upload, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useCases } from '../context/CaseContext';
import { VoiceRecorder } from './VoiceRecorder';

interface LogEvidenceModalProps {
    visible: boolean;
    onClose: () => void;
}

export const LogEvidenceModal = ({ visible, onClose }: LogEvidenceModalProps) => {
    const { colorScheme } = useColorScheme();
    const { cases, addEvidence } = useCases();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [selectedType, setSelectedType] = useState('Document');
    const [selectedCaseId, setSelectedCaseId] = useState('');
    const [fileUri, setFileUri] = useState<string | undefined>(undefined);
    const [fileName, setFileName] = useState<string | undefined>(undefined);

    // Update selected case when cases list loads or changes
    React.useEffect(() => {
        if (!selectedCaseId && cases.length > 0) {
            const activeCases = cases.filter(c => c.status === 'Active');
            if (activeCases.length > 0) {
                setSelectedCaseId(activeCases[0].caseId);
            }
        }
    }, [cases]);

    const iconColor = colorScheme === 'dark' ? '#f8fafc' : '#111827';
    const secondaryIconColor = colorScheme === 'dark' ? '#94a3b8' : '#64748b';

    const EVIDENCE_TYPES = ['Document', 'Disk Image', 'Network', 'Image', 'Audio', 'Archive', 'Other'];

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFileUri(result.assets[0].uri);
            setFileName(result.assets[0].fileName || 'Selected Image');
        }
    };

    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({});
        if (!result.canceled) {
            setFileUri(result.assets[0].uri);
            setFileName(result.assets[0].name);
        }
    };

    const clearFile = () => {
        setFileUri(undefined);
        setFileName(undefined);
    };

    const handleLogEvidence = () => {
        if (title.trim() && location.trim() && selectedCaseId) {
            const fileObj = fileUri ? {
                uri: fileUri,
                name: fileName || (selectedType === 'Audio' ? 'recording.m4a' : 'upload.jpg'),
                type: selectedType === 'Audio' ? 'audio/m4a' : (selectedType === 'Image' ? 'image/jpeg' : 'application/octet-stream')
            } : undefined;

            addEvidence(
                selectedCaseId,
                title.trim(),
                selectedType,
                location.trim(),
                'AUTO-GENERATED-SHA256', // Placeholder hash
                fileObj
            );

            setTitle('');
            setLocation('');
            setFileUri(undefined);
            setFileName(undefined);
            onClose();
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end bg-black/50">
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="bg-white dark:bg-gray-900 rounded-t-3xl p-6 h-[90%]">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-2xl font-extrabold text-primary dark:text-white">Log Evidence</Text>
                                <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                    <X size={20} color={iconColor} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Form Fields */}
                                <View className="mb-6">
                                    <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase mb-2">EVIDENCE TITLE</Text>
                                    <TextInput
                                        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-primary dark:text-white font-bold text-base"
                                        placeholder="e.g. MacBook Pro Serial #..."
                                        placeholderTextColor="#9ca3af"
                                        value={title}
                                        onChangeText={setTitle}
                                    />
                                </View>

                                <View className="mb-6">
                                    <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase mb-2">LOCATION_FOUND</Text>
                                    <View className="relative">
                                        <TextInput
                                            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 pl-12 text-primary dark:text-white font-bold text-base"
                                            placeholder="e.g. Living Room, North Wall"
                                            placeholderTextColor="#9ca3af"
                                            value={location}
                                            onChangeText={setLocation}
                                        />
                                        <MapPin size={20} color={secondaryIconColor} className="absolute left-4 top-4" />
                                    </View>
                                </View>

                                {/* File Attachment Section */}
                                <View className="mb-6">
                                    <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase mb-2">ATTACH DATA</Text>

                                    {selectedType === 'Audio' ? (
                                        <VoiceRecorder
                                            onRecordingComplete={(uri, filename) => {
                                                setFileUri(uri);
                                                setFileName(filename);
                                            }}
                                            onReset={clearFile}
                                        />
                                    ) : fileUri ? (
                                        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex-row items-center justify-between">
                                            <View className="flex-row items-center flex-1">
                                                <FileText size={20} color={iconColor} />
                                                <Text className="text-primary dark:text-white font-bold text-sm ml-3 flex-1" numberOfLines={1}>
                                                    {fileName}
                                                </Text>
                                            </View>
                                            <TouchableOpacity onPress={clearFile} className="p-2">
                                                <Trash2 size={20} color="#ef4444" />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View className="flex-row gap-3">
                                            <TouchableOpacity
                                                onPress={pickImage}
                                                className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-dashed rounded-xl p-4 items-center justify-center"
                                            >
                                                <ImageIcon size={24} color={secondaryIconColor} />
                                                <Text className="text-secondary dark:text-gray-400 text-[10px] font-bold mt-1">UPLOAD IMAGE</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={pickDocument}
                                                className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-dashed rounded-xl p-4 items-center justify-center"
                                            >
                                                <Upload size={24} color={secondaryIconColor} />
                                                <Text className="text-secondary dark:text-gray-400 text-[10px] font-bold mt-1">UPLOAD FILE</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>


                                <View className="mb-6">
                                    <View className="flex-row justify-between items-center mb-2">
                                        <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase">ASSIGN TO CASE</Text>
                                        <Text className="text-secondary dark:text-gray-400 text-[10px]">{cases.filter(c => c.status === 'Active').length} Active</Text>
                                    </View>

                                    {cases.filter(c => c.status === 'Active').length > 0 ? (
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                            {cases.filter(c => c.status === 'Active').map((c) => (
                                                <TouchableOpacity
                                                    key={c._id}
                                                    onPress={() => setSelectedCaseId(c.caseId)}
                                                    className={`mr-3 p-4 rounded-xl border w-40 ${selectedCaseId === c.caseId ? 'bg-primary dark:bg-white border-primary dark:border-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                                                >
                                                    <Text className={`font-bold text-xs mb-1 ${selectedCaseId === c.caseId ? 'text-gray-400 dark:text-gray-600' : 'text-secondary dark:text-gray-400'}`}>{c.caseId}</Text>
                                                    <Text className={`font-bold text-sm leading-4 ${selectedCaseId === c.caseId ? 'text-white dark:text-black' : 'text-primary dark:text-white'}`} numberOfLines={2}>{c.title}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    ) : (
                                        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 items-center">
                                            <Text className="text-secondary dark:text-gray-500 font-bold">No active cases found.</Text>
                                        </View>
                                    )}
                                </View>

                                <View className="mb-8">
                                    <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase mb-2">EVIDENCE TYPE</Text>
                                    <View className="flex-row flex-wrap gap-2">
                                        {EVIDENCE_TYPES.map((type) => (
                                            <TouchableOpacity
                                                key={type}
                                                onPress={() => setSelectedType(type)}
                                                className={`px-4 py-2 rounded-lg border ${selectedType === type ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                                            >
                                                <Text className={`text-xs font-bold ${selectedType === type ? 'text-white dark:text-black' : 'text-primary dark:text-white'}`}>{type}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Auto-gen info preview */}
                                <View className="border-t border-gray-100 dark:border-gray-800 pt-6 mb-8">
                                    <View className="flex-row justify-between items-center mb-2">
                                        <View className="flex-row items-center">
                                            <Clock size={14} color={secondaryIconColor} className="mr-2" />
                                            <Text className="text-secondary dark:text-gray-400 text-xs font-bold">TIMESTAMP</Text>
                                        </View>
                                        <Text className="text-primary dark:text-white font-mono text-xs">{new Date().toISOString()}</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-row items-center">
                                            <Hash size={14} color={secondaryIconColor} className="mr-2" />
                                            <Text className="text-secondary dark:text-gray-400 text-xs font-bold">SHA-256</Text>
                                        </View>
                                        <Text className="text-green-600 dark:text-green-400 font-mono text-xs">AUTO-GENERATED</Text>
                                    </View>
                                </View>

                            </ScrollView>

                            <TouchableOpacity
                                onPress={handleLogEvidence}
                                className={`bg-black dark:bg-white rounded-xl py-4 items-center mt-4 ${(!title.trim() || !location.trim()) ? 'opacity-50' : ''}`}
                                disabled={!title.trim() || !location.trim()}
                            >
                                <Text className="text-white dark:text-black font-bold text-lg uppercase tracking-wider">SECURE LOG</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback >
        </Modal >
    );
};
