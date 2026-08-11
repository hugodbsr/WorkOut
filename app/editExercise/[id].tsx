import { Text, TextInput, TouchableOpacity, View, ScrollView, Alert, ActivityIndicator } from "react-native";
import React, { useLayoutEffect, useMemo, useState, useEffect } from 'react'
import { useNavigation } from "expo-router";
import { useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchExerciseTypeJson, fetchMuscleJsonList, fetchExerciseJson } from "@/services/api";
import DropDownPicker from 'react-native-dropdown-picker';
import { Checkbox } from 'expo-checkbox';
import { updateUserExercise, deleteUserExercise } from "@/services/storage";
import { useUITranslation } from "@/services/useUITranslation";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { useBannerActive } from "@/app/context/TimerContext";

import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

export default function EditExercise() {
    const navigation = useNavigation();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const query = Array.isArray(id) ? id[0] : id;

    const bannerActive = useBannerActive();
    const bannerGap = bannerActive ? 52 : 0;

    const { data: type } = useFetch(() => fetchExerciseTypeJson());
    const { data: muscle } = useFetch(() => fetchMuscleJsonList());
    const { data: exerciseData, loading: exerciseLoading } = useFetch(() => fetchExerciseJson({ query }));

    const [exerciseName, setExerciseName] = useState<string>();
    const [exerciseDesc, setExerciseDesc] = useState<string>();
    const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string[]>([]);
    const [isUnilateral, setIsUnilateral] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);

    useEffect(() => {
        if (exerciseData) {
            setExerciseName(exerciseData.name);
            setExerciseDesc(exerciseData.description);
            setIsUnilateral(!!exerciseData.unilateral);
            
            // Set existing image if it's a URI or fallback
            if (exerciseData.image && (exerciseData.image.startsWith('file://') || exerciseData.image.startsWith('http'))) {
                setImageUri(exerciseData.image);
            }
        }
    }, [exerciseData]);

    const uiEditExercise = useUITranslation("edit_exercise", "Modifier l'exercice");
    const uiExerciseName = useUITranslation("exercise_name", "Exercise's name");
    const uiExerciseDesc = useUITranslation("exercise_desc", "Exercise's description");
    const uiMuscleUsed = useUITranslation("muscle_used", "Muscle used");
    const uiExerciseType = useUITranslation("exercise_type", "Exercise's type");
    const uiSelectMuscle = useUITranslation("select_muscle", "Select a muscle");
    const uiSelectType = useUITranslation("select_type", "Select type(s)");
    const uiUnilateral = useUITranslation("unilateral", "Unilateral");
    const uiEditExerciseButton = useUITranslation("edit", "Enregistrer");
    const uiDelete = useUITranslation("delete", "Supprimer");
    const uiFillAllFields = useUITranslation("fill_all_fields", "Please fill all fields");

    const [muscleOpen, setMuscleOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleConfirmExercise = async () => {
        if (!exerciseDesc || !exerciseName || !selectedMuscle) {
            Alert.alert("", uiFillAllFields || "Please fill all fields");
            return
        }
        const updatedData = {
            nameKey: exerciseName,
            descriptionKey: exerciseDesc,
            muscleGroupId: selectedMuscle,
            exerciseTypeKey: selectedType,
            unilateral: isUnilateral,
            ...(imageUri ? { image: imageUri } : {})
        }
        await updateUserExercise(query, updatedData);
        router.back();
    }

    const handleDelete = () => {
        Alert.alert(
            "Supprimer l'exercice",
            `Voulez-vous vraiment supprimer cet exercice ?`,
            [
                { text: "Annuler", style: "cancel" },
                { 
                    text: "Supprimer", 
                    style: "destructive",
                    onPress: async () => {
                        await deleteUserExercise(query);
                        router.back();
                    }
                }
            ]
        );
    };

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
                <Text className="font-bold text-xl text-white italic">{uiEditExercise}</Text>
            ),
        });
    }, [navigation, uiEditExercise]);

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

    if (exerciseLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#3456AD" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1 px-6"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 160, paddingTop: 15 + bannerGap }}
            >
                {/* Image de l'exercice */}
                <View className="items-center mb-8 mt-2">
                    <TouchableOpacity
                        onPress={pickImage}
                        className="bg-gray-50 border border-gray-200 items-center justify-center shadow-sm"
                        style={{ width: 100, height: 100, borderRadius: 50 }}
                        activeOpacity={0.8}
                    >
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                        ) : (
                            <View className="items-center">
                                <Feather name="camera" size={32} color="#9ca3af" />
                            </View>
                        )}
                        <View className="absolute bottom-0 right-0 bg-[#3456AD] rounded-full p-2 border-2 border-white shadow-sm">
                            <Feather name="edit-2" size={14} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>

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
                <View className="flex-row flex-wrap mt-1">
                    {formattedDataMuscle.map((item) => (
                        <TouchableOpacity
                            key={item.value}
                            onPress={() => setSelectedMuscle(item.value)}
                            activeOpacity={0.7}
                            className={`px-4 py-2 mr-2 mb-3 rounded-full border ${
                                selectedMuscle === item.value
                                    ? 'bg-[#3456AD] border-[#3456AD]'
                                    : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                            <Text className={`font-medium ${
                                selectedMuscle === item.value ? 'text-white' : 'text-gray-600'
                            }`}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Type d'exercice */}
                <Text className="text-gray-700 text-base font-semibold mb-2 ml-1 mt-5">{uiExerciseType}</Text>
                <View className="flex-row flex-wrap mt-1">
                    {formattedDataType.map((item) => {
                        const isSelected = selectedType.includes(item.value);
                        return (
                            <TouchableOpacity
                                key={item.value}
                                onPress={() => {
                                    if (isSelected) {
                                        setSelectedType(selectedType.filter(val => val !== item.value));
                                    } else {
                                        setSelectedType([...selectedType, item.value]);
                                    }
                                }}
                                activeOpacity={0.7}
                                className={`px-4 py-2 mr-2 mb-3 rounded-full border ${
                                    isSelected
                                        ? 'bg-[#3456AD] border-[#3456AD]'
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                                <Text className={`font-medium ${
                                    isSelected ? 'text-white' : 'text-gray-600'
                                }`}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Unilatéral */}
                <TouchableOpacity
                    className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 mb-10 mt-5"
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

                {/* Boutons d'action */}
                <View className="flex-row justify-between mb-6 shadow-sm">
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="items-center bg-red-500 rounded-2xl py-4 flex-1 mr-2"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-lg font-bold">{uiDelete}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleConfirmExercise}
                        className="items-center bg-[#3456AD] rounded-2xl py-4 flex-1 ml-2"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-lg font-bold">{uiEditExerciseButton}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}