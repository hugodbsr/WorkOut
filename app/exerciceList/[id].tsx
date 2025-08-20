import {ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {Link, useLocalSearchParams, useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExercice, fetchExerciceList, fetchExerciceListJson, fetchMuscle, fetchMuscleJson} from "@/services/api";
import { Image } from 'react-native';
import {useNavigation} from "@react-navigation/native";

export default function Details(){
    const navigation = useNavigation();

    const router = useRouter();

    const {id} = useLocalSearchParams();
    const query = Array.isArray(id) ? id[0] : id;

    const {
        data: group,
        loading: groupLoading,
        error: groupError,
    } = useFetch(() => fetchMuscleJson({query: `${id}`}));

    const {
        data: exercice,
        loading: exerciceLoading,
        error: exerciceError,
    } = useFetch(() => fetchExerciceListJson({ query }));

    useLayoutEffect(() => {
        if(group){
            navigation.setOptions({
                headerTitle: () => (
                    <Text className="font-bold text-xl">{group.name}</Text>
                ),
            });
        }
    }, [navigation, group]);

    if (exerciceLoading || groupLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exerciceError || groupError) {
        return <Text>Error : {exerciceError?.message}</Text>;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    data={exercice}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View className="justify-around">
                            <Link href={`/exercice/${item.id}`}>
                                <View className="items-center flex flex-row gap-3">
                                    <Image
                                        source={{ uri: item.image }}
                                        className="w-20 h-20 rounded-[20px] border-4 border-blue-800"
                                    />
                                    <Text className="text-xl font-bold flex-wrap">{item.name}</Text>
                                </View>
                            </Link>
                        </View>
                    )}
                />
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push(`/addExercice/${query}`)}>
                <Text className="color-white text-2xl">+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 16,
        flexDirection: "row",
        gap: "3px",
    },

    addButton: {
        position: "absolute",
        bottom: 50,
        right: 20,
        backgroundColor: "#007AFF",
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