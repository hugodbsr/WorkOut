import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    SectionList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAllExerciseHistory, Set } from "@/services/storage";
import { fetchExerciseJson } from "@/services/api";
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLanguageCode } from "@/services/translation";
import { useUITranslation } from '@/services/useUITranslation';
import HistorySetItem from '@/app/components/history/HistorySetItem';
import HistorySectionHeader from '@/app/components/history/HistorySectionHeader';

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

export default function Records() {
    const [sections, setSections] = useState<DaySection[]>([]);
    const [loading, setLoading] = useState(true);
    const uiNoData = useUITranslation('no_data', 'No data');

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const allData = await getAllExerciseHistory();

                // Récupérer les noms des exercices
                const exerciseNames: { [id: string]: string } = {};
                for (const exerciseId of Object.keys(allData)) {
                    try {
                        const exerciseData = await fetchExerciseJson({ query: exerciseId });
                        exerciseNames[exerciseId] = exerciseData.name;
                    } catch {
                        exerciseNames[exerciseId] = exerciseId;
                    }
                }

                // Regrouper par date
                const dateMap: { [date: string]: { [exerciseId: string]: Set[] } } = {};

                for (const [exerciseId, entry] of Object.entries(allData)) {
                    if (!entry.sessions) continue;

                    for (const session of entry.sessions) {
                        if (!dateMap[session.date]) {
                            dateMap[session.date] = {};
                        }
                        dateMap[session.date][exerciseId] = session.sets;
                    }
                }

                // Convertir en sections triées par date (plus récent en premier)
                const sortedDates = Object.keys(dateMap).sort(
                    (a, b) => new Date(b).getTime() - new Date(a).getTime()
                );

                const formattedSections: DaySection[] = sortedDates.map(date => {
                    const flatData: ExerciseSetData[] = [];

                    for (const [exerciseId, sets] of Object.entries(dateMap[date])) {
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

                    return {
                        title: new Date(date).toLocaleDateString(userLocale, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }),
                        date,
                        data: flatData
                    };
                });

                setSections(formattedSections);
            } catch (error) {
                console.error('Erreur lors du chargement de l\'historique', error);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#3456AD" />
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }: { item: ExerciseSetData }) => (
        <View>
            {item.isFirstOfExercise && (
                <Text style={styles.exerciseName}>{item.exerciseName}</Text>
            )}
            <HistorySetItem item={item.set} index={item.setIndex} />
        </View>
    );



    return (
        <SafeAreaView style={styles.container}>
            {sections.length === 0 ? (
                <Text style={styles.noDataText}>{uiNoData}</Text>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item, index) => `${item.exerciseId}-${item.set.id || index}`}
                    renderItem={renderItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <HistorySectionHeader title={title} />
                    )}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    stickySectionHeadersEnabled={true}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    exerciseName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#f5f5f5',
    },
    noDataText: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
        marginTop: 50,
    },
});