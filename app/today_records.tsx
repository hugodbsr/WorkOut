import {
    ActivityIndicator,
    Text,
    View,
    SectionList,
} from 'react-native';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { getAllExerciseHistory, Set, getTodayDate } from "@/services/storage";
import { fetchExerciseJson } from "@/services/api";
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLanguageCode } from "@/services/translation";
import { useUITranslation } from '@/services/useUITranslation';
import HistorySetItem from '@/app/components/history/HistorySetItem';
import HistorySectionHeader from '@/app/components/history/HistorySectionHeader';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import { useLocalSearchParams } from 'expo-router';

type ExerciseSetData = {
    exerciseId: string;
    exerciseName: string;
    set: Set;
    setIndex: number;
    isFirstOfExercise: boolean;
};

type DaySection = {
    title: string;
    date: string;
    data: ExerciseSetData[];
};

import { useBannerActive } from "@/app/context/TimerContext";

export default function TodayRecords() {
    const [sections, setSections] = useState<DaySection[]>([]);
    const [loading, setLoading] = useState(true);
    const { date } = useLocalSearchParams<{ date?: string }>();
    const targetDate = date || getTodayDate();

    const bannerActive = useBannerActive();
    
    const bannerGap = bannerActive ? 52 : 0;

    const uiNoData = useUITranslation('no_session_today', "Aucune séance à cette date.");
    const uiTitle = useUITranslation('today_records', "Historique");
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl text-white italic">{uiTitle}</Text>
            ),
        });
    }, [navigation, uiTitle]);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const allData = await getAllExerciseHistory();

                // Récupérer les noms des exercices (optimisation: seulement ceux d'aujourd'hui)
                const exerciseNames: { [id: string]: string } = {};
                const dateMap: { [date: string]: { [exerciseId: string]: Set[] } } = {};

                for (const [exerciseId, entry] of Object.entries(allData)) {
                    if (!entry.sessions) continue;

                    for (const session of entry.sessions) {
                        if (session.date !== targetDate) continue; // Filtre pour la date cible

                        if (!dateMap[session.date]) {
                            dateMap[session.date] = {};
                        }
                        dateMap[session.date][exerciseId] = session.sets;
                        
                        // Récupérer le nom s'il n'est pas encore chargé
                        if (!exerciseNames[exerciseId]) {
                            try {
                                const exerciseData = await fetchExerciseJson({ query: exerciseId });
                                exerciseNames[exerciseId] = exerciseData.name;
                            } catch {
                                exerciseNames[exerciseId] = exerciseId;
                            }
                        }
                    }
                }

                if (!dateMap[targetDate]) {
                    setSections([]);
                    setLoading(false);
                    return;
                }

                const flatData: ExerciseSetData[] = [];

                for (const [exerciseId, sets] of Object.entries(dateMap[targetDate])) {
                    sets.forEach((set, index) => {
                        flatData.push({
                            exerciseId,
                            exerciseName: exerciseNames[exerciseId] || exerciseId,
                            set,
                            setIndex: index,
                            isFirstOfExercise: index === 0
                        });
                    });
                }

                const userLocale = getLanguageCode() === 'fr' ? 'fr-FR' : 'en-US';

                const formattedSections: DaySection[] = [
                    {
                        title: new Date(targetDate).toLocaleDateString(userLocale, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }),
                        date: targetDate,
                        data: flatData
                    }
                ];

                setSections(formattedSections);
            } catch (error) {
                console.error('Erreur lors du chargement de l\'historique', error);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [targetDate]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <ActivityIndicator size="large" color="#3456AD" />
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }: { item: ExerciseSetData }) => (
        <View>
            {item.isFirstOfExercise && (
                <View className="flex-row items-center gap-2 px-5 pt-4 pb-2">
                    <Feather name="activity" size={16} color="#3456AD" />
                    <Text className="text-lg font-bold text-gray-800">{item.exerciseName}</Text>
                </View>
            )}
            <HistorySetItem item={item.set} index={item.setIndex} />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom', 'left', 'right']}>
            {sections.length === 0 ? (
                <View className="flex-1 justify-center items-center px-6">
                    <Feather name="sun" size={48} color="#d1d5db" />
                    <Text className="text-gray-400 text-lg mt-4 text-center">{uiNoData}</Text>
                </View>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item, index) => `${item.exerciseId}-${item.set.id || index}`}
                    renderItem={renderItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <HistorySectionHeader title={title} />
                    )}
                    contentContainerStyle={{ paddingBottom: 50, paddingTop: 15 + bannerGap }}
                    stickySectionHeadersEnabled={true}
                    SectionSeparatorComponent={() => <View className="h-2" />}
                />
            )}
        </SafeAreaView>
    );
}
