import {ActivityIndicator, FlatList, StyleSheet, Text, View} from "react-native";
import React from 'react'
import {Link, useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchMuscleList} from "@/services/api";
import {Image, ImageBackground} from "expo-image";

export default function Add(){
    const router = useRouter();

    const {
        data: exercice,
        loading: exerciceLoading,
        error: exerciceError,
    } = useFetch(fetchMuscleList);

    if (exerciceLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exerciceError) {
        return <Text>Error : {exerciceError?.message}</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                className="m-4"
                data={exercice}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Link href={`/exerciceList/${item.id}`}
                    className="p-4 mt-6 text-center text-2xl bg-primary color-white"
                    style={{borderRadius: 10}}>
                        {item.name}
                    </Link>
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

