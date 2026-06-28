import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from 'react'
import { Link, useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMuscleJsonList } from "@/services/api";
import { Image, ImageBackground } from "expo-image";
import { muscleGroupImages } from "@/src/constants/images";
import { useUITranslation } from "@/services/useUITranslation";
import { SafeAreaView } from 'react-native-safe-area-context';

function getMuscleImage(name?: string) {
    if (name && muscleGroupImages[name as keyof typeof muscleGroupImages]) {
        return muscleGroupImages[name as keyof typeof muscleGroupImages];
    } else {
        return undefined;
    }
}

export default function Add() {
    const router = useRouter();

    const chooseExerciseText = useUITranslation('choose_exercise', 'Choose an exercise');

    const {
        data: muscleGroups,
        loading: muscleGroupsLoading,
        error: muscleGroupsError,
    } = useFetch(fetchMuscleJsonList);

    if (muscleGroupsLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (muscleGroupsError) {
        return <Text>Error : {muscleGroupsError?.message}</Text>;
    }

    return (
        <SafeAreaView className="flex-1">
            <Text className="text-4xl font-bold text-center m-2">{chooseExerciseText}</Text>
            <FlatList
                className="m-auto"
                data={muscleGroups}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity>
                        <Link href={`/exerciseList/${item.id}`}
                            className="flex flex-row items-center px-12 my-1.5 bg-[#3456AD] rounded-xl">
                            <View className="items-start flex flex-row">
                                <Image
                                    source={getMuscleImage(item.image)}
                                    style={{ width: 65, height: 65, margin: "auto" }}

                                />
                                <Text
                                    className="p-4 font-bold text-3xl text-white rounded-[10px]">
                                    {item.name}
                                </Text>
                            </View>
                        </Link>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 12,
        borderRadius: 6,
        backgroundColor: "#eee",
    },
    item: {
        fontSize: 18,
    },
});

