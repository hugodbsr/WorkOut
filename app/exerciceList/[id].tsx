import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
        <View style={{ flex: 1 }}>
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
                                <Text
                                className="text-xl font-bold flex-wrap">
                                    {item.name}
                                </Text>
                            </View>
                            </Link>
                        </View>
                    )}
                />
            </View>

            <View style={{ flex: 0.1 }} className="flex justify-end flex-row">
                <TouchableOpacity style={styles.addButton}>
                    <Text className="color-white text-4xl">+</Text>
                </TouchableOpacity>
            </View>
        </View>
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
        position: 'absolute',
        bottom: 75,
        right: 20,
        backgroundColor: '#007AFF',
        width: 80,
        height: 80,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },});