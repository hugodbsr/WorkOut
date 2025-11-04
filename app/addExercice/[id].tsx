import {Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useLayoutEffect, useMemo, useState} from 'react'
import {useNavigation} from "@react-navigation/native";
import {useLocalSearchParams, useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExerciseTypeJson, fetchMuscleJsonList} from "@/services/api";
import DropDownPicker from 'react-native-dropdown-picker';
import { Checkbox } from 'expo-checkbox';
import {addUserExercice} from "@/services/storage";
import { nanoid } from 'nanoid/non-secure';

export default function Details() {
    const navigation = useNavigation();
    const router = useRouter();
    const {id} = useLocalSearchParams();
    const query = Array.isArray(id) ? id[0] : id;

    const { data: type } = useFetch(() => fetchExerciseTypeJson());
    const { data: muscle } = useFetch(() => fetchMuscleJsonList());

    const [exerciceName, setExerciceName] = useState<string>();
    const [exerciceDesc, setExerciceDesc] = useState<string>();
    const [selectedMuscle, setSelectedMuscle] = useState(query || null);
    const [selectedType, setSelectedType] = useState([]);
    const [muscleOpen, setMuscleOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);

    const handleConfirmExercice= () =>{
        if(!exerciceDesc || !exerciceName || !selectedMuscle){
            alert("Veuillez remplir tous les champs")
            return
        }
        const exerciceToAdd = {
            id: nanoid(),
            nameKey: exerciceName,
            descriptionKey: exerciceDesc,
            image: "cable_triceps_extension.gif",
            exerciseTypeKey: selectedType,
            muscleGroupId: selectedMuscle,
            createdByUser: true,
            unilateral: isUnilateral,
        }
        addUserExercice(exerciceToAdd);
        router.back();
    }

    const formattedDataMuscle = useMemo(() => {
        if (!muscle) return [];
        return muscle.map(item => ({
            label: item.name.toString(),
            value: item.id.toString(),
        }));
    }, [muscle]);

    const formattedDataType = useMemo(() => {
        if (!type) return [];
        return type.map(item => ({
            label: item.name.toString(),
            value: item.id.toString(),
        }));
    }, [type]);


    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="text-xl">Ajouter un exercice</Text>
            ),
        });
    }, [navigation]);

    const [isUnilateral, setIsUnilateral] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.text}>Exercise&#39;s name</Text>
                <TextInput style={styles.textInput} keyboardType="default" onChangeText={setExerciceName} />

                <Text style={styles.text}>Exercise&#39;s description</Text>
                <TextInput
                    style={styles.textInput}
                    keyboardType="default"
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    onChangeText={setExerciceDesc}
                />

                <Text style={styles.text}>Muscle Used</Text>
                <DropDownPicker
                    open={muscleOpen}
                    value={selectedMuscle}
                    items={formattedDataMuscle}
                    setOpen={setMuscleOpen}
                    setValue={setSelectedMuscle}
                    placeholder="Select a muscle"
                    zIndex={3000}
                    zIndexInverse={1000}
                    style={styles.dropdown}
                    dropDownContainerStyle={{backgroundColor: 'white'}}
                />

                <Text style={styles.text}>Exercise&#39;s type</Text>
                <DropDownPicker
                    multiple={true}
                    open={typeOpen}
                    value={selectedType}
                    items={formattedDataType}
                    setOpen={setTypeOpen}
                    setValue={setSelectedType}
                    placeholder="Select type(s)"
                    zIndex={2000}
                    zIndexInverse={2000}
                    style={styles.dropdown}
                    dropDownContainerStyle={{backgroundColor: 'white'}}
                />

                <View className="flex-row items-center gap-2 mt-2">
                    <Text className="text-xl">Unilatéral</Text>
                    <Checkbox
                        className="p-4"
                        value={isUnilateral}
                        onValueChange={setIsUnilateral}
                        color={isUnilateral ? '#3456AD' : undefined}
                    />
                </View>

                <TouchableOpacity onPress={handleConfirmExercice}
                    className="items-center bg-primary rounded-xl p-3 w-11/12 ml-auto mr-auto mt-auto mb-20">
                    <Text className="color-white text-2xl">Add exercice</Text>
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
        marginLeft: 20,
        paddingHorizontal: 16,
        flexDirection: "column",
        gap: 3,
    },
    text: {
        fontSize: 20,
        fontWeight: "400",
    },
    textInput: {
        borderStyle: "solid",
        borderWidth: 4,
        borderRadius: 5,
        width: "91.666667%",
        borderColor: "#3456AD",
        padding: 2,
        fontSize: 22,
        textAlign: "left",
        marginBottom: 10,
    },
    dropdown: {
        height: 50,
        width: "91.666667%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: "white",
        marginBottom: 10,
    },
});
