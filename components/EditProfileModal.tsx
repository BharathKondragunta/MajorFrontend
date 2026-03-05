import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import { X, User, Mail, Shield } from 'lucide-react-native';
import { useUser } from '../context/UserContext';
import { useCases } from '../context/CaseContext';

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
}

export const EditProfileModal = ({ visible, onClose }: EditProfileModalProps) => {
    const { colorScheme } = useColorScheme();
    const { user, updateUser } = useUser();
    const { addLog } = useCases();

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    useEffect(() => {
        if (visible) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [visible, user]);

    const iconColor = colorScheme === 'dark' ? '#f8fafc' : '#111827';

    const handleSave = () => {
        if (name.trim() && email.trim()) {
            updateUser({ name: name.trim(), email: email.trim() });
            addLog('Profile Updated', name.trim(), 'Profile', 'Updated');
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
                        <View className="bg-white dark:bg-gray-900 rounded-t-3xl p-6 h-[60%]">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-2xl font-extrabold text-primary dark:text-white">Edit Profile</Text>
                                <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                    <X size={20} color={iconColor} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View className="mb-6">
                                    <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase mb-2">FULL NAME</Text>
                                    <View className="relative">
                                        <TextInput
                                            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 pl-12 text-primary dark:text-white font-bold text-lg"
                                            placeholder="Detective Name"
                                            placeholderTextColor="#9ca3af"
                                            value={name}
                                            onChangeText={setName}
                                        />
                                        <User size={20} color="#9ca3af" className="absolute left-4 top-4" />
                                    </View>
                                </View>

                                <View className="mb-6">
                                    <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase mb-2">EMAIL ADDRESS</Text>
                                    <View className="relative">
                                        <TextInput
                                            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 pl-12 text-primary dark:text-white font-bold text-lg"
                                            placeholder="email@agency.gov"
                                            placeholderTextColor="#9ca3af"
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                        <Mail size={20} color="#9ca3af" className="absolute left-4 top-4" />
                                    </View>
                                </View>

                                <View className="mb-6 opacity-50">
                                    <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase mb-2">CLEARANCE LEVEL (RESTRICTED)</Text>
                                    <View className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex-row items-center">
                                        <Shield size={20} color="#9ca3af" className="mr-3" />
                                        <Text className="text-gray-500 font-bold text-lg">{user.clearance}</Text>
                                    </View>
                                </View>
                            </ScrollView>

                            <TouchableOpacity
                                onPress={handleSave}
                                className={`bg-black dark:bg-white rounded-xl py-4 items-center mt-auto mb-8 ${(!name.trim() || !email.trim()) ? 'opacity-50' : ''}`}
                                disabled={!name.trim() || !email.trim()}
                            >
                                <Text className="text-white dark:text-black font-bold text-lg uppercase tracking-wider">Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
