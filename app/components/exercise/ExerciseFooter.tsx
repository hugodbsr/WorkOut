import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUITranslation } from "@/services/useUITranslation";
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ExerciseFooterProps = {
    exerciseQuery: string;
    onAddPress: () => void;
};

// eslint-disable-next-line react/display-name
export const ExerciseFooter: React.FC<ExerciseFooterProps> = React.memo(({
                                                                             exerciseQuery,
                                                                             onAddPress,
                                                                         }) => {
    const router = useRouter();
    const uiChrono = useUITranslation("chrono", "Chrono");
    const uiRecords = useUITranslation("records", "Records");
    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom > 0 ? insets.bottom : 0;

    return (
        <>
            <View 
                className="absolute left-[-1px] right-[-1px] rounded-t-3xl flex-row justify-around bg-primary border-t"
                style={{ bottom: -1, paddingBottom: 43 + bottomPadding }}
            >
                <TouchableOpacity
                    className="bg-primary flex-1 py-[13px] rounded-tl-3xl mr-12 justify-center items-center relative overflow-hidden"
                    onPress={() => router.push(`/exerciseRecord/${exerciseQuery}`)}>
                    <View className="absolute justify-center items-center opacity-10">
                        <MaterialCommunityIcons 
                            name="notebook" 
                            size={100}
                            color="white" 
                            style={{ transform: [{ rotate: '15deg' }] }}
                        />
                    </View>

                    <Text className="text-white font-medium italic text-2xl z-10">
                        {uiRecords}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-primary flex-1 py-[13px] rounded-tr-3xl ml-12 gap-1 justify-center flex-row items-center overflow-hidden"
                    onPress={() => router.push(`../chrono`)}>
                    <View className="absolute justify-center items-center opacity-10">
                        <Octicons 
                            name="stopwatch" 
                            size={100}
                            color="white" 
                            style={{ transform: [{ rotate: '15deg' }] }}
                        />
                    </View>

                    <Text className="text-white font-medium italic text-2xl z-10">
                        {uiChrono}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                className="bg-primary absolute left-1/2 -translate-x-1/2 w-[100px] h-[100px] rounded-full justify-center items-center shadow-lg shadow-black"
                style={{ bottom: 14 + bottomPadding }}
                onPress={onAddPress}
            >
                <Text className="color-white text-6xl">+</Text>
            </TouchableOpacity>
        </>
    );
});