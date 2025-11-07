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
            className={`mr-10 ml-10 rounded-md pl-3 pr-3 pb-2 pt-2 ${
                active ? "bg-primary" : "bg-gray-300"
            }`}
        >
            <Text className={`text-xl font-bold ${active ? "text-white" : "text-black"}`}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default UnilateralButton;
