import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExercice, fetchExerciceList} from "@/services/api";
import {id} from "postcss-selector-parser";

export default function Details(){
    const{id} = useLocalSearchParams();

    const {
        data: exercice,
        loading: exerciceLoading,
        error: exerciceError,
    } = useFetch(() => fetchExercice({query: `${id}`}));

    if (exerciceLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exerciceError) {
        return <Text>Error : {exerciceError?.message}</Text>;
    }

    return (
        <View>
            <Text>{exercice?.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({})