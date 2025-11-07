import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

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

    return (
        <>
            <View className="absolute bottom-0 left-0 right-0 flex-row justify-around bg-white border-t border-[#ddd] pb-[45px]">
                <TouchableOpacity
                    className="bg-primary flex-1 py-[15px] justify-center items-center"
                    onPress={() => router.push(`../chrono`)}
                >
                    <Text className="color-white text-2xl">Chrono</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-primary flex-1 py-[15px] justify-center items-center"
                    onPress={() => router.push(`/exerciceRecord/${exerciseQuery}`)}
                >
                    <Text className="color-white text-2xl">Records</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                className="bg-primary absolute bottom-14 left-1/2 -translate-x-1/2 w-[100px] h-[100px] rounded-full justify-center items-center shadow-lg shadow-black"
                onPress={onAddPress}
            >
                <Text className="color-white text-6xl">+</Text>
            </TouchableOpacity>
        </>
    );
});