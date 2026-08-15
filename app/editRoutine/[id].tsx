import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Image } from "expo-image";
import { saveUserRoutine, deleteUserRoutine, getUserRoutines } from '@/services/storage';
import { fetchAllTranslatedExercises } from '@/services/api';
import { exerciseImages } from "@/src/constants/images";

export default function EditRoutine() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const navigation = useNavigation();
    
    const isEditing = id !== 'new';

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('Intermédiaire');
    const [duration, setDuration] = useState('45 min');
    const [exercises, setExercises] = useState<string[]>([]);

    // State for modal
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [allExercises, setAllExercises] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadRoutine = async () => {
            if (isEditing) {
                const routines = await getUserRoutines();
                const existing = routines.find(r => r.id === id);
                if (existing) {
                    setTitle(existing.title || '');
                    setDescription(existing.description || '');
                    setLevel(existing.level || '');
                    setDuration(existing.duration || '');
                    setExercises(existing.exercises || []);
                }
            }
        };
        const loadExercises = async () => {
            const list = await fetchAllTranslatedExercises();
            setAllExercises(list);
        };
        loadRoutine();
        loadExercises();
    }, [id]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl text-white italic">
                    {isEditing ? "Modifier le programme" : "Nouveau programme"}
                </Text>
            ),
        });
    }, [navigation, isEditing]);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert("Erreur", "Veuillez donner un titre au programme.");
            return;
        }

        const routineData = {
            id: isEditing ? id : `routine_user_${Date.now()}`,
            title: title.trim(),
            description: description.trim(),
            level: level.trim(),
            duration: duration.trim(),
            exercises,
            isCustom: true
        };

        await saveUserRoutine(routineData);
        router.back();
    };

    const handleDelete = () => {
        Alert.alert(
            "Supprimer le programme",
            "Voulez-vous vraiment supprimer ce programme ?",
            [
                { text: "Annuler", style: "cancel" },
                { 
                    text: "Supprimer", 
                    style: "destructive",
                    onPress: async () => {
                        await deleteUserRoutine(id as string);
                        router.back();
                    }
                }
            ]
        );
    };

    const handleAddExercise = (exerciseId: string) => {
        setExercises(prev => [...prev, exerciseId]);
        setShowExerciseModal(false);
    };

    const handleRemoveExercise = (indexToRemove: number) => {
        setExercises(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        setExercises(prev => {
            const copy = [...prev];
            const temp = copy[index - 1];
            copy[index - 1] = copy[index];
            copy[index] = temp;
            return copy;
        });
    };

    const handleMoveDown = (index: number) => {
        if (index === exercises.length - 1) return;
        setExercises(prev => {
            const copy = [...prev];
            const temp = copy[index + 1];
            copy[index + 1] = copy[index];
            copy[index] = temp;
            return copy;
        });
    };

    // Filter exercises for the modal
    const filteredExercises = allExercises.filter(ex => 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function getExerciseImage(name?: string) {
        if (!name) return undefined;
        if (name.startsWith('file://') || name.startsWith('http')) return name;
        try {
            if (exerciseImages[name as keyof typeof exerciseImages]) {
                return exerciseImages[name as keyof typeof exerciseImages];
            }
        } catch (error) {
            return undefined;
        }
        return undefined;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom', 'left', 'right']}>
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Formulaire de base */}
                <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6">
                    <Text className="text-gray-500 font-medium mb-1 ml-1">Titre du programme</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Ex: Pecs / Triceps"
                        className="bg-gray-50 px-4 py-3 rounded-2xl text-lg font-medium text-gray-800 border border-gray-200 mb-4"
                        placeholderTextColor="#9ca3af"
                    />

                    <Text className="text-gray-500 font-medium mb-1 ml-1">Description (Optionnelle)</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Ex: Séance de force..."
                        className="bg-gray-50 px-4 py-3 rounded-2xl text-base text-gray-800 border border-gray-200 mb-4"
                        placeholderTextColor="#9ca3af"
                        multiline
                    />

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-gray-500 font-medium mb-1 ml-1">Niveau</Text>
                            <TextInput
                                value={level}
                                onChangeText={setLevel}
                                placeholder="Débutant"
                                className="bg-gray-50 px-4 py-3 rounded-2xl text-base text-gray-800 border border-gray-200"
                                placeholderTextColor="#9ca3af"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-500 font-medium mb-1 ml-1">Durée</Text>
                            <TextInput
                                value={duration}
                                onChangeText={setDuration}
                                placeholder="1h15"
                                className="bg-gray-50 px-4 py-3 rounded-2xl text-base text-gray-800 border border-gray-200"
                                placeholderTextColor="#9ca3af"
                            />
                        </View>
                    </View>
                </View>

                {/* Liste des exercices */}
                <Text className="text-xl font-bold text-gray-800 mb-3 ml-2">Exercices ({exercises.length})</Text>
                
                {exercises.map((exId, index) => {
                    const exData = allExercises.find(e => e.id.toString() === exId.toString());
                    if (!exData) return null;

                    return (
                        <View key={`${exId}-${index}`} className="bg-white p-3 mb-2 rounded-2xl shadow-sm flex-row items-center border border-gray-100">
                            <View className="flex-col items-center mr-2">
                                <TouchableOpacity onPress={() => handleMoveUp(index)} disabled={index === 0} className="p-1">
                                    <Feather name="chevron-up" size={20} color={index === 0 ? "#e5e7eb" : "#6b7280"} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleMoveDown(index)} disabled={index === exercises.length - 1} className="p-1">
                                    <Feather name="chevron-down" size={20} color={index === exercises.length - 1 ? "#e5e7eb" : "#6b7280"} />
                                </TouchableOpacity>
                            </View>

                            <View className="bg-gray-50 rounded-full w-12 h-12 items-center justify-center mr-3 relative">
                                {exData.iconName ? (
                                    <Feather name={exData.iconName} size={20} color="#3456AD" />
                                ) : (
                                    <Image source={getExerciseImage(exData.image)} style={{ width: 40, height: 40, borderRadius: 20 }} />
                                )}
                                <View className="absolute -top-1 -right-1 bg-orange-500 w-5 h-5 rounded-full items-center justify-center border-2 border-white">
                                    <Text className="text-white text-[10px] font-bold">{index + 1}</Text>
                                </View>
                            </View>

                            <Text className="flex-1 font-bold text-gray-800 text-base" numberOfLines={2}>{exData.name}</Text>

                            <TouchableOpacity onPress={() => handleRemoveExercise(index)} className="p-3 ml-2 bg-red-50 rounded-xl">
                                <Feather name="trash-2" size={18} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    );
                })}

                <TouchableOpacity 
                    onPress={() => setShowExerciseModal(true)}
                    className="bg-orange-50 mt-2 p-4 rounded-2xl flex-row items-center justify-center border border-orange-100 border-dashed"
                >
                    <Feather name="plus-circle" size={20} color="#f97316" />
                    <Text className="text-[#f97316] font-bold text-lg ml-2">Ajouter un exercice</Text>
                </TouchableOpacity>

                {isEditing && (
                    <TouchableOpacity onPress={handleDelete} className="mt-8 mb-4">
                        <Text className="text-red-500 font-bold text-center text-lg">Supprimer le programme</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <View className="absolute bottom-12 left-0 right-0 px-4">
                <TouchableOpacity 
                    onPress={handleSave}
                    className="bg-[#3456AD] py-4 rounded-2xl shadow-md items-center"
                    activeOpacity={0.8}
                >
                    <Text className="text-white font-bold text-lg">Enregistrer</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de sélection d'exercice */}
            <Modal visible={showExerciseModal} animationType="slide" presentationStyle="pageSheet">
                <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                        <Text className="font-bold text-xl text-gray-800">Choisir un exercice</Text>
                        <TouchableOpacity onPress={() => setShowExerciseModal(false)} className="p-2 bg-gray-100 rounded-full">
                            <Feather name="x" size={20} color="#4b5563" />
                        </TouchableOpacity>
                    </View>
                    
                    <View className="p-4 bg-white border-b border-gray-100">
                        <View className="flex-row items-center bg-gray-100 px-3 py-2.5 rounded-xl">
                            <Feather name="search" size={20} color="#9ca3af" />
                            <TextInput
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Rechercher..."
                                className="flex-1 ml-2 text-base text-gray-800"
                                placeholderTextColor="#9ca3af"
                                autoFocus
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Feather name="x-circle" size={18} color="#9ca3af" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <FlatList
                        data={filteredExercises}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                onPress={() => handleAddExercise(item.id)}
                                className="px-4 py-3 flex-row items-center border-b border-gray-50 active:bg-gray-50"
                            >
                                <View className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-3 overflow-hidden">
                                    {item.iconName ? (
                                        <Feather name={item.iconName} size={18} color="#3456AD" />
                                    ) : (
                                        <Image source={getExerciseImage(item.image)} style={{ width: 30, height: 30, borderRadius: 15 }} />
                                    )}
                                </View>
                                <Text className="text-base font-medium text-gray-800 flex-1">{item.name}</Text>
                                <Feather name="plus" size={20} color="#3456AD" />
                            </TouchableOpacity>
                        )}
                        initialNumToRender={20}
                    />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}
