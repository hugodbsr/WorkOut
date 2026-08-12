import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View , Alert } from 'react-native';
import React, { useCallback, useLayoutEffect, useState, useMemo } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect, useLocalSearchParams, useRouter , useNavigation } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchExerciseListJson, fetchMuscleJson, fetchExerciseTypeJson, fetchTrackingModesJson } from "@/services/api";
import { exerciseImages } from "@/src/constants/images";
import { Image } from "expo-image";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useBannerActive } from "@/app/context/TimerContext";

import { deleteUserExercise, getAllExerciseHistory } from '@/services/storage';

export default function Details() {
    const navigation = useNavigation();

    const router = useRouter();

    const bannerActive = useBannerActive();
    
    const bannerGap = bannerActive ? 52 : 0;

    const { id } = useLocalSearchParams();
    const query = Array.isArray(id) ? id[0] : id;

    const {
        data: group,
        loading: groupLoading,
        error: groupError,
    } = useFetch(() => fetchMuscleJson({ query: `${id}` }));

    const {
        data: exercises,
        loading: exercisesLoading,
        error: exercisesError,
        refetch,
    } = useFetch(() => fetchExerciseListJson({ query }));

    useFocusEffect(
        useCallback(() => {
            if (refetch) {
                refetch();
            }
            const fetchHistory = async () => {
                const history = await getAllExerciseHistory();
                setExerciseHistory(history);
            };
            fetchHistory();
        }, [refetch])
    );

    const { data: exerciseTypes } = useFetch(fetchExerciseTypeJson);
    const { data: trackingModes } = useFetch(fetchTrackingModesJson);

    const [exerciseHistory, setExerciseHistory] = useState<any>({});

    const [selectedType, setSelectedType] = useState<string | number | null>(null);
    const [selectedTrackingMode, setSelectedTrackingMode] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState<string | null>("");

    const [typeOpen, setTypeOpen] = useState(false);
    const [modeOpen, setModeOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const sortItems = [
        { label: "Défaut", value: "" },
        { label: "Récents", value: "recent" },
        { label: "A - Z", value: "az" },
        { label: "Z - A", value: "za" },
    ];

    const typeItems = useMemo(() => {
        if (!exercises || !exerciseTypes) return [];
        const usedTypeKeys = new Set(exercises.map((ex: any) => ex.exerciseTypeKey?.toString()));
        const filtered = exerciseTypes.filter((type: any) => usedTypeKeys.has(type.id.toString()));
        return [
            { label: "Toutes", value: "" },
            ...filtered.map((t: any) => ({ label: t.name, value: t.id }))
        ];
    }, [exercises, exerciseTypes]);

    const modeItems = useMemo(() => {
        if (!exercises || !trackingModes) return [];
        const usedModes = new Set(exercises.map((ex: any) => ex.trackingMode));
        const filtered = trackingModes.filter((mode: any) => usedModes.has(mode.value));
        return [
            { label: "Tous", value: "" },
            ...filtered
        ];
    }, [exercises, trackingModes]);

    const onTypeOpen = useCallback(() => {
        setModeOpen(false);
        setSortOpen(false);
    }, []);

    const onModeOpen = useCallback(() => {
        setTypeOpen(false);
        setSortOpen(false);
    }, []);

    const onSortOpen = useCallback(() => {
        setTypeOpen(false);
        setModeOpen(false);
    }, []);

    const filteredExercises = useMemo(() => {
        if (!exercises) return [];
        let result = exercises.filter((ex: any) => {
            if (selectedType && ex.exerciseTypeKey?.toString() !== selectedType.toString()) return false;
            if (selectedTrackingMode && ex.trackingMode !== selectedTrackingMode) return false;
            return true;
        });

        if (selectedSort === "az") {
            result.sort((a: any, b: any) => a.name.localeCompare(b.name));
        } else if (selectedSort === "za") {
            result.sort((a: any, b: any) => b.name.localeCompare(a.name));
        } else if (selectedSort === "recent") {
            result.sort((a: any, b: any) => {
                const historyA = exerciseHistory[a.id]?.sessions || [];
                const historyB = exerciseHistory[b.id]?.sessions || [];
                
                const dateA = historyA.length > 0 ? Math.max(...historyA.map((s:any) => new Date(s.date).getTime())) : 0;
                const dateB = historyB.length > 0 ? Math.max(...historyB.map((s:any) => new Date(s.date).getTime())) : 0;
                
                return dateB - dateA;
            });
        }

        return result;
    }, [exercises, selectedType, selectedTrackingMode, selectedSort, exerciseHistory]);

    useLayoutEffect(() => {
        if (group) {
            navigation.setOptions({
                headerTitle: () => (
                    <Text className="font-bold text-xl text-white italic">{group.name}</Text>
                ),
            });
        }
    }, [navigation, group]);

    if (exercisesLoading || groupLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <ActivityIndicator size="large" color="#3456AD" />
            </SafeAreaView>
        );
    }

    if (exercisesError || groupError) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <Text className="text-red-500 font-medium">Error : {exercisesError?.message}</Text>
            </SafeAreaView>
        );
    }

    function getExerciseImage(name: string) {
        if (!name) return undefined;
        if (name.startsWith('file://') || name.startsWith('http')) {
            return name;
        }
        try {
            if (exerciseImages[name as keyof typeof exerciseImages]) {
                return exerciseImages[name as keyof typeof exerciseImages];
            } else {
                return undefined;
            }
        } catch (error) {
            console.error("Erreur lors du chargement de l'image:", error);
            return undefined;
        }
    }

    const handleDelete = (exerciseId: string, exerciseName: string) => {
        Alert.alert(
            "Supprimer l'exercice",
            `Voulez-vous vraiment supprimer "${exerciseName}" ?`,
            [
                { text: "Annuler", style: "cancel" },
                { 
                    text: "Supprimer", 
                    style: "destructive",
                    onPress: async () => {
                        await deleteUserExercise(exerciseId);
                        refetch();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-gray-100" edges={['bottom', 'left', 'right']}>
            <View style={{ flex: 1 }}>
                <View style={{ paddingTop: 15 + bannerGap, paddingHorizontal: 16, zIndex: 1000, flexDirection: 'row', gap: 5, paddingBottom: 5 }}>
                    <View style={{ flex: 1, zIndex: 3000 }}>
                        <DropDownPicker
                            open={typeOpen}
                            value={selectedType}
                            items={typeItems}
                            setOpen={setTypeOpen}
                            setValue={setSelectedType}
                            onOpen={onTypeOpen}
                            placeholder="Type"
                            style={{ borderColor: '#d1d5db', borderRadius: 12, minHeight: 40, backgroundColor: 'white' }}
                            dropDownContainerStyle={{ borderColor: '#d1d5db', borderRadius: 12, backgroundColor: 'white' }}
                            textStyle={{ fontSize: 13, color: '#4b5563' }}
                            zIndex={3000}
                            zIndexInverse={1000}
                        />
                    </View>
                    <View style={{ flex: 1, zIndex: 2000 }}>
                        <DropDownPicker
                            open={modeOpen}
                            value={selectedTrackingMode}
                            items={modeItems}
                            setOpen={setModeOpen}
                            setValue={setSelectedTrackingMode}
                            onOpen={onModeOpen}
                            placeholder="Suivi"
                            style={{ borderColor: '#d1d5db', borderRadius: 12, minHeight: 40, backgroundColor: 'white' }}
                            dropDownContainerStyle={{ borderColor: '#d1d5db', borderRadius: 12, backgroundColor: 'white' }}
                            textStyle={{ fontSize: 13, color: '#4b5563' }}
                            zIndex={2000}
                            zIndexInverse={2000}
                        />
                    </View>
                    <View style={{ flex: 1, zIndex: 1000 }}>
                        <DropDownPicker
                            open={sortOpen}
                            value={selectedSort}
                            items={sortItems}
                            setOpen={setSortOpen}
                            setValue={setSelectedSort}
                            onOpen={onSortOpen}
                            placeholder="Tri"
                            style={{ borderColor: '#d1d5db', borderRadius: 12, minHeight: 40, backgroundColor: 'white' }}
                            dropDownContainerStyle={{ borderColor: '#d1d5db', borderRadius: 12, backgroundColor: 'white' }}
                            textStyle={{ fontSize: 13, color: '#4b5563' }}
                            zIndex={1000}
                            zIndexInverse={3000}
                        />
                    </View>
                </View>

                <FlatList
                    data={filteredExercises}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                    renderItem={({ item }) => {
                        const isCustom = isNaN(Number(item.id));
                        return (
                            <TouchableOpacity 
                                onPress={() => router.push(`/exercise/${item.id}`)}
                                className="bg-white mx-4 my-2 p-3 rounded-3xl flex-row items-center shadow-sm border border-gray-100"
                                activeOpacity={0.7}
                            >
                                <View className="bg-gray-50 rounded-full mr-4 p-1">
                                    <Image
                                        source={getExerciseImage(item.image)}
                                        style={{ width: 60, height: 60, borderRadius: 30 }}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-800" numberOfLines={2}>{item.name}</Text>
                                </View>
                                {isCustom ? (
                                    <TouchableOpacity 
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            router.push(`/editExercise/${item.id}`);
                                        }}
                                        className="p-2 mr-2"
                                    >
                                        <Feather name="edit-2" size={20} color="#9ca3af" />
                                    </TouchableOpacity>
                                ) : null}
                                <Feather name="chevron-right" size={24} color="#d1d5db" />
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            <TouchableOpacity
                style={styles.addButton}
                className="bg-[#3456AD]"
                activeOpacity={0.8}
                onPress={() => router.push(`/addExercise/${query}`)}>
                <Feather name="plus" size={32} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    addButton: {
        position: "absolute",
        bottom: 100, // Remonté pour ne pas être couvert par le bandeau timer
        right: 20,
        width: 65,
        height: 65,
        borderRadius: 32.5,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});