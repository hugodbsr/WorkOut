import {ActivityIndicator, StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExercice, fetchExerciceList} from "@/services/api";
import {id} from "postcss-selector-parser";
import {addSessionToExercise, deleteSessionOfExercice, getExerciseHistory, Set, getTodayDate} from "@/services/storage";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useNavigation } from '@react-navigation/native';

export default function Details(){
    const navigation = useNavigation();

    const{id} = useLocalSearchParams();

    const {
        data: exercice,
        loading: exerciceLoading,
        error: exerciceError,
    } = useFetch(() => fetchExercice({query: `${id}`}));

    const [series, setSeries] = useState([{reps:'', weight:''}]);

    const handleAddSerieField = () => {
        setSeries([...series, { reps: '', weight: '' }]);
    };

    const handleChangeSerie = async (index: number, field: 'reps' | 'weight', value: string) => {
        const updated = [...series];
        updated[index][field] = value;
        setSeries(updated);

        const current = updated[index];
        const isComplete = current.reps !== '' && current.weight !== '';

        if (isComplete) {
            await addSessionToExercise(Number(id), index,{
                reps: parseInt(current.reps, 10),
                weight: parseFloat(current.weight),
            });
        }
    };

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
                    <Text className="font-bold text-xl">{exercice.name}</Text>
                ),
            });
        }
    }, [navigation, exercice]);

    useEffect(() => {
        const getHistory = async () => {
            const history = await getExerciseHistory(Number(id));
            if(history && history.sessions){
                if (history.sessions.length > 0) {
                    const lastSession = history.sessions[history.sessions.length - 1].sets;
                    const lastSeries = lastSession.map(set=>({
                        reps: set.reps.toString(),
                        weight: set.weight.toString(),
                    }))
                    setSeries(lastSeries);
                }
            }
        };
        getHistory();
    }, [id]);


    if (exerciceLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exerciceError) {
        return <Text>Error : {exerciceError?.message}</Text>;
    }

    const renderLeftActions = (index : number) => {
        return(
            <View className="mt-1 mb-1" style={styles.view}>
                <Button title="Supprimer" color="firebrick" onPress={() => handleDeleteSerieField(index)}/>
            </View>
        )
    }

    return (
        <ScrollView className="bg-white">
            <Text className="text-3xl m-4 font-bold flex-wrap text-center">Série effectué aujourd&#39;hui</Text>
            {series.map((serie, index) => (
                <Swipeable key={index}  renderLeftActions={()=> renderLeftActions(index)}>
                    <View key={index} className="p-2 mt-1 mb-1" style={styles.view}>
                        <Text className="text-xl">Serie {index+1} : </Text>
                        <TextInput
                            value={serie.reps}
                            style={styles.textInput}
                            onChangeText={(text) => handleChangeSerie(index, 'reps', text)}
                            keyboardType="numeric"
                            placeholder="10"
                            placeholderTextColor={'gray'}
                        />
                        <Text className="text-sm"> X </Text>
                        <TextInput
                            value={serie.weight}
                            style={styles.textInput}
                            onChangeText={(text) => handleChangeSerie(index, 'weight', text)}
                            keyboardType="numeric"
                            placeholder="50"
                            placeholderTextColor={'gray'}
                        />
                        <Text className="text-sm"> Kg </Text>
                    </View>
                </Swipeable>
            ))}
            <Button title="Ajouter une série" onPress={handleAddSerieField} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    textInput: {
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 5,
        width: 100,
        fontSize: 18,
        borderColor: "blue",
    },
    view: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white"
    },
    deleteButton: {
        backgroundColor: 'firebrick',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        marginVertical: 8,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

})