import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, useRouter, useNavigation, useFocusEffect } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchRoutineJson, fetchExerciseJson } from "@/services/api";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Image } from "expo-image";
import { exerciseImages } from "@/src/constants/images";
import { useBannerActive } from "@/app/context/TimerContext";
import { getRoutineForDay, getTodayDate, getAllExerciseHistory, saveRoutineForDay, saveUserRoutine, getUserRoutines } from "@/services/storage";

export default function RoutineDetails() {
    const router = useRouter();
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const query = Array.isArray(id) ? id[0] : id;

    const bannerActive = useBannerActive();
    const bannerGap = bannerActive ? 52 : 0;

    const {
        data: routine,
        loading: routineLoading,
        error: routineError,
        refetch,
    } = useFetch(() => fetchRoutineJson({ query }));

    useFocusEffect(
        useCallback(() => {
            if (refetch) refetch();
            
            const loadRoutineStatus = async () => {
                const today = getTodayDate();
                
                const rId = await getRoutineForDay(today);
                setIsActiveRoutine(rId === query);
                
                const allData = await getAllExerciseHistory();
                
                const completed: Record<string, number> = {};
                for (const [exId, entry] of Object.entries(allData)) {
                    const typedEntry = entry as any; // Type as any or ExerciseEntry
                    const todaySession = typedEntry?.sessions?.find((s: any) => s.date === today);
                    if (todaySession && todaySession.sets && todaySession.sets.length > 0) {
                        completed[exId] = todaySession.sets.length;
                    }
                }
                setCompletedExercises(completed);
            };
            loadRoutineStatus();
        }, [refetch, query])
    );

    const [exercisesData, setExercisesData] = useState<any[]>([]);
    const [exercisesLoading, setExercisesLoading] = useState(false);
    const [isActiveRoutine, setIsActiveRoutine] = useState(false);
    const [completedExercises, setCompletedExercises] = useState<Record<string, number>>({});

    useEffect(() => {
        if (routine && routine.exercises) {
            const loadExercises = async () => {
                setExercisesLoading(true);
                try {
                    const loaded = await Promise.all(
                        routine.exercises.map((exId: string) => fetchExerciseJson({ query: exId }))
                    );
                    setExercisesData(loaded);
                } catch (e) {
                    console.error("Error loading exercises for routine", e);
                } finally {
                    setExercisesLoading(false);
                }
            };
            loadExercises();
        }
    }, [routine]);

    useLayoutEffect(() => {
        if (routine) {
            navigation.setOptions({
                headerTitle: () => (
                    <Text className="font-bold text-xl text-white italic">{routine.title}</Text>
                ),
            });
        }
    }, [navigation, routine]);

    if (routineLoading || exercisesLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <ActivityIndicator size="large" color="#f97316" />
            </SafeAreaView>
        );
    }

    if (routineError) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <Text className="text-red-500 font-medium">Erreur : {routineError?.message}</Text>
            </SafeAreaView>
        );
    }

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
            <View className="flex-1">
                <FlatList
                    data={exercisesData}
                    contentContainerStyle={{ paddingTop: 15 + bannerGap, paddingBottom: 20 }}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={
                        routine ? (
                            <View className="px-4 mb-6">
                                {isActiveRoutine && (
                                    <View className="bg-blue-100 px-4 py-3 rounded-2xl flex-row items-center justify-center mb-4 border border-blue-200">
                                        <View className="w-2.5 h-2.5 rounded-full bg-[#3456AD] mr-2" />
                                        <Text className="text-blue-900 font-bold text-base">Séance en cours</Text>
                                    </View>
                                )}
                                <Text className="text-gray-600 text-base">{routine.description}</Text>
                                <View className="flex-row mt-4 gap-3">
                                    <View className="flex-row items-center bg-gray-200 px-3 py-1.5 rounded-lg">
                                        <Feather name="clock" size={14} color="#4b5563" />
                                        <Text className="text-gray-700 ml-1.5 font-medium">{routine.duration}</Text>
                                    </View>
                                    <View className="flex-row items-center bg-orange-100 px-3 py-1.5 rounded-lg">
                                        <Feather name="bar-chart" size={14} color="#ea580c" />
                                        <Text className="text-[#ea580c] ml-1.5 font-medium">{routine.level}</Text>
                                    </View>
                                </View>
                                <Text className="text-lg font-bold text-gray-800 mt-6 mb-2">
                                    Exercices du programme
                                </Text>
                            </View>
                        ) : null
                    }
                    renderItem={({ item, index }) => {
                        const setsDone = completedExercises[item.id.toString()] || 0;
                        const isDone = setsDone > 0;
                        
                        return (
                            <TouchableOpacity 
                                onPress={() => router.push(`/exercise/${item.id}`)}
                                className="bg-white mx-4 my-2 p-3 rounded-3xl flex-row items-center shadow-sm border border-gray-100"
                                activeOpacity={0.7}
                            >
                                <View className="bg-gray-50 rounded-full mr-4 p-1 items-center justify-center relative" style={{ width: 68, height: 68 }}>
                                    {(item as any).iconName ? (
                                        <Feather name={(item as any).iconName as any} size={30} color="#3456AD" />
                                    ) : (
                                        <Image
                                            source={getExerciseImage(item.image)}
                                            style={{ width: 60, height: 60, borderRadius: 30 }}
                                        />
                                    )}
                                    <View className={`absolute -top-1 -right-1 w-6 h-6 rounded-full items-center justify-center border-2 border-white ${isDone ? 'bg-[#3456AD]' : 'bg-orange-500'}`}>
                                        <Text className="text-white text-xs font-bold">{index + 1}</Text>
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-800" numberOfLines={2}>{item.name}</Text>
                                    {isDone && (
                                        <Text className="text-[#3456AD] text-sm font-medium mt-0.5">{setsDone} série{setsDone > 1 ? 's' : ''} terminée{setsDone > 1 ? 's' : ''}</Text>
                                    )}
                                </View>
                                <Feather name="chevron-right" size={24} color={isDone ? "#3456AD" : "#d1d5db"} />
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
            
            {exercisesData.length > 0 && (
                <View className="px-4 pb-6 pt-2 bg-gray-100 gap-3 border-t border-gray-200/50">
                        <TouchableOpacity 
                            onPress={async () => {
                                const allRoutines = await getUserRoutines();
                                let newTitle = routine.title;
                                let counter = 1;
                                while (allRoutines.some((r: any) => r.title === newTitle)) {
                                    newTitle = `${routine.title} ${counter}`;
                                    counter++;
                                }

                                const newRoutine = {
                                    id: `routine_user_${Date.now()}`,
                                    title: newTitle,
                                    description: routine.description,
                                    level: routine.level,
                                    duration: routine.duration,
                                    exercises: routine.exercises,
                                    isCustom: true
                                };
                                await saveUserRoutine(newRoutine);
                                Alert.alert("Succès", routine.isCustom ? "Programme dupliqué !" : "Programme ajouté à vos entraînements !", [
                                    { text: "OK", onPress: () => router.replace(`/routine/${newRoutine.id}`) }
                                ]);
                            }}
                            className="bg-white border-2 border-[#3456AD] py-3.5 rounded-2xl flex-row justify-center items-center shadow-sm"
                            activeOpacity={0.8}
                        >
                            <Feather name={routine.isCustom ? "copy" : "download"} size={20} color="#3456AD" />
                            <Text className="text-[#3456AD] font-bold text-[17px] ml-2">
                                {routine.isCustom ? "Dupliquer ce programme" : "Ajouter à mes programmes"}
                            </Text>
                        </TouchableOpacity>

                    {routine.isCustom && (
                        isActiveRoutine ? (
                            <TouchableOpacity 
                                onPress={() => {
                                    router.push({ pathname: '/today_records', params: { date: getTodayDate() } });
                                }}
                                className="bg-red-500 py-4 rounded-2xl shadow-md flex-row justify-center items-center"
                                activeOpacity={0.8}
                            >
                                <Feather name="check-circle" size={20} color="white" />
                                <Text className="text-white font-bold text-lg ml-2">Terminer l'entraînement</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity 
                                onPress={async () => {
                                    await saveRoutineForDay(getTodayDate(), query);
                                    setIsActiveRoutine(true);
                                }}
                                className="bg-orange-500 py-4 rounded-2xl shadow-md flex-row justify-center items-center"
                                activeOpacity={0.8}
                            >
                                <Feather name="play" size={20} color="white" />
                                <Text className="text-white font-bold text-lg ml-2">Commencer ce programme</Text>
                            </TouchableOpacity>
                        )
                    )}
                </View>
            )}
        </SafeAreaView>
    );
}
