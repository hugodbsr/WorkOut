import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from 'react'
import { Link, useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMuscleJsonList } from "@/services/api";
import { Image, ImageBackground } from "expo-image";
import { muscleGroupImages } from "@/src/constants/images";
import { getUITranslation } from "@/services/translation";
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

    const {
        data: exercice,
        loading: exerciceLoading,
        error: exerciceError,
    } = useFetch(fetchMuscleJsonList);

    if (exerciceLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exerciceError) {
        return <Text>Error : {exerciceError?.message}</Text>;
    }

    return (
        <SafeAreaView className="flex-1 px-4">
            <Text className="text-4xl font-bold text-center m-4 my-6">{getUITranslation("choose_exercice")}</Text>
            <FlatList
                className="m-auto"
                data={exercice}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity>
                        <Link href={`/exerciceList/${item.id}`}
                            className="flex flex-row items-center px-12 my-2 bg-[#3456AD] rounded-xl">
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
        marginTop: 20,
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

