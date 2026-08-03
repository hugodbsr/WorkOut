import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RepWeightInput from '../common/RepWeightInput';
import { Side } from '@/services/storage';
import { useUITranslation } from '@/services/useUITranslation';

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
    const uiSerieNumber = useUITranslation('serie_number', 'Série n°');
    const uiLeftSide = useUITranslation('left_side', 'L');
    const uiRightSide = useUITranslation('right_side', 'R');

    return (
        <View className="flex-row items-center justify-between bg-white px-4 py-3 mx-4 my-2 rounded-2xl shadow-sm border border-gray-100">
            {/* Série badge */}
            <View className="bg-blue-50 px-3 py-2 rounded-xl mr-3 items-center justify-center">
                <Text className="text-base font-bold text-[#3456AD]">{uiSerieNumber} {index + 1}</Text>
            </View>

            {/* Inputs */}
            <View className="flex-1 flex-row items-center justify-center">
                <RepWeightInput
                    value={serie.reps}
                    onChangeText={onRepChange}
                    placeholder={placeholderReps || '10'}
                />
                <Text className="text-2xl font-bold text-gray-300 mx-2.5">×</Text>
                <RepWeightInput
                    value={serie.weight}
                    onChangeText={onWeightChange}
                    placeholder={placeholderWeight || '30'}
                />
                <Text className="text-lg font-bold text-gray-400 ml-2">kg</Text>
            </View>

            {/* Unilateral toggle if needed */}
            <View className="ml-3 w-12 h-12 justify-center items-center">
                {isUnilateral && (serie.side === 'left' || serie.side === 'right') && (
                    <TouchableOpacity
                        onPress={onSideChange}
                        activeOpacity={0.7}
                        className={`
                          w-full h-full rounded-xl justify-center items-center shadow-sm
                          ${serie.side === 'left' ? 'bg-emerald-600' : 'bg-rose-600'}
                        `}
                    >
                        <Text className="text-xl font-bold text-white">
                            {serie.side === 'left' ? uiLeftSide : uiRightSide}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
});