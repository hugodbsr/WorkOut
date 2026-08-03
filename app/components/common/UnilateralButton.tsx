import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & {
    title: string;
    active?: boolean; // <- nouvelle prop
};

const UnilateralButton = ({ title, active = false, ...rest }: Props) => {
    return (
        <TouchableOpacity
            {...rest}
            className={`mx-2 rounded-2xl px-5 py-2 shadow-sm ${
                active ? "bg-primary" : "bg-white border border-gray-100"
            }`}
            activeOpacity={0.7}
        >
            <Text className={`text-[17px] font-bold ${active ? "text-white" : "text-gray-500"}`}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default UnilateralButton;
