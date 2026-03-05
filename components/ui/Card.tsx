import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface CardProps extends ViewProps {
    title?: string;
    action?: React.ReactNode;
    className?: string;
}

export function Card({ title, action, children, className, ...props }: CardProps) {
    return (
        <View className={twMerge("bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 dark:bg-gray-900 dark:border-gray-800", className)} {...props}>
            {(title || action) && (
                <View className="flex-row justify-between items-center mb-4">
                    {title && <Text className="font-bold text-lg text-primary dark:text-white">{title}</Text>}
                    {action}
                </View>
            )}
            {children}
        </View>
    );
}
