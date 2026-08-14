import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Set } from '@/services/storage';
import { getUITranslation, getLanguageCode } from '@/services/translation';
import { Feather } from '@expo/vector-icons';

type TrackingMode = 'WEIGHT_REPS' | 'REPS_ONLY' | 'TIME_WEIGHT' | 'TIME_DISTANCE';

type HistorySetItemProps = {
    item: Set;
    index: number;
    trackingMode?: TrackingMode;
};

const HistorySetItem = ({ item, index, trackingMode = 'WEIGHT_REPS' }: HistorySetItemProps) => {
    const [serieLabel, setSerieLabel] = useState('');
    const [leftLabel, setLeftLabel] = useState('Gauche');
    const [rightLabel, setRightLabel] = useState('Droite');
    const [repsLabel, setRepsLabel] = useState('reps');

    const isCardio = trackingMode === 'TIME_DISTANCE';
    const isTimeWeight = trackingMode === 'TIME_WEIGHT';
    const isRepsOnly = trackingMode === 'REPS_ONLY';

    useEffect(() => {
        const loadTranslations = async () => {
            setSerieLabel(await getUITranslation('serie_number'));
            setRepsLabel(await getUITranslation('reps'));
            
            const lang = getLanguageCode();
            if (lang === 'en') {
                setLeftLabel('Left');
                setRightLabel('Right');
            }
        };
        loadTranslations();
    }, []);

    return (
        <View className="flex-row items-center bg-white mx-4 my-1 px-4 py-3 rounded-xl shadow-sm shadow-black/5">
            {/* Numéro de série */}
            <View className={`rounded-full w-8 h-8 items-center justify-center mr-3 ${item.isDropSet ? 'bg-slate-100' : 'bg-primary/10'}`}>
                <Text className={`font-bold ${item.isDropSet ? 'text-slate-500 text-lg -mt-1' : 'text-primary text-sm'}`}>
                    {item.isDropSet ? '↳' : index + 1}
                </Text>
            </View>

            {/* Reps */}
            <View className="items-center mr-1">
                <Text className="text-2xl font-bold text-primary">{item.reps}</Text>
            </View>
            
            {(isCardio || isTimeWeight) && (
                <Text className="text-gray-500 text-base ml-1 mr-2">{isTimeWeight ? 'sec' : 'min'}</Text>
            )}

            {isRepsOnly ? (
                <Text className="text-gray-500 text-base ml-1 mr-2">{repsLabel}</Text>
            ) : null}

            {!isRepsOnly && (
                <Text className="text-gray-400 text-lg mx-1">{isCardio ? '-' : '×'}</Text>
            )}

            {/* Poids */}
            {!isRepsOnly && (
                <View className="items-center mr-1 ml-2">
                    <Text className="text-2xl font-bold text-primary">{item.weight}</Text>
                </View>
            )}

            {!isRepsOnly && (
                <Text className="text-gray-500 text-base ml-1">{isCardio ? 'km' : 'kg'}</Text>
            )}

            {/* Côté (unilatéral) */}
            {item.side && item.side !== "both" && (
                <View className="flex-row items-center ml-auto bg-gray-100 rounded-full px-3 py-1">
                    <Feather
                        name={item.side === "left" ? "arrow-left" : "arrow-right"}
                        size={14}
                        color="#6b7280"
                    />
                    <Text className="text-gray-500 text-sm ml-1">
                        {item.side === "left" ? leftLabel : rightLabel}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default HistorySetItem;