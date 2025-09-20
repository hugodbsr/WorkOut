import React from 'react';
import {TextInputProps, TextInput} from 'react-native';

const RepWeightInput = ({...rest }) => {
    return (
        <TextInput
            className="border-b-2 bg-gray-50 border-[#3456AD] rounded-b-sm rounded-md w-[55px] p-0.5 text-[22px] text-center"
            keyboardType="numeric"
            placeholderTextColor="gray"
            {...rest}
        />
    );
};

export default RepWeightInput;

