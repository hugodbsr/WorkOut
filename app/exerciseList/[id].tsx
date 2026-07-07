import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useLayoutEffect } from 'react';
import { Link, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchExerciseListJson, fetchMuscleJson } from "@/services/api";
import { useNavigation } from "@react-navigation/native";
import { exerciseImages } from "@/src/constants/images";
import { Image } from "expo-image";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Details() {
    const navigation = useNavigation();

    const router = useRouter();

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
                    <Text className="font-bold text-xl text-white">{group.name}</Text>
                ),
            });
        }
    }, [navigation, group]);

    if (exercisesLoading || groupLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exercisesError || groupError) {
        return <Text>Error : {exercisesError?.message}</Text>;
    }

    function getExerciseImage(name: keyof typeof exerciseImages) {
        try {
            if (exerciseImages[name]) {
                return exerciseImages[name];
            } else {
                return undefined;
            }
        } catch (error) {
            console.error("Erreur lors du chargement de l'image:", error);
            return undefined;
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-gray-100">
            <View style={styles.container}>
                <FlatList
                    className="mb-12"
                    data={exercises}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View className="bg-gray-50 rounded-2xl justify-around mb-2">
                            <Link href={`/exercise/${item.id}`}>
                                <View className="items-center flex flex-row gap-3">
                                    <Image
                                        source={getExerciseImage(item.image)}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 45,
                                            margin: 5,
                                        }}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text numberOfLines={2}
                                            ellipsizeMode="tail"
                                            className="text-xl font-bold flex-wrap">{item.name}</Text>
                                    </View>
                                </View>
                            </Link>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 90 }}
                />
            </View>

            <TouchableOpacity
                style={styles.addButton}
                className="bg-primary"
                onPress={() => router.push(`/addExercise/${query}`)}>
                <Text className="color-white text-3xl">+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 18,
        flexDirection: "row",
        gap: "3px",
    },

    addButton: {
        position: "absolute",
        bottom: 45,
        right: 20,
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});