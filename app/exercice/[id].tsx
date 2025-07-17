import {ActivityIndicator, StyleSheet, Text, View, TextInput, Button} from 'react-native';
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

    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');

    const handleSave = async () => {
        if (!reps || !weight) return;

        await addSessionToExercise(Number(id), [
            {
                reps: parseInt(reps, 10),
                weight: parseFloat(weight),
            },
        ]);
    };

    if (exerciceLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exerciceError) {
        return <Text>Error : {exerciceError?.message}</Text>;
    }

    return (
        <View>
            <Text className="text-xl font-bold flex-wrap">{exercice?.name}</Text>
            <View className="flex-row items-center gap m-4">
                <Text className="text-xl"> Serie 1 : </Text>
                <TextInput
                    value={reps}
                    style={styles.textInput}
                    onChangeText={setReps}
                    keyboardType="numeric"
                    placeholder="10"
                />
                <Text className="text-sm"> X </Text>
                <TextInput
                    value={weight}
                    style={styles.textInput}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder="50"
                />
                <Text className="text-sm"> Kg </Text>
            </View>
            <Button title="Ajouter la série" onPress={handleSave} />
        </View>
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