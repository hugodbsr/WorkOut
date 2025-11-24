import {Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useLayoutEffect, useMemo, useState} from 'react'
import {useNavigation} from "@react-navigation/native";
import {useLocalSearchParams, useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExerciseTypeJson, fetchMuscleJsonList} from "@/services/api";
import DropDownPicker from 'react-native-dropdown-picker';
import { Checkbox } from 'expo-checkbox';
import {addUserExercice} from "@/services/storage";
import { nanoid } from 'nanoid/non-secure';
import { getUITranslation } from "@/services/translation";

const uiAddExercice = getUITranslation("add_exercice");
const uiExerciseName = getUITranslation("exercise_name");
const uiExerciseDesc = getUITranslation("exercise_desc");
const uiMuscleUsed = getUITranslation("muscle_used");
const uiExerciseType = getUITranslation("exercise_type");
const uiSelectMuscle = getUITranslation("select_muscle");
const uiSelectType = getUITranslation("select_type");
const uiUnilateral = getUITranslation("unilateral");
const uiAddExerciceButton = getUITranslation("add_exercice_button");
const uiFillAllFields = getUITranslation("fill_all_fields");

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
            alert(uiFillAllFields || "Veuillez remplir tous les champs")
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
                <Text className="text-xl">{uiAddExercice}</Text>
            ),
        });
    }, [navigation]);

    const [isUnilateral, setIsUnilateral] = useState(false);

    return (
        <View className="flex-1">
            <View className="flex-1 mt-5 ml-5 px-4 flex-col gap-1.5">

                <Text className="text-xl font-normal">{uiExerciseName}</Text>
                <TextInput
                    className="border-solid border-4 border-[#3456AD] rounded-md w-11/12 border-primary p-0.5 text-xl text-left mb-2.5"
                    keyboardType="default"
                    onChangeText={setExerciceName}
                />

                <Text className="text-xl font-normal">{uiExerciseDesc}</Text>
                <TextInput
                    className="border-solid border-4 border-[#3456AD] rounded-md w-11/12 border-primary p-0.5 text-xl text-left mb-2.5"
                    keyboardType="default"
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    onChangeText={setExerciceDesc}
                />

                <Text className="text-xl font-normal">{uiMuscleUsed}</Text>
                <DropDownPicker
                    open={muscleOpen}
                    value={selectedMuscle}
                    items={formattedDataMuscle}
                    setOpen={setMuscleOpen}
                    setValue={setSelectedMuscle}
                    placeholder={uiSelectMuscle}
                    zIndex={3000}
                    zIndexInverse={1000}
                    style={{
                      height: 50,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      backgroundColor: "white",
                    }}
                    containerStyle={{
                        width: '91.666667%',
                        marginBottom: 10,
                    }}
                    dropDownContainerStyle={{backgroundColor: 'white'}}
                />

                <Text className="text-xl font-normal">{uiExerciseType}</Text>
                <DropDownPicker
                    multiple={true}
                    open={typeOpen}
                    value={selectedType}
                    items={formattedDataType}
                    setOpen={setTypeOpen}
                    setValue={setSelectedType}
                    placeholder={uiSelectType}
                    zIndex={2000}
                    zIndexInverse={2000}
                    style={{
                      height: 50,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      backgroundColor: "white",
                    }}
                    containerStyle={{
                        width: '91.666667%',
                        marginBottom: 10,
                    }}
                    dropDownContainerStyle={{backgroundColor: 'white'}}
                />

                <View className="flex-row items-center gap-2 mt-2">
                    <Text className="text-xl">{uiUnilateral}</Text>
                    <Checkbox
                        className="p-4"
                        value={isUnilateral}
                        onValueChange={setIsUnilateral}
                        color={isUnilateral ? '#3456AD' : undefined}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleConfirmExercice}
                    className="items-center bg-primary rounded-xl p-3 w-11/12 ml-auto mr-auto mt-auto mb-20">
                    <Text className="color-white text-2xl">{uiAddExerciceButton}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}