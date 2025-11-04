import {ActivityIndicator, StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExerciseJson} from "@/services/api";
import {deleteSessionOfExercice, getExerciseHistory} from "@/services/storage";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useNavigation } from '@react-navigation/native';

type Serie = {
    reps: string;
    weight: string;
    date: string;
};

export default function RecordScreen(){
    const {id} = useLocalSearchParams();
    const navigation = useNavigation();

    const {
        data: exercice,
        loading: exerciceLoading,
        error: exerciceError,
    } = useFetch(() => fetchExerciseJson({query: `${id}`}));

    const [series, setSeries] = useState<Serie[]>([]);

    // 🔹 Modification
    const handleChangeSerie = (index: number, field: 'reps' | 'weight', value: string) => {
        const updated = [...series];
        updated[index][field] = value;
        setSeries(updated);
    };

    // 🔹 Suppression
    const handleDeleteSerieField = async (index: number) => {
        const updatedSeries = [...series];
        const removed = updatedSeries.splice(index, 1)[0];
        setSeries(updatedSeries);

        const wasComplete = removed.reps !== '' && removed.weight !== '';

        if (wasComplete) {
            try {
                await deleteSessionOfExercice(Number(id), index);
            } catch (e) {
                console.warn("Erreur lors de la suppression du stockage", e);
            }
        }
    };

    useLayoutEffect(() => {
        if(exercice){
            navigation.setOptions({
                headerTitle: () => (
                    <Text className="font-bold text-xl">{exercice.name} - Records</Text>
                ),
            });
        }
    }, [navigation, exercice]);

    useEffect(() => {
        const getHistory = async () => {
            const history = await getExerciseHistory(Number(id));
            if (!history || !history.sessions) return;

            const allSeries: Serie[] = history.sessions.flatMap(s =>
                s.sets.map(set => ({
                    reps: set.reps.toString(),
                    weight: set.weight.toString(),
                    date: s.date,
                }))
            );

            setSeries(allSeries);
        };

        getHistory();
    }, [id]);

    if (exerciceLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exerciceError) {
        return <Text>Error : {exerciceError?.message}</Text>;
    }

    const renderRightActions = (index : number) => {
        return(
            <View style={styles.viewDeleteButton}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteSerieField(index)}>
                    <Text className="color-white text-3xl">-</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <ScrollView className="bg-white" contentContainerStyle={{ paddingBottom: 50 }}>
                    <Text className="text-3xl m-4 font-bold flex-wrap text-center">
                        Historique de l&#39;exercice
                    </Text>

                    {/* 🔹 Message si aucune donnée */}
                    {series.length === 0 ? (
                        <Text style={styles.noDataText}>Aucune donnée pour cet exercice</Text>
                    ) : (
                        series.map((serie, index) => (
                            <Swipeable key={index} renderRightActions={() => renderRightActions(index)}>
                                <View className="items-center py-2 my-1">
                                    <Text style={styles.dateText}>{serie.date}</Text>
                                    <View className="h-1 w-3/4 bg-primary my-2" />
                                    <View key={index} className="p-3" style={styles.view}>
                                        <Text style={styles.text}>Série n°{index + 1} : </Text>
                                        <TextInput
                                            value={serie.reps}
                                            style={styles.textInput}
                                            onChangeText={(text) => handleChangeSerie(index, 'reps', text)}
                                            keyboardType="numeric"
                                        />
                                        <Text style={styles.text}> X </Text>
                                        <TextInput
                                            value={serie.weight}
                                            style={styles.textInput}
                                            onChangeText={(text) => handleChangeSerie(index, 'weight', text)}
                                            keyboardType="numeric"
                                        />
                                        <Text style={styles.text}> Kg </Text>
                                    </View>
                                </View>
                            </Swipeable>
                        ))
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    noDataText: {
        fontSize: 18,
        color: "gray",
        textAlign: "center",
        marginTop: 30,
    },
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
    },
    dateText: {
        fontSize: 22,
        color: "black",
        marginRight: 10,
    },
    textInput: {
        borderWidth: 2,
        borderRadius: 5,
        width: 70,
        borderColor: "blue",
        padding: 2,
        fontSize: 20,
        textAlign: "center",
    },
    view: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: 5,
    },
    viewDeleteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    deleteButton: {
        backgroundColor: "firebrick",
        borderRadius: 60,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
