import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { useRouter , useFocusEffect } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeFooter } from '@/app/components/home/HomeFooter';
import React, { useState, useCallback } from 'react';
import { getAllExerciseHistory, getTodayDate } from "@/services/storage";
import { fetchExerciseJson, fetchAllExercises } from "@/services/api";
import { useUITranslation } from "@/services/useUITranslation";
import { getLanguageCode } from "@/services/translation";
import { Feather } from '@expo/vector-icons';
import MuscleHeatmap, { HeatmapData } from "@/app/components/analytics/MuscleHeatmap";
import { EXACT_EXERCISE_MAPPING, FALLBACK_MUSCLE_MAPPING } from "@/src/data/muscleMapping";
import { Calendar, DateData } from 'react-native-calendars';
import { FlingGestureHandler, Directions, State } from 'react-native-gesture-handler';

import { useBannerActive } from "@/app/context/TimerContext";

type TodayExercisePreview = {
    exerciseId: string;
    exerciseName: string;
    setsCount: number;
};

export default function Index() {
    const router = useRouter();
    const bannerActive = useBannerActive();
    
    const bannerGap = bannerActive ? 52 : 0; // 48px banner + 4px margin

    const [recentExercises, setRecentExercises] = useState<TodayExercisePreview[]>([]);
    const [heatmapData, setHeatmapData] = useState<HeatmapData>({});
    const [loading, setLoading] = useState(true);
    
    // Nouveaux states pour le calendrier
    const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [markedDates, setMarkedDates] = useState<any>({});

    const uiTodayOverview = useUITranslation('today_overview', "Aperçu de la journée");
    const uiSeeMore = useUITranslation('see_more', "Voir plus");
    const uiNoSessionToday = useUITranslation('no_session_today', "Aucune séance à cette date.");
    const uiSetsCount = useUITranslation('sets_count', "séries");

    useFocusEffect(
        useCallback(() => {
            const fetchPreview = async () => {
                try {
                    setLoading(true);
                    const allData = await getAllExerciseHistory();
                    const allExercises = await fetchAllExercises();
                    
                    const previews: TodayExercisePreview[] = [];
                    const heatData: Record<string, number> = {};
                    const newMarkedDates: any = {};

                    const exerciseMuscleMap: Record<string, string> = {};
                    allExercises.forEach(ex => {
                        const groupId = ex.muscleGroupId ?? ex.categoryId ?? '13';
                        exerciseMuscleMap[ex.id.toString()] = groupId.toString();
                    });

                    for (const [exerciseId, entry] of Object.entries(allData)) {
                        if (!entry.sessions) continue;
                        
                        for (const session of entry.sessions) {
                            // Marquer les dates avec des sessions pour le calendrier
                            if (session.sets.length > 0) {
                                newMarkedDates[session.date] = { 
                                    marked: true, 
                                    dotColor: '#3456AD' 
                                };
                            }

                            // On traite les exos de la date sélectionnée
                            if (session.date === selectedDate && session.sets.length > 0) {
                                let slugsToHighlight = EXACT_EXERCISE_MAPPING[exerciseId];
                                if (!slugsToHighlight) {
                                    const groupId = exerciseMuscleMap[exerciseId];
                                    slugsToHighlight = FALLBACK_MUSCLE_MAPPING[groupId] || [];
                                }

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
                                    setsCount: session.sets.length
                                });
                            }
                        }
                    }

                    // Surligner la date actuellement sélectionnée
                    if (newMarkedDates[selectedDate]) {
                        newMarkedDates[selectedDate] = { ...newMarkedDates[selectedDate], selected: true, selectedColor: '#3456AD' };
                    } else {
                        newMarkedDates[selectedDate] = { selected: true, selectedColor: '#3456AD' };
                    }

                    setMarkedDates(newMarkedDates);
                    setRecentExercises(previews.reverse().slice(0, 3));
                    setHeatmapData(heatData);
                } catch (e) {
                    console.error("Erreur lors du chargement de l'aperçu du jour", e);
                } finally {
                    setLoading(false);
                }
            };

            fetchPreview();
        }, [selectedDate])
    );

    const changeDay = (offset: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + offset);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['top', 'left', 'right']}>
            <FlingGestureHandler
                direction={Directions.RIGHT}
                onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.state === State.ACTIVE) {
                        changeDay(-1); // Aller au jour précédent
                    }
                }}
            >
                <FlingGestureHandler
                    direction={Directions.LEFT}
                    onHandlerStateChange={({ nativeEvent }) => {
                        if (nativeEvent.state === State.ACTIVE) {
                            changeDay(1); // Aller au jour suivant
                        }
                    }}
                >
                    <View className="flex-1">
                        <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16, paddingTop: 15 + bannerGap }}>
                            
                            {/* En-tête centré avec titre cliquable pour ouvrir le calendrier */}
                            <View className="relative justify-center items-center mb-2 mt-2">
                                <TouchableOpacity 
                                    onPress={() => setShowDatePicker(true)} 
                                    className="flex-row items-center justify-center"
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-xl font-bold text-primary italic mr-2 text-center" numberOfLines={1}>
                                        {selectedDate === getTodayDate() 
                                            ? uiTodayOverview 
                                            : new Date(selectedDate).toLocaleDateString(
                                                getLanguageCode() === 'fr' ? 'fr-FR' : 'en-US', 
                                                { day: 'numeric', month: 'long', year: 'numeric' }
                                            )}
                                    </Text>
                                    <Feather name="chevron-down" size={20} color="#3456AD" />
                                </TouchableOpacity>

                                <View className="absolute right-0 flex-row items-center gap-2">
                                    {selectedDate !== getTodayDate() && (
                                        <TouchableOpacity 
                                            onPress={() => setSelectedDate(getTodayDate())}
                                            className="p-2 bg-blue-50 rounded-full"
                                            activeOpacity={0.7}
                                        >
                                            <Feather name="corner-up-left" size={18} color="#3456AD" />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity 
                                        onPress={() => router.push('/settings/profile')}
                                        className="p-2 bg-blue-50 rounded-full"
                                        activeOpacity={0.7}
                                    >
                                        <Feather name="user" size={24} color="#3456AD" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Modal visible={showDatePicker} transparent={true} animationType="fade">
                                <TouchableOpacity 
                                    className="flex-1 bg-black/50 justify-center items-center" 
                                    activeOpacity={1} 
                                    onPress={() => setShowDatePicker(false)}
                                >
                                    <View className="bg-white rounded-3xl p-4 w-[90%] overflow-hidden" onStartShouldSetResponder={() => true}>
                                        <Calendar
                                            current={selectedDate}
                                            enableSwipeMonths={true}
                                            onDayPress={(day: DateData) => {
                                                setSelectedDate(day.dateString);
                                                setShowDatePicker(false);
                                            }}
                                            markedDates={markedDates}
                                            theme={{
                                                todayTextColor: '#3456AD',
                                                arrowColor: '#3456AD',
                                                textDayFontWeight: '500',
                                                dotColor: '#3456AD',
                                                selectedDayBackgroundColor: '#3456AD',
                                                selectedDayTextColor: '#ffffff',
                                            }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </Modal>

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
                                        onPress={() => router.push({ pathname: '/today_records', params: { date: selectedDate } })} 
                                        className="mt-3 py-2.5 bg-blue-50 rounded-xl items-center justify-center"
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-[#3456AD] font-semibold text-[17px]">{uiSeeMore}</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </FlingGestureHandler>
            </FlingGestureHandler>
            <HomeFooter />
        </SafeAreaView>
    );
}
