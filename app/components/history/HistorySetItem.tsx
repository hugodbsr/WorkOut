import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Set } from '@/services/storage';
import { getUITranslation, getLanguageCode } from '@/services/translation';

//style
const valueTextStyle = "text-2xl font-bold text-[#3456AD] min-w-[40px] text-center";

type HistorySetItemProps = {
    item: Set;
    index: number;
};

const HistorySetItem = ({ item, index }: HistorySetItemProps) => {
    const [serieLabel, setSerieLabel] = useState('');
    const [leftLabel, setLeftLabel] = useState('Gauche');
    const [rightLabel, setRightLabel] = useState('Droite');

    useEffect(() => {
        const loadTranslations = async () => {
            const serie = await getUITranslation("serie_number");
            setSerieLabel(serie);

            // Set left/right based on language
            const lang = getLanguageCode();
            if (lang === 'en') {
                setLeftLabel('Left');
                setRightLabel('Right');
            }
        };
        loadTranslations();
    }, []);

    return (
        <View
            className="
                flex-row
                items-center
                bg-gray-50
                py-2.5
                px-4
                border-b
                border-b-gray-200
            ">
            <Text className="text-2xl">{serieLabel}{index + 1} : </Text>

            <Text className={valueTextStyle}>
                {item.reps}
            </Text>

            <Text className="text-2xl"> X </Text>

            <Text className={valueTextStyle}>
                {item.weight}
            </Text>

            <Text className="text-2xl"> Kg </Text>

            {item.side && item.side !== "both" && (
                <Text className="text-lg text-gray-500 ml-2.5">
                    ({item.side === "left" ? leftLabel : rightLabel})
                </Text>
            )}
        </View>
    );
};

export default HistorySetItem;