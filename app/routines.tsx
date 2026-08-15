import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, Animated } from "react-native";
import React, { useLayoutEffect, useCallback, useState, useRef } from 'react'
import { useRouter , useNavigation, useFocusEffect } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchUserRoutinesList } from "@/services/api";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import { useBannerActive } from "@/app/context/TimerContext";

export default function Routines() {
    const router = useRouter();
    const navigation = useNavigation();
    
    const bannerActive = useBannerActive();
    const bannerGap = bannerActive ? 52 : 0;
    
    const [isFabOpen, setIsFabOpen] = useState(false);
    
    const toggleFab = () => setIsFabOpen(!isFabOpen);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl text-white italic">Mes Programmes</Text>
            ),
        });
    }, [navigation]);

    const {
        data: routines,
        loading: routinesLoading,
        error: routinesError,
        refetch
    } = useFetch(fetchUserRoutinesList);

    useFocusEffect(
        useCallback(() => {
            if (refetch) refetch();
        }, [refetch])
    );

    if (routinesLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <ActivityIndicator size="large" color="#3456AD" />
            </SafeAreaView>
        );
    }

    if (routinesError) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <Text className="text-red-500 font-medium">Erreur : {routinesError?.message}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom', 'left', 'right']}>
            <FlatList
                data={routines}
                contentContainerStyle={{ paddingTop: 15 + bannerGap, paddingBottom: 120 }}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => (
                    <View className="items-center justify-center mt-10 px-6">
                        <Feather name="inbox" size={48} color="#d1d5db" />
                        <Text className="text-gray-400 font-medium text-center mt-4">
                            Vous n'avez pas encore de programme. Créez le vôtre ou ajoutez-en un depuis la bibliothèque !
                        </Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => router.push(`/routine/${item.id}`)}
                        className="bg-white mx-4 mb-3 px-4 py-4 rounded-2xl flex-row items-center shadow-sm border border-gray-100"
                        activeOpacity={0.7}
                    >
                        <View className="bg-orange-50 w-14 h-14 rounded-full items-center justify-center mr-4 overflow-hidden">
                            <MaterialCommunityIcons name="clipboard-list" size={26} color="#f97316" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-[19px] font-bold text-gray-800">{item.title}</Text>
                            <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>{item.description}</Text>
                            <View className="flex-row items-center mt-2 gap-3">
                                <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-md">
                                    <Feather name="clock" size={12} color="#6b7280" />
                                    <Text className="text-gray-500 text-xs ml-1 font-medium">{item.duration}</Text>
                                </View>
                                <View className="flex-row items-center bg-blue-50 px-2 py-1 rounded-md">
                                    <Feather name="bar-chart" size={12} color="#3456AD" />
                                    <Text className="text-[#3456AD] text-xs ml-1 font-medium">{item.level}</Text>
                                </View>
                            </View>
                        </View>
                        
                        <TouchableOpacity 
                            onPress={(e) => {
                                e.stopPropagation();
                                router.push(`/editRoutine/${item.id}`);
                            }}
                            className="p-2 ml-2"
                        >
                            <Feather name="edit-2" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />

            {/* Fond semi-transparent quand ouvert */}
            {isFabOpen && (
                <TouchableOpacity 
                    className="absolute top-0 bottom-0 left-0 right-0 bg-black/40"
                    activeOpacity={1}
                    onPress={() => setIsFabOpen(false)}
                />
            )}

            {/* Speed Dial Menu */}
            <View className="absolute right-6 bottom-[100px] items-end">
                {isFabOpen && (
                    <>
                        <View className="flex-row items-center mb-4">
                            <Text className="bg-white px-3 py-1.5 rounded-lg overflow-hidden shadow-sm mr-3 font-medium text-gray-800">
                                Bibliothèque
                            </Text>
                            <TouchableOpacity
                                className="bg-white border border-gray-200 shadow-md items-center justify-center w-12 h-12 rounded-full"
                                activeOpacity={0.8}
                                onPress={() => {
                                    setIsFabOpen(false);
                                    router.push(`/routineLibrary`);
                                }}
                            >
                                <Feather name="book-open" size={20} color="#ea580c" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center mb-4">
                            <Text className="bg-white px-3 py-1.5 rounded-lg overflow-hidden shadow-sm mr-3 font-medium text-gray-800">
                                Créer de zéro
                            </Text>
                            <TouchableOpacity
                                className="bg-[#3456AD] shadow-md items-center justify-center w-12 h-12 rounded-full"
                                activeOpacity={0.8}
                                onPress={() => {
                                    setIsFabOpen(false);
                                    router.push(`/editRoutine/new`);
                                }}
                            >
                                <Feather name="edit-2" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
                
                <TouchableOpacity
                    className="bg-[#ea580c] shadow-lg items-center justify-center"
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    activeOpacity={0.8}
                    onPress={toggleFab}
                >
                    <Feather name={isFabOpen ? "x" : "plus"} size={30} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
