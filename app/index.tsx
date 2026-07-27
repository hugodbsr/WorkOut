import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeFooter } from '@/app/components/home/HomeFooter';
import React, { useState, useCallback } from 'react';
import { getAllExerciseHistory, getTodayDate } from "@/services/storage";
import { fetchExerciseJson, fetchAllExercises } from "@/services/api";
import { useUITranslation } from "@/services/useUITranslation";
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import MuscleHeatmap, { HeatmapData } from "@/app/components/analytics/MuscleHeatmap";
import { EXACT_EXERCISE_MAPPING, FALLBACK_MUSCLE_MAPPING } from "@/src/data/muscleMapping";

type TodayExercisePreview = {
    exerciseId: string;
    exerciseName: string;
    setsCount: number;
};

export default function Index() {
    const router = useRouter();
    const [recentExercises, setRecentExercises] = useState<TodayExercisePreview[]>([]);
    const [heatmapData, setHeatmapData] = useState<HeatmapData>({});
    const [loading, setLoading] = useState(true);

    const uiTodayOverview = useUITranslation('today_overview', "Aperçu de la journée");
    const uiSeeMore = useUITranslation('see_more', "Voir plus");
    const uiNoSessionToday = useUITranslation('no_session_today', "Aucune séance aujourd'hui. Lancez-vous !");
    const uiSetsCount = useUITranslation('sets_count', "séries");

    useFocusEffect(
        useCallback(() => {
            const fetchTodayPreview = async () => {
                try {
                    setLoading(true);
                    const allData = await getAllExerciseHistory();
                    const allExercises = await fetchAllExercises();
                    const today = getTodayDate();
                    
                    const previews: TodayExercisePreview[] = [];
                    const heatData: HeatmapData = {};

                    const exerciseMuscleMap: Record<string, string> = {};
                    allExercises.forEach(ex => {
                        exerciseMuscleMap[ex.id.toString()] = ex.muscleGroupId.toString();
                    });

                    for (const [exerciseId, entry] of Object.entries(allData)) {
                        if (!entry.sessions) continue;
                        
                        const todaySession = entry.sessions.find(s => s.date === today);
                        if (todaySession && todaySession.sets.length > 0) {
                            
                            // Trouver les muscles exacts pour cet exercice
                            let slugsToHighlight = EXACT_EXERCISE_MAPPING[exerciseId];
                            if (!slugsToHighlight) {
                                // Fallback sur le groupe musculaire général si l'exercice est inconnu (ex: créé par l'user)
                                const groupId = exerciseMuscleMap[exerciseId];
                                slugsToHighlight = FALLBACK_MUSCLE_MAPPING[groupId] || [];
                            }

                            // Incrémenter le compteur pour chaque muscle exact touché
                            for (const slug of slugsToHighlight) {
                                heatData[slug] = (heatData[slug] || 0) + 1;
                            }

                            let name = exerciseId;
                            try {
                                const exerciseData = await fetchExerciseJson({ query: exerciseId });
                                name = exerciseData.name;
                            } catch {
                                // fallback
                            }
                            
                            previews.push({
                                exerciseId,
                                exerciseName: name,
                                setsCount: todaySession.sets.length
                            });
                        }
                    }

                    setRecentExercises(previews.reverse().slice(0, 3));
                    setHeatmapData(heatData);
                } catch (e) {
                    console.error("Erreur lors du chargement de l'aperçu du jour", e);
                } finally {
                    setLoading(false);
                }
            };

            fetchTodayPreview();
        }, [])
    );

    return (
        <SafeAreaView className={"flex-1 bg-gray-100"} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16, paddingTop: 5 }}>
                
                {/* Titre tout en haut */}
                <Text className="text-xl font-bold text-primary italic mb-2 mt-2" numberOfLines={1}>
                    {uiTodayOverview}
                </Text>

                {/* Heatmap */}
                <View className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 mb-3 mt-1">
                    <MuscleHeatmap heatmapData={heatmapData} />
                </View>

                {/* Liste des exercices */}
                {loading ? (
                    <ActivityIndicator size="large" color="#3456AD" className="mt-10" />
                ) : recentExercises.length === 0 ? (
                    <View className="items-center justify-center mt-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <Feather name="sun" size={56} color="#d1d5db" />
                        <Text className="text-gray-400 text-lg mt-5 text-center font-medium">{uiNoSessionToday}</Text>
                    </View>
                ) : (
                    <>
                        <View className="gap-2.5">
                            {recentExercises.map((ex, index) => (
                                <TouchableOpacity 
                                    key={ex.exerciseId + index}
                                    onPress={() => router.push(`/exercise/${ex.exerciseId}`)}
                                    className="bg-white px-4 py-3 rounded-2xl flex-row items-center justify-between shadow-sm border border-gray-100"
                                    activeOpacity={0.7}
                                >
                                    <View className="flex-row items-center gap-3 flex-1 pr-2">
                                        <View className="bg-blue-50 w-9 h-9 rounded-full items-center justify-center">
                                            <Feather name="activity" size={18} color="#3456AD" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[17px] font-bold text-gray-800" numberOfLines={1} ellipsizeMode="tail">
                                                {ex.exerciseName}
                                            </Text>
                                            <Text className="text-gray-500 text-xs font-medium">{ex.setsCount} {uiSetsCount}</Text>
                                        </View>
                                    </View>
                                    <Feather name="chevron-right" size={20} color="#d1d5db" />
                                </TouchableOpacity>
                            ))}
                        </View>
                        
                        {/* Bouton Voir plus en dessous */}
                        <TouchableOpacity 
                            onPress={() => router.push('/today_records')} 
                            className="mt-3 py-2.5 bg-blue-50 rounded-xl items-center justify-center"
                            activeOpacity={0.7}
                        >
                            <Text className="text-[#3456AD] font-semibold text-[17px]">{uiSeeMore}</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
            <HomeFooter />
        </SafeAreaView>
    );
}
