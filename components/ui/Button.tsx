import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'ghost' | 'danger';
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
}

export function Button({ label, onPress, variant = 'primary', isLoading, disabled, className, icon }: ButtonProps) {
    const baseClasses = "flex-row items-center justify-center rounded-xl px-4 py-4 min-w-[120px]";

    const variants = {
        primary: "bg-primary",
        outline: "border border-gray-300 bg-transparent",
        ghost: "bg-transparent",
        danger: "bg-error",
    };

    const textBase = "font-bold text-center text-base";
    const textVariants = {
        primary: "text-white",
        outline: "text-primary",
        ghost: "text-primary",
        danger: "text-white",
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isLoading || disabled}
            className={twMerge(baseClasses, variants[variant], (isLoading || disabled) && "opacity-50", className)}
            activeOpacity={0.7}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'outline' ? '#111827' : '#fff'} />
            ) : (
                <>
                    {icon && <React.Fragment>{icon}</React.Fragment>}
                    <Text className={twMerge(textBase, textVariants[variant], icon && "ml-2")}>
                        {label}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}
