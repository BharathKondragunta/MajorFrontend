import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { X } from 'lucide-react-native';
import { useCases } from '../context/CaseContext';

interface NewCaseModalProps {
    visible: boolean;
    onClose: () => void;
}

export const NewCaseModal = ({ visible, onClose }: NewCaseModalProps) => {
    const { colorScheme } = useColorScheme();
    const { addCase } = useCases();
    const [title, setTitle] = useState('');

    const iconColor = colorScheme === 'dark' ? '#f8fafc' : '#111827';

    const handleCreateCase = () => {
        if (title.trim()) {
            addCase(title.trim());
            setTitle('');
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
                        <View className="bg-white dark:bg-gray-900 rounded-t-3xl p-6 h-[50%]">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-2xl font-extrabold text-primary dark:text-white">New Case</Text>
                                <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                    <X size={20} color={iconColor} />
                                </TouchableOpacity>
                            </View>

                            <View className="mb-6">
                                <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase mb-2">CASE TITLE</Text>
                                <TextInput
                                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-primary dark:text-white font-bold text-lg"
                                    placeholder="e.g. Operation Firewall"
                                    placeholderTextColor="#9ca3af"
                                    value={title}
                                    onChangeText={setTitle}
                                    autoFocus
                                />
                            </View>

                            <TouchableOpacity
                                onPress={handleCreateCase}
                                className={`bg-black dark:bg-white rounded-xl py-4 items-center mt-auto mb-8 ${!title.trim() ? 'opacity-50' : ''}`}
                                disabled={!title.trim()}
                            >
                                <Text className="text-white dark:text-black font-bold text-lg uppercase tracking-wider">Create Case</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
