import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    SectionList
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExerciseJson} from "@/services/api";
import { getExerciseHistory, Set, Session } from "@/services/storage";
import { useNavigation } from '@react-navigation/native';

import HistorySetItem from '@/app/components/history/HistorySetItem';
import HistorySectionHeader from '@/app/components/history/HistorySectionHeader';
import {nanoid} from "nanoid/non-secure";
import {getUITranslation} from "@/services/translation";

type HistorySection = {
    title: string;
    data: Set[];
}

export default function RecordScreen(){
    const {id} = useLocalSearchParams();
    const navigation = useNavigation();
    const query = Array.isArray(id) ? id[0] : id;

    const {
        data: exercice,
        loading: exerciceLoading,
        error: exerciceError,
    } = useFetch(() => fetchExerciseJson({query: `${id}`}));

    const [sections, setSections] = useState<HistorySection[]>([]);

    const uiExerciseHistory = getUITranslation("exercise_history");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl">{uiExerciseHistory}</Text>
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

            const sortedSessions = history.sessions.sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            const formattedSections: HistorySection[] = sortedSessions.map(session => ({
                title: new Date(session.date).toLocaleDateString(),
                data: session.sets.map(set => ({
                    ...set,
                    id: set.id || nanoid()
                })),
            }));

            setSections(formattedSections);
        };

        getHistory();
    }, [id]);

    if (exerciceLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exerciceError) {
        return <Text>Error : {exerciceError?.message}</Text>;
    }

    const uiNoData = getUITranslation("no_data");

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {exercice && (
                    <Text className="text-3xl m-4 font-bold flex-wrap text-center">
                        {exercice.name}
                    </Text>
                )}

                {sections.length === 0 ? (
                    <Text style={styles.noDataText}>{uiNoData}</Text>
                ) : (
                    <SectionList
                        sections={sections}
                        keyExtractor={(item, index) => item.id || `${item.reps}-${item.weight}-${index}-${item.side || ''}`}

                        renderItem={({ item, index }) => (
                            <HistorySetItem item={item} index={index} />
                        )}
                        renderSectionHeader={({ section: { title } }) => (
                            <HistorySectionHeader title={title} />
                        )}

                        contentContainerStyle={{ paddingBottom: 50 }}
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