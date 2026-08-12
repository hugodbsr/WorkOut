import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    SectionList
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useLocalSearchParams , useNavigation } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchExerciseJson } from "@/services/api";
import { getExerciseHistory, Set, Session } from "@/services/storage";
import { Feather } from '@expo/vector-icons';

import HistorySetItem from '@/app/components/history/HistorySetItem';
import HistorySectionHeader from '@/app/components/history/HistorySectionHeader';
import { nanoid } from "nanoid/non-secure";
import { useUITranslation } from "@/services/useUITranslation";
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBannerActive } from "@/app/context/TimerContext";

type HistorySection = {
    title: string;
    data: Set[];
}

export default function RecordScreen() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const query = Array.isArray(id) ? id[0] : id;

    const bannerActive = useBannerActive();
    
    const bannerGap = bannerActive ? 52 : 0;

    const {
        data: exercise,
        loading: exerciseLoading,
        error: exerciseError,
    } = useFetch(() => fetchExerciseJson({ query: `${id}` }));

    const [sections, setSections] = useState<HistorySection[]>([]);

    const uiExerciseHistory = useUITranslation("exercise_history", "Exercise history");
    const uiNoData = useUITranslation("no_data", "No data");
    const uiTheoreticalPR = useUITranslation("theoretical_pr", "Theoretical PR (1RM)");
    
    const [theoretical1RM, setTheoretical1RM] = useState<number | null>(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl text-white">{uiExerciseHistory}</Text>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        const getHistory = async () => {
            const history = await getExerciseHistory(query as string);
            if (!history || !history.sessions) {
                setSections([]);
                return;
            }

            let max1RM = 0;

            const trackingMode = exercise?.trackingMode || 'WEIGHT_REPS';
            const sortedSessions = history.sessions.sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            const formattedSections: HistorySection[] = sortedSessions.map(session => {
                session.sets.forEach(set => {
                    const weight = set.weight || 0;
                    const reps = set.reps || 0;
                    if (trackingMode === 'WEIGHT_REPS' && weight > 0 && reps > 0) {
                        const estimated1RM = reps === 1 ? weight : weight * (1 + reps / 30);
                        if (estimated1RM > max1RM) {
                            max1RM = estimated1RM;
                        }
                    }
                });
                
                return {
                    title: new Date(session.date).toLocaleDateString(),
                    data: session.sets.map(set => ({
                        ...set,
                        id: set.id || nanoid()
                    })),
                };
            });

            setSections(formattedSections);
            if (max1RM > 0) {
                setTheoretical1RM(Math.round(max1RM));
            }
        };

        getHistory();
    }, [id, exercise]);

    if (exerciseLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exerciseError) {
        return <Text>Error : {exerciseError?.message}</Text>;
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {exercise && (
                    <Text className="text-3xl mx-4 mt-4 font-black flex-wrap text-center text-gray-800">
                        {exercise.name}
                    </Text>
                )}
                
                {theoretical1RM !== null && (
                    <View className="bg-blue-50 border border-blue-200 rounded-2xl mx-6 mt-3 mb-5 p-4 flex-row justify-center items-center">
                        <Feather name="award" size={24} color="#3456AD" className="mr-2" />
                        <Text className="text-[#3456AD] text-lg font-bold ml-1">{uiTheoreticalPR} : {theoretical1RM} kg</Text>
                    </View>
                )}

                {sections.length === 0 ? (
                    <Text style={styles.noDataText}>{uiNoData}</Text>
                ) : (
                    <SectionList
                        sections={sections}
                        keyExtractor={(item, index) => item.id || `${item.reps}-${item.weight}-${index}-${item.side || ''}`}

                        renderItem={({ item, index }) => (
                            <HistorySetItem item={item} index={index} trackingMode={exercise?.trackingMode} />
                        )}
                        renderSectionHeader={({ section: { title } }) => (
                            <HistorySectionHeader title={title} />
                        )}

                        contentContainerStyle={{ paddingBottom: 50, paddingTop: 15 + bannerGap }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    noDataText: {
        fontSize: 18,
        color: "gray",
        textAlign: "center",
        marginTop: 30,
    },
    container: {
        flex: 1,
        backgroundColor: "white",
    },
});