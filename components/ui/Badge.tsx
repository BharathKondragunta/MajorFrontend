import React from 'react';
import { View, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    className?: string;
}

export function Badge({ label, variant = 'default', className }: BadgeProps) {
    const variants = {
        success: {
            bg: "bg-green-100 dark:bg-green-900/40",
            text: "text-green-700 dark:text-green-400"
        },
        warning: {
            bg: "bg-yellow-100 dark:bg-yellow-900/40",
            text: "text-yellow-800 dark:text-yellow-400"
        },
        error: {
            bg: "bg-red-100 dark:bg-red-900/40",
            text: "text-red-700 dark:text-red-400"
        },
        info: {
            bg: "bg-blue-100 dark:bg-blue-900/40",
            text: "text-blue-700 dark:text-blue-400"
        },
        default: {
            bg: "bg-gray-100 dark:bg-gray-800",
            text: "text-gray-700 dark:text-gray-300"
        },
    };

    return (
        <View className={twMerge("rounded-full px-3 py-1 self-start", variants[variant].bg, className)}>
            <Text className={twMerge("text-xs font-bold", variants[variant].text)}>
                {label}
            </Text>
        </View>
    );
}
