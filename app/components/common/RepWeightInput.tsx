import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

const RepWeightInput = ({...rest }) => {
    return (
        <TextInput
            className="bg-gray-100 text-gray-800 rounded-xl w-[60px] h-[45px] text-xl font-bold text-center"
            keyboardType="numeric"
            placeholderTextColor="#9ca3af"
            {...rest}
        />
    );
};

export default RepWeightInput;

