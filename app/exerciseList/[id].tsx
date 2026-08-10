import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useLayoutEffect } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchExerciseListJson, fetchMuscleJson } from "@/services/api";
import { useNavigation } from "expo-router";
import { exerciseImages } from "@/src/constants/images";
import { Image } from "expo-image";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useBannerActive } from "@/app/context/TimerContext";

export default function Details() {
    const navigation = useNavigation();

    const router = useRouter();

    const bannerActive = useBannerActive();
    
    const bannerGap = bannerActive ? 52 : 0;

    const { id } = useLocalSearchParams();
    const query = Array.isArray(id) ? id[0] : id;

    const {
        data: group,
        loading: groupLoading,
        error: groupError,
    } = useFetch(() => fetchMuscleJson({ query: `${id}` }));

    const {
        data: exercises,
        loading: exercisesLoading,
        error: exercisesError,
    } = useFetch(() => fetchExerciseListJson({ query }));

    useLayoutEffect(() => {
        if (group) {
            navigation.setOptions({
                headerTitle: () => (
                    <Text className="font-bold text-xl text-white italic">{group.name}</Text>
                ),
            });
        }
    }, [navigation, group]);

    if (exercisesLoading || groupLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <ActivityIndicator size="large" color="#3456AD" />
            </SafeAreaView>
        );
    }

    if (exercisesError || groupError) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <Text className="text-red-500 font-medium">Error : {exercisesError?.message}</Text>
            </SafeAreaView>
        );
    }

    function getExerciseImage(name: string) {
        try {
            if (exerciseImages[name as keyof typeof exerciseImages]) {
                return exerciseImages[name as keyof typeof exerciseImages];
            } else {
                return undefined;
            }
        } catch (error) {
            console.error("Erreur lors du chargement de l'image:", error);
            return undefined;
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-gray-100" edges={['bottom', 'left', 'right']}>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 15 + bannerGap }}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            onPress={() => router.push(`/exercise/${item.id}`)}
                            className="bg-white mx-4 my-2 p-3 rounded-3xl flex-row items-center shadow-sm border border-gray-100"
                            activeOpacity={0.7}
                        >
                            <View className="bg-gray-50 rounded-full mr-4 p-1">
                                <Image
                                    source={getExerciseImage(item.image)}
                                    style={{ width: 60, height: 60, borderRadius: 30 }}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-bold text-gray-800" numberOfLines={2}>{item.name}</Text>
                            </View>
                            <Feather name="chevron-right" size={24} color="#d1d5db" />
                        </TouchableOpacity>
                    )}
                />
            </View>

            <TouchableOpacity
                style={styles.addButton}
                className="bg-[#3456AD]"
                activeOpacity={0.8}
                onPress={() => router.push(`/addExercise/${query}`)}>
                <Feather name="plus" size={32} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    addButton: {
        position: "absolute",
        bottom: 40,
        right: 20,
        width: 65,
        height: 65,
        borderRadius: 32.5,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});