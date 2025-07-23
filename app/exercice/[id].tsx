import {ActivityIndicator, StyleSheet, Text, View, TextInput, Button, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExercice, fetchExerciceList} from "@/services/api";
import {id} from "postcss-selector-parser";
import {addSessionToExercise} from "@/services/storage";

export default function Details(){
    const{id} = useLocalSearchParams();

    const {
        data: exercice,
        loading: exerciceLoading,
        error: exerciceError,
    } = useFetch(() => fetchExercice({query: `${id}`}));

    const [series, setSeries] = useState([{reps:'', weight:''}]);

    const [savedIndexes, setSavedIndexes] = useState<number[]>([]);

    const handleAddSerieField = () => {
        setSeries([...series, { reps: '', weight: '' }]);
    };

    const handleChangeSerie = async (index: number, field: 'reps' | 'weight', value: string) => {
        const updated = [...series];
        updated[index][field] = value;
        setSeries(updated);

        const current = updated[index];

        const isComplete = current.reps !== '' && current.weight !== '';
        const notAlreadySaved = !savedIndexes.includes(index);

        if (isComplete && notAlreadySaved) {
            await addSessionToExercise(Number(id), [{
                reps: parseInt(current.reps, 10),
                weight: parseFloat(current.weight),
            }]);
            setSavedIndexes([...savedIndexes, index]);
        }
    };


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
                    <Text className="text-xl">Serie {index+1} : </Text>
                    <TextInput
                        value={serie.reps}
                        style={styles.textInput}
                        onChangeText={(text) => handleChangeSerie(index, 'reps', text)}
                        keyboardType="numeric"
                        placeholder="10"
                    />
                    <Text className="text-sm"> X </Text>
                    <TextInput
                        value={serie.weight}
                        style={styles.textInput}
                        onChangeText={(text) => handleChangeSerie(index, 'weight', text)}
                        keyboardType="numeric"
                        placeholder="50"
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