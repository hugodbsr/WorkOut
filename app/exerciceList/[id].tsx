import {ActivityIndicator, FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {Link, useLocalSearchParams, useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExercice, fetchExerciceList, fetchMuscle} from "@/services/api";
import {Image} from "expo-image";
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
    } = useFetch(() => fetchMuscle({query: `${id}`}));

    const {
        data: exercice,
        loading: exerciceLoading,
        error: exerciceError,
    } = useFetch(() => fetchExerciceList({ query }));

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
        <View style={styles.container}>
            <FlatList
                data={exercice}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="justify-around gap-2">
                        <Link href={`/exercice/${item.id}`}>
                        <View className="items-center flex flex-row gap-5 mb-5">
                            <Image
                                className="border-4 border-blue-800"
                                source={{ uri: item.image }}
                                style={{width: 80, height: 80, borderRadius: 30}}
                                contentFit="cover"
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
    }});