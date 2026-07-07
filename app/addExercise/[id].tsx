import { Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from "react-native";
import React, { useLayoutEffect, useMemo, useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchExerciseTypeJson, fetchMuscleJsonList } from "@/services/api";
import DropDownPicker from 'react-native-dropdown-picker';
import { Checkbox } from 'expo-checkbox';
import { addUserExercise } from "@/services/storage";
import { nanoid } from 'nanoid/non-secure';
import { useUITranslation } from "@/services/useUITranslation";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function Details() {
    const navigation = useNavigation();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const query = Array.isArray(id) ? id[0] : id;

    const { data: type } = useFetch(() => fetchExerciseTypeJson());
    const { data: muscle } = useFetch(() => fetchMuscleJsonList());

    const [exerciseName, setExerciseName] = useState<string>();
    const [exerciseDesc, setExerciseDesc] = useState<string>();

    const uiAddExercise = useUITranslation("add_exercise", "Add an exercise");
    const uiExerciseName = useUITranslation("exercise_name", "Exercise's name");
    const uiExerciseDesc = useUITranslation("exercise_desc", "Exercise's description");
    const uiMuscleUsed = useUITranslation("muscle_used", "Muscle used");
    const uiExerciseType = useUITranslation("exercise_type", "Exercise's type");
    const uiSelectMuscle = useUITranslation("select_muscle", "Select a muscle");
    const uiSelectType = useUITranslation("select_type", "Select type(s)");
    const uiUnilateral = useUITranslation("unilateral", "Unilateral");
    const uiAddExerciseButton = useUITranslation("add_exercise_button", "Add");
    const uiFillAllFields = useUITranslation("fill_all_fields", "Please fill all fields");
    const [selectedMuscle, setSelectedMuscle] = useState(query || null);
    const [selectedType, setSelectedType] = useState([]);
    const [muscleOpen, setMuscleOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);
    const [isUnilateral, setIsUnilateral] = useState(false);

    const handleConfirmExercise = () => {
        if (!exerciseDesc || !exerciseName || !selectedMuscle) {
            Alert.alert("", uiFillAllFields || "Please fill all fields");
            return
        }
        const exerciseToAdd = {
            id: nanoid(),
            nameKey: exerciseName,
            descriptionKey: exerciseDesc,
            image: "cable_triceps_extension.gif",
            exerciseTypeKey: selectedType,
            muscleGroupId: selectedMuscle,
            createdByUser: true,
            unilateral: isUnilateral,
        }
        addUserExercise(exerciseToAdd);
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
                <Text className="text-xl font-semibold italic text-white">{uiAddExercise}</Text>
            ),
        });
    }, [navigation, uiAddExercise]);

    const dropdownStyle = {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f9fafb',
        minHeight: 50,
    };

    const dropdownContainerStyle = {
        width: '100%' as const,
        marginBottom: 4,
    };

    const dropdownListStyle = {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1 px-6 pt-4"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Nom de l'exercice */}
                <Text className="text-gray-700 text-base font-semibold mb-2 ml-1">{uiExerciseName}</Text>
                <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base mb-5"
                    placeholderTextColor="#9ca3af"
                    placeholder={uiExerciseName}
                    keyboardType="default"
                    onChangeText={setExerciseName}
                    value={exerciseName}
                />

                {/* Description */}
                <Text className="text-gray-700 text-base font-semibold mb-2 ml-1">{uiExerciseDesc}</Text>
                <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base mb-5"
                    placeholderTextColor="#9ca3af"
                    placeholder={uiExerciseDesc}
                    keyboardType="default"
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                    onChangeText={setExerciseDesc}
                    value={exerciseDesc}
                    style={{ minHeight: 80 }}
                />

                {/* Muscle sollicité */}
                <Text className="text-gray-700 text-base font-semibold mb-2 ml-1">{uiMuscleUsed}</Text>
                <DropDownPicker
                    listMode="SCROLLVIEW"
                    open={muscleOpen}
                    value={selectedMuscle}
                    items={formattedDataMuscle}
                    setOpen={setMuscleOpen}
                    setValue={setSelectedMuscle}
                    placeholder={uiSelectMuscle}
                    zIndex={3000}
                    zIndexInverse={1000}
                    style={dropdownStyle}
                    placeholderStyle={{ color: '#9ca3af' }}
                    containerStyle={dropdownContainerStyle}
                    dropDownContainerStyle={dropdownListStyle}
                    ArrowDownIconComponent={() => <Feather name="chevron-down" size={20} color="#6b7280" />}
                    ArrowUpIconComponent={() => <Feather name="chevron-up" size={20} color="#6b7280" />}
                    TickIconComponent={() => <Feather name="check" size={18} color="#3456AD" />}
                />

                {/* Type d'exercice */}
                <Text className="text-gray-700 text-base font-semibold mb-2 ml-1 mt-5">{uiExerciseType}</Text>
                <DropDownPicker
                    listMode="SCROLLVIEW"
                    multiple={true}
                    open={typeOpen}
                    value={selectedType}
                    items={formattedDataType}
                    setOpen={setTypeOpen}
                    setValue={setSelectedType}
                    placeholder={uiSelectType}
                    zIndex={2000}
                    zIndexInverse={2000}
                    style={dropdownStyle}
                    placeholderStyle={{ color: '#9ca3af' }}
                    containerStyle={dropdownContainerStyle}
                    dropDownContainerStyle={dropdownListStyle}
                    ArrowDownIconComponent={() => <Feather name="chevron-down" size={20} color="#6b7280" />}
                    ArrowUpIconComponent={() => <Feather name="chevron-up" size={20} color="#6b7280" />}
                    TickIconComponent={() => <Feather name="check" size={18} color="#3456AD" />}
                />

                {/* Unilatéral */}
                <TouchableOpacity
                    className="flex-row items-center mt-6 bg-gray-50 border border-gray-200 rounded-xl px-4 py-4"
                    activeOpacity={0.7}
                    onPress={() => setIsUnilateral(!isUnilateral)}
                >
                    <Checkbox
                        value={isUnilateral}
                        onValueChange={setIsUnilateral}
                        color={isUnilateral ? '#3456AD' : undefined}
                        style={{ borderColor: '#d1d5db', borderRadius: 6, width: 24, height: 24 }}
                    />
                    <Text className="text-gray-700 text-base font-semibold ml-3">{uiUnilateral}</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Bouton Ajouter */}
            <View className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-4 bg-white">
                <TouchableOpacity
                    onPress={handleConfirmExercise}
                    className="items-center bg-primary rounded-2xl py-4"
                    activeOpacity={0.8}
                >
                    <Text className="text-white text-xl font-bold">{uiAddExerciseButton}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}