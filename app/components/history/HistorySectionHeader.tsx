import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

type HistorySectionHeaderProps = {
    title: string;
};

// eslint-disable-next-line react/display-name
const HistorySectionHeader = React.memo(({ title }: HistorySectionHeaderProps) => {
    return (
        <View className="bg-primary px-5 py-3 flex-row items-center gap-3">
            <Feather name="calendar" size={18} color="rgba(255,255,255,0.7)" />
            <Text className="text-white text-lg font-bold capitalize">{title}</Text>
        </View>
    );
});

export default HistorySectionHeader;