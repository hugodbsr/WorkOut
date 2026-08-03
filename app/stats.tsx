import { Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllExerciseHistory } from "@/services/storage";
import { fetchExerciseJson } from "@/services/api";
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useUITranslation } from '@/services/useUITranslation';

type StatsData = {
    totalWorkouts: number;
    totalVolume: number;
    totalSets: number;
    topExercises: { id: string; name: string; volume: number; sets: number }[];
};

export default function Stats() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const router = useRouter();

    const uiEvolution = useUITranslation('evolution', 'Évolution');
    const uiWorkouts = useUITranslation('workouts', 'Séances');
    const uiSets = useUITranslation('sets', 'Séries');
    const uiTotalVolume = useUITranslation('total_volume', 'Volume Total Soulevé');
    const uiTopExercises = useUITranslation('top_exercises', 'Top Exercices (Volume)');

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="font-bold text-xl text-white italic">{uiEvolution}</Text>
            ),
        });
    }, [navigation, uiEvolution]);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const allData = await getAllExerciseHistory();
                
                const uniqueDates = new Set<string>();
                let totalVolume = 0;
                let totalSets = 0;
                const exerciseStats: Record<string, { volume: number, sets: number }> = {};

                for (const [exerciseId, entry] of Object.entries(allData)) {
                    if (!entry.sessions) continue;
                    
                    if (!exerciseStats[exerciseId]) {
                        exerciseStats[exerciseId] = { volume: 0, sets: 0 };
                    }

                    for (const session of entry.sessions) {
                        if (session.sets.length > 0) {
                            uniqueDates.add(session.date);
                        }
                        for (const set of session.sets) {
                            totalSets++;
                            const vol = set.reps * set.weight;
                            totalVolume += vol;
                            exerciseStats[exerciseId].volume += vol;
                            exerciseStats[exerciseId].sets += 1;
                        }
                    }
                }

                // Get top 3 exercises by volume
                const sortedExercises = Object.entries(exerciseStats)
                    .sort((a, b) => b[1].volume - a[1].volume)
                    .slice(0, 3);
                
                const topExercises = await Promise.all(sortedExercises.map(async ([id, stats]) => {
                    let name = id;
                    try {
                        const exData = await fetchExerciseJson({ query: id });
                        name = exData.name;
                    } catch (e) {}
                    return {
                        id,
                        name,
                        volume: stats.volume,
                        sets: stats.sets
                    };
                }));

                setStats({
                    totalWorkouts: uniqueDates.size,
                    totalVolume,
                    totalSets,
                    topExercises
                });
            } catch (error) {
                console.error("Erreur stats:", error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <ActivityIndicator size="large" color="#3456AD" />
            </SafeAreaView>
        );
    }

    if (!stats) return null;

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom', 'left', 'right']}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                
                {/* Global Stats Grid */}
                <View className="flex-row flex-wrap justify-between gap-y-4 mb-8">
                    <View className="bg-white w-[48%] p-4 rounded-3xl shadow-sm border border-gray-100 items-center justify-center">
                        <View className="bg-blue-50 w-12 h-12 rounded-full items-center justify-center mb-3">
                            <Feather name="calendar" size={24} color="#3456AD" />
                        </View>
                        <Text className="text-3xl font-black text-gray-800">{stats.totalWorkouts}</Text>
                        <Text className="text-sm font-medium text-gray-500 mt-1">{uiWorkouts}</Text>
                    </View>

                    <View className="bg-white w-[48%] p-4 rounded-3xl shadow-sm border border-gray-100 items-center justify-center">
                        <View className="bg-blue-50 w-12 h-12 rounded-full items-center justify-center mb-3">
                            <Feather name="layers" size={24} color="#3456AD" />
                        </View>
                        <Text className="text-3xl font-black text-gray-800">{stats.totalSets}</Text>
                        <Text className="text-sm font-medium text-gray-500 mt-1">{uiSets}</Text>
                    </View>

                    <View className="bg-white w-full p-5 rounded-3xl shadow-sm border border-gray-100 items-center justify-center mt-1">
                        <View className="bg-blue-50 w-14 h-14 rounded-full items-center justify-center mb-3">
                            <Feather name="activity" size={28} color="#3456AD" />
                        </View>
                        <Text className="text-4xl font-black text-[#3456AD]">{stats.totalVolume.toLocaleString()} kg</Text>
                        <Text className="text-base font-semibold text-gray-500 mt-1">{uiTotalVolume}</Text>
                    </View>
                </View>

                {/* Top Exercises */}
                {stats.topExercises.length > 0 && (
                    <View>
                        <Text className="text-xl font-bold text-gray-800 mb-4 ml-1">{uiTopExercises}</Text>
                        <View className="gap-3">
                            {stats.topExercises.map((ex, index) => (
                                <TouchableOpacity 
                                    key={ex.id}
                                    onPress={() => router.push(`/exercise/${ex.id}`)}
                                    className="bg-white p-4 rounded-2xl flex-row items-center justify-between shadow-sm border border-gray-100"
                                    activeOpacity={0.7}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-4">
                                            <Text className="font-bold text-gray-500">{index + 1}</Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[17px] font-bold text-gray-800" numberOfLines={1}>{ex.name}</Text>
                                            <Text className="text-sm font-medium text-gray-500">{ex.volume.toLocaleString()} kg ({ex.sets} {uiSets.toLowerCase()})</Text>
                                        </View>
                                    </View>
                                    <Feather name="chevron-right" size={20} color="#d1d5db" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
