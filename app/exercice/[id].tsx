import {ActivityIndicator, StyleSheet, Text, View, TextInput, Button, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExercice, fetchExerciceList} from "@/services/api";
import {id} from "postcss-selector-parser";
import {addSessionToExercise, deleteSessionOfExercice, getExerciseHistory, Set} from "@/services/storage";

export default function Details(){
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
        await deleteSessionOfExercice(Number(id), index)
        const history = await getExerciseHistory(Number(id));
        if (history && history.sessions.length > 0) {
            const lastSession = history.sessions[history.sessions.length - 1].sets;
            setSeries(lastSession.map(set => ({
                reps: set.reps.toString(),
                weight: set.weight.toString(),
            })));
        }
    }

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

    return (
        <ScrollView>
            <Text className="text-xl font-bold flex-wrap">{exercice?.name}</Text>
            {series.map((serie, index) => (
                <View key={index} className="flex-row items-center gap m-4">
                    <Button title="X" color="firebrick" onPress={() => handleDeleteSerieField(index)}/>
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
})