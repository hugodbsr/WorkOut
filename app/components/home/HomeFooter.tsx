import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useUITranslation } from '@/services/useUITranslation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HomeFooter: React.FC = React.memo(() => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const uiSettings = useUITranslation('settings', 'Settings');

    return (
        <>
            <View 
                className="absolute left-[-1px] right-[-1px] rounded-t-3xl flex-row justify-around bg-primary border-t"
                style={{ bottom: -1, paddingBottom: Math.max(insets.bottom, 16) + 10 }}
            >
                {/* Bouton Statistiques à gauche */}
                <TouchableOpacity
                    className="bg-primary flex-1 py-[13px] rounded-tl-3xl mr-12 justify-center items-center overflow-hidden"
                    activeOpacity={0.7}
                    onPress={() => router.push('/stats')}>
                    <View className="absolute justify-center items-center opacity-10">
                        <Feather
                            name="trending-up"
                            size={100}
                            color="white"
                            style={{ transform: [{ rotate: '-15deg' }] }}
                        />
                    </View>

                    <Text className="text-white font-medium italic text-[22px] z-10">
                        Évolution
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
                        {uiSettings}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                className="bg-primary absolute left-1/2 -translate-x-1/2 w-[100px] h-[100px] rounded-full justify-center items-center shadow-lg shadow-black"
                style={{ bottom: Math.max(insets.bottom, 16) + 30 }}
                onPress={() => router.push('/add')}
            >
                <Text className="color-white text-6xl">+</Text>
            </TouchableOpacity>
        </>
    );
});

HomeFooter.displayName = 'HomeFooter';
