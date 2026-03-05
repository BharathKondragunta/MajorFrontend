import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface InputProps extends TextInputProps {
    label?: string;
    icon?: React.ReactNode;
    containerClassName?: string;
}

export function Input({ label, icon, containerClassName, className, ...props }: InputProps) {
    return (
        <View className={twMerge("mb-4", containerClassName)}>
            {label && <Text className="text-secondary text-xs uppercase font-bold mb-2 tracking-wider">{label}</Text>}
            <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3">
                {icon && <View className="mr-3 opactiy-50">{icon}</View>}
                <TextInput
                    className={twMerge("flex-1 text-primary text-base font-medium", className)}
                    placeholderTextColor="#94a3b8"
                    {...props}
                />
            </View>
        </View>
    );
}
