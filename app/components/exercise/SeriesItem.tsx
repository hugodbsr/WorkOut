import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import RepWeightInput from '../common/RepWeightInput';
import { Side } from '@/services/storage';
import { useUITranslation } from '@/services/useUITranslation';

type LocalSet = {
    id: string;
    reps: string;
    weight: string;
    side: Side;
    isDropSet?: boolean;
};

type TrackingMode = 'WEIGHT_REPS' | 'REPS_ONLY' | 'TIME_WEIGHT' | 'TIME_DISTANCE';

type SeriesItemProps = {
    serie: LocalSet;
    index: number;
    placeholderReps?: string;
    placeholderWeight?: string;
    onRepChange: (text: string) => void;
    onWeightChange: (text: string) => void;
    onSideChange: () => void;
    isUnilateral: boolean;
    trackingMode?: TrackingMode;
    isDropSet?: boolean;
    onOptionsPress?: () => void;
    isDropSetButtonVisible?: boolean;
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
                                                                     trackingMode = 'WEIGHT_REPS',
                                                                     isDropSet = false,
                                                                     onOptionsPress,
                                                                     isDropSetButtonVisible = false,
                                                                 }) => {
    const uiSerieNumber = useUITranslation('serie_number', 'Série n°');
    const repsText = useUITranslation('reps', 'reps');
    const timeText = useUITranslation('time', 'temps');
    const weightText = useUITranslation('weight', 'poids');
    const distanceText = useUITranslation('distance', 'distance');
    const uiLeftSide = useUITranslation('left_side', 'L');
    const uiRightSide = useUITranslation('right_side', 'R');

    const isCardio = trackingMode === 'TIME_DISTANCE';
    const isTimeWeight = trackingMode === 'TIME_WEIGHT';
    const isRepsOnly = trackingMode === 'REPS_ONLY';

    return (
        <View className={`flex-row items-center justify-between px-4 py-3 ${isDropSet ? 'bg-slate-50 border-t border-gray-100' : ''}`}>
            {/* Série badge & Options */}
            <View className="flex-row items-center">
                {!isDropSet && onOptionsPress && (
                    <TouchableOpacity onPress={onOptionsPress} className="pr-2 py-2">
                        <Feather name="trending-down" size={20} color={isDropSetButtonVisible ? "#3456AD" : "#9ca3af"} />
                    </TouchableOpacity>
                )}
                <View className="bg-blue-50 px-3 py-2 rounded-xl mr-2 items-center justify-center flex-row">
                    {isDropSet && <Text className="text-[#3456AD] font-bold mr-1">↳</Text>}
                    <Text className="text-base font-bold text-[#3456AD]">
                        {isDropSet ? `Drop set n°${index}` : `${uiSerieNumber} ${index}`}
                    </Text>
                </View>
            </View>

            {/* Inputs */}
            <View className="flex-1 flex-row items-center justify-center">
                <RepWeightInput
                    value={serie.reps}
                    onChangeText={onRepChange}
                    placeholder={placeholderReps || (isCardio || isTimeWeight ? '30' : '10')}
                />
                {(isCardio || isTimeWeight) && (
                    <Text className="text-lg font-bold text-gray-400 mx-1">{isTimeWeight ? 'sec' : 'min'}</Text>
                )}
                
                {isRepsOnly ? (
                    <Text className="text-lg font-bold text-gray-400 ml-1">{repsText}</Text>
                ) : null}

                {!isRepsOnly && (
                    <Text className="text-2xl font-bold text-gray-300 mx-2.5">{isCardio ? '-' : '×'}</Text>
                )}

                {!isRepsOnly && (
                    <RepWeightInput
                        value={serie.weight}
                        onChangeText={onWeightChange}
                        placeholder={placeholderWeight || (isCardio ? '5' : '30')}
                    />
                )}
                {!isRepsOnly && (
                    <Text className="text-lg font-bold text-gray-400 ml-2">{isCardio ? 'km' : 'kg'}</Text>
                )}
            </View>

            {/* Unilateral toggle if needed */}
            <View className="ml-3 w-12 h-12 justify-center items-center">
                {!isDropSet && isUnilateral && (serie.side === 'left' || serie.side === 'right') && (
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