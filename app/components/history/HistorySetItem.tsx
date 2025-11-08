import React from 'react';
import { View, Text } from 'react-native';
import { Set } from '@/services/storage';

//style
const valueTextStyle = "text-2xl font-bold text-[#3456AD] min-w-[40px] text-center";

type HistorySetItemProps = {
    item: Set;
    index: number;
};

// eslint-disable-next-line react/display-name
const HistorySetItem = React.memo(({ item, index }: HistorySetItemProps) => {
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
            <Text className="text-2xl">Série n°{index + 1} : </Text>

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
                    ({item.side === "left" ? "Gauche" : "Droite"})
                </Text>
            )}
        </View>
    );
});

export default HistorySetItem;