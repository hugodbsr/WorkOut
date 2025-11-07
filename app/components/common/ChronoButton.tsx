import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & {
    title: string;
};

const ChronoButton = ({ title, ...rest }: Props) => {
    return (
        <TouchableOpacity
            className="bg-primary justify-center items-center p-4 px-6 rounded"
            {...rest}
        >
            <Text className="text-white text-xl">{title}</Text>
        </TouchableOpacity>
    );
};

export default ChronoButton;
