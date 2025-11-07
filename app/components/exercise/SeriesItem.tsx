import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RepWeightInput from '../common/RepWeightInput';
import { Side } from '@/services/storage';

type LocalSet = {
    id: string;
    reps: string;
    weight: string;
    side: Side;
};

type SeriesItemProps = {
    serie: LocalSet;
    index: number;
    placeholderReps: string;
    placeholderWeight: string;
    onRepChange: (text: string) => void;
    onWeightChange: (text: string) => void;
    onSideChange: () => void;
    isUnilateral: boolean;
};

// eslint-disable-next-line react/display-name
export const SeriesItem: React.FC<SeriesItemProps> = React.memo(({
                                                                     serie,
                                                                     index,
                                                                     placeholderReps,
                                                                     placeholderWeight,
                                                                     onRepChange,
                                                                     onWeightChange,
                                                                     onSideChange,
                                                                     isUnilateral,
                                                                 }) => {
    return (
        <View className="flex-row items-center justify-center bg-gray-100 border-l-4 border-blue-800 h-13 my-2 mx-0">
            <Text className="text-2xl font-normal">Série n°{index + 1} </Text>

            <View className="flex-row items-center bg-white justify-center px-3 py-2.5 rounded-lg">
                <RepWeightInput
                    value={serie.reps}
                    onChangeText={onRepChange}
                    placeholder={placeholderReps || '10'}
                />
                <Text className="text-2xl font-normal"> X </Text>
                <RepWeightInput
                    value={serie.weight}
                    onChangeText={onWeightChange}
                    placeholder={placeholderWeight || '30'}
                />
                <Text className="text-2xl font-normal"> Kg </Text>
            </View>

            <View
                className={`
                  ml-2.5 w-10 h-10 rounded-md justify-center items-center
                  ${serie.side === 'left' ? 'bg-[#205d30]' : serie.side === 'right' ? 'bg-[#b91e10]' : 'bg-transparent'}
                `}
            >
                {(serie.side === 'left' || serie.side === 'right') && (
                    <TouchableOpacity
                        onPress={onSideChange}
                        disabled={!isUnilateral}
                        className="w-full h-full justify-center items-center"
                    >
                        <Text className="text-4xl font-bold text-white">
                            {serie.side === 'left' ? 'G' : 'D'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
});