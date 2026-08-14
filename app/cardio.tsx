import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import React, { useLayoutEffect } from 'react'
import { useRouter , useNavigation } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchCardioGroupsJsonList } from "@/services/api";
import { Image } from "expo-image";
import { exerciseImages } from "@/src/constants/images";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useUITranslation } from '@/services/useUITranslation';

import { useBannerActive } from "@/app/context/TimerContext";

function getCardioImage(name?: string) {
    if (name && exerciseImages[name as keyof typeof exerciseImages]) {
        return exerciseImages[name as keyof typeof exerciseImages];
    } else {
        return undefined;
    }
}

export default function Cardio() {
    const router = useRouter();
    const navigation = useNavigation();
    const cardioTitle = useUITranslation('cardio', 'Cardio');
    
    const bannerActive = useBannerActive();
    
    const bannerGap = bannerActive ? 52 : 0;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl text-white italic">{cardioTitle}</Text>
            ),
        });
    }, [navigation]);

    const {
        data: cardioGroups,
        loading: cardioGroupsLoading,
        error: cardioGroupsError,
    } = useFetch(fetchCardioGroupsJsonList);

    if (cardioGroupsLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <ActivityIndicator size="large" color="#3456AD" />
            </SafeAreaView>
        );
    }

    if (cardioGroupsError) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <Text className="text-red-500 font-medium">Erreur : {cardioGroupsError?.message}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom', 'left', 'right']}>
            <FlatList
                data={cardioGroups}
                contentContainerStyle={{ paddingTop: 15 + bannerGap, paddingBottom: 12 }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => router.push(`/exerciseList/${item.id}`)}
                        className="bg-white mx-4 mb-2.5 px-4 py-3 rounded-2xl flex-row items-center shadow-sm border border-gray-100"
                        activeOpacity={0.7}
                    >
                        <View className="bg-blue-50 w-14 h-14 rounded-full items-center justify-center mr-4 overflow-hidden">
                            {item.iconName ? (
                                <Feather name={item.iconName as any} size={24} color="#3456AD" />
                            ) : (
                                <Image
                                    source={getCardioImage(item.image)}
                                    style={{ width: 44, height: 44 }}
                                    contentFit="contain"
                                />
                            )}
                        </View>
                        <View className="flex-1">
                            <Text className="text-[19px] font-bold text-gray-800">{item.name}</Text>
                        </View>
                        <Feather name="chevron-right" size={22} color="#d1d5db" />
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}
