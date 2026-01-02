import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export const HomeFooter: React.FC = React.memo(() => {
    const router = useRouter();

    return (
        <>
            <View className="absolute bottom-[-1px] left-[-1px] right-[-1px] rounded-t-3xl flex-row justify-around bg-primary border-t pb-[43px]">
                <TouchableOpacity
                    className="bg-primary flex-1 py-[13px] rounded-tl-3xl mr-12 justify-center items-center relative overflow-hidden"
                    onPress={() => router.push('/records')}>
                    <View className="absolute justify-center items-center opacity-10">
                        <MaterialCommunityIcons
                            name="notebook"
                            size={100}
                            color="white"
                            style={{ transform: [{ rotate: '15deg' }] }}
                        />
                    </View>

                    <Text className="text-white font-medium italic text-2xl z-10">
                        Records
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-primary flex-1 py-[13px] rounded-tr-3xl ml-12 justify-center items-center overflow-hidden"
                    onPress={() => router.push('/settings')}>
                    <View className="absolute justify-center items-center opacity-10">
                        <Feather
                            name="settings"
                            size={100}
                            color="white"
                            style={{ transform: [{ rotate: '15deg' }] }}
                        />
                    </View>

                    <Text className="text-white font-medium italic text-2xl z-10">
                        Settings
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                className="bg-primary absolute bottom-14 left-1/2 -translate-x-1/2 w-[100px] h-[100px] rounded-full justify-center items-center shadow-lg shadow-black"
                onPress={() => router.push('/add')}
            >
                <Text className="color-white text-6xl">+</Text>
            </TouchableOpacity>
        </>
    );
});

HomeFooter.displayName = 'HomeFooter';
