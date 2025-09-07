import React from 'react';
import {TextInputProps, TextInput} from 'react-native';

const RepWeightInput = ({...rest }) => {
    return (
        <TextInput
            className="border-4 border-[#3456AD] rounded-md w-[75px] p-0.5 text-[22px] text-center"
            keyboardType="numeric"
            placeholderTextColor="gray"
            {...rest}
        />
    );
};

export default RepWeightInput;

