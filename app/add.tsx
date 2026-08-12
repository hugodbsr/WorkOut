import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUITranslation } from '@/services/useUITranslation';
import { useBannerActive } from '@/app/context/TimerContext';

export default function WorkoutType() {
    const router = useRouter();
    const navigation = useNavigation();
    
    const titleText = useUITranslation('choose_workout_type', 'Type d\'entraînement');
    
    const bannerActive = useBannerActive();
    const bannerGap = bannerActive ? 52 : 0;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl text-white italic">{titleText}</Text>
            ),
        });
    }, [navigation, titleText]);

    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4" edges={['bottom', 'left', 'right']}>
            <View style={{ paddingTop: 15 + bannerGap, flex: 1, gap: 16 }}>
                <TouchableOpacity 
                    onPress={() => router.push('/muscles')}
                    className="bg-white p-6 rounded-3xl flex-row items-center justify-between shadow-sm border border-gray-100 flex-1 max-h-[160px]"
                    activeOpacity={0.7}
                >
                    <View className="flex-row items-center gap-4 flex-1">
                        <View className="bg-blue-50 w-20 h-20 rounded-full items-center justify-center">
                            <MaterialCommunityIcons name="dumbbell" size={40} color="#3456AD" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-800">Musculation</Text>
                            <Text className="text-gray-500 mt-1">Exercices avec poids ou au poids du corps</Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={28} color="#d1d5db" />
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => router.push('/cardio')}
                    className="bg-white p-6 rounded-3xl flex-row items-center justify-between shadow-sm border border-gray-100 flex-1 max-h-[160px]"
                    activeOpacity={0.7}
                >
                    <View className="flex-row items-center gap-4 flex-1">
                        <View className="bg-red-50 w-20 h-20 rounded-full items-center justify-center">
                            <MaterialCommunityIcons name="heart-pulse" size={40} color="#ef4444" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-800">Cardio</Text>
                            <Text className="text-gray-500 mt-1">Exercices d'endurance et de résistance</Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={28} color="#d1d5db" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
