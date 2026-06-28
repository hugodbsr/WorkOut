import {
    ActivityIndicator,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image, Button,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useLocalSearchParams } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchExerciseJson } from "@/services/api";
import { addSessionToExercise, deleteSessionOfExercise, getExerciseHistory, Set, getTodayDate, Side } from "@/services/storage";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { exerciseImages, muscleGroupImages } from "@/src/constants/images";
import { Feather } from '@expo/vector-icons';

import { ExerciseHeader } from '@/app/components/exercise/ExerciseHeader';
import { SeriesItem } from '@/app/components/exercise/SeriesItem';
import { ExerciseFooter } from '@/app/components/exercise/ExerciseFooter';
import { nanoid } from "nanoid/non-secure";
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { SlideOutLeft, Layout, FadeIn } from 'react-native-reanimated';

type LocalSet = {
    id: string;
    reps: string;
    weight: string;
    side: Side;
};

export default function Details() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const query = Array.isArray(id) ? id[0] : id;

    const {
        data: exercise,
        loading: exerciseLoading,
        error: exerciseError,
    } = useFetch(() => fetchExerciseJson({ query: `${id}` }));

    const [oldSeries, setOldSeries] = useState<{ reps: string, weight: string, side?: Side }[]>([]);
    const [series, setSeries] = useState<LocalSet[]>([{ id: nanoid(), reps: '', weight: '', side: 'both' }]);
    const [unilateral, setUnilateral] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const swipeableRefs = React.useRef<Record<string, Swipeable | null>>({});

    const handleAddSerieField = () => {
        setSeries([...series, { id: nanoid(), reps: '', weight: '', side: unilateral ? "left" : "both", }]);
    };

    const saveSetToStorage = async (set: LocalSet) => {
        const isComplete = set.reps !== '' && set.weight !== '';
        if (isComplete) {
            await addSessionToExercise(
                query as string,
                {
                    id: set.id,
                    reps: parseInt(set.reps, 10),
                    weight: parseFloat(set.weight),
                    side: set.side,
                });
        }
    }

    const handleChangeSerie = async (index: number, field: 'reps' | 'weight', value: string) => {
        const updated = [...series];
        updated[index][field] = value;
        setSeries(updated);
        await saveSetToStorage(updated[index]);
    };

    const handleChangeSide = async (index: number) => {
        if (!unilateral) return;

        const updated = [...series];
        const currentSide = updated[index].side;
        updated[index].side = currentSide === "left" ? "right" : "left";
        setSeries(updated);

        await saveSetToStorage(updated[index]);
    };

    function getExerciseImage(name?: string) {
        if (name && exerciseImages[name as keyof typeof exerciseImages]) {
            return exerciseImages[name as keyof typeof exerciseImages];
        } else {
            return undefined;
        }
    }

    const handleDeleteSerieField = async (index: number) => {
        const updatedSeries = [...series];
        const removed = updatedSeries.splice(index, 1)[0];
        setSeries(updatedSeries);

        const wasComplete = removed.reps !== '' && removed.weight !== '';

        if (wasComplete) {
            try {
                await deleteSessionOfExercise(query as string, removed.id);
            } catch (e) {
                console.warn("Erreur lors de la suppression du stockage", e);
            }
        }
    };

    const toggleEditMode = () => {
        const newState = !isEditing;
        setIsEditing(newState);

        const refs = Object.values(swipeableRefs.current);

        refs.forEach(ref => {
            if (ref) {
                if (newState) {
                    ref.openRight();
                } else {
                    ref.close();
                }
            }
        });
    };

    useLayoutEffect(() => {
        if (exercise) {
            navigation.setOptions({
                headerTitle: () => (
                    <Text className="font-bold text-xl">Série effectué aujourd&#39;hui</Text>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={toggleEditMode}>
                        <Feather
                            name={isEditing ? "x-circle" : "edit"}
                            size={24}
                            color="black"
                            className="mr-4"
                        />
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation, exercise, isEditing]);

    useEffect(() => {
        const today = getTodayDate();
        const getHistory = async () => {
            const history = await getExerciseHistory(query as string);
            if (!history || !history.sessions) return;

            const todaySession = history.sessions.find(s => s.date === today);
            const pastSessions = history.sessions
                .filter(s => s.date !== today)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            let currentSeries: LocalSet[] = todaySession
                ? todaySession.sets.map(set => ({
                    id: set.id || nanoid(),
                    reps: set.reps.toString(),
                    weight: set.weight.toString(),
                    side: set.side ?? "both",
                }))
                : [];

            let previousSeries: { reps: string, weight: string, side?: Side }[] = pastSessions.length > 0
                ? pastSessions[0].sets.map(set => ({
                    reps: set.reps.toString(),
                    weight: set.weight.toString(),
                    side: set.side ?? "both",
                }))
                : [];

            while (currentSeries.length < previousSeries.length) {
                currentSeries.push({ id: nanoid(), reps: '', weight: '', side: 'left' });
            }

            setOldSeries(previousSeries);
            setSeries(currentSeries.length > 0 ? currentSeries : [{ id: nanoid(), reps: '', weight: '', side: 'both' }]);
        };

        getHistory();
    }, [id]);

    if (exerciseLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exerciseError) {
        return <Text>Error : {exerciseError?.message}</Text>;
    }

    const renderRightActions = (index: number) => {
        return (
            <View className="flex-row items-center justify-center">
                <TouchableOpacity
                    className="bg-[firebrick] w-[90px] h-[45px] justify-center rounded-l-md items-center"
                    onPress={() => handleDeleteSerieField(index)}
                >
                    <Image
                        source={require("../../assets/images/trash-2-128.png")}
                        className="w-[25px] h-[25px]"
                        style={{ width: 25, height: 25 }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView className="flex-1 bg-gray-100">
                <ScrollView className="bg-gray-100" contentContainerStyle={{ flexGrow: 1 }}>

                    <ExerciseHeader
                        name={exercise?.name}
                        imageSource={getExerciseImage(exercise?.image)}
                        isUnilateral={exercise?.unilateral}
                        unilateral={unilateral}
                        setUnilateral={setUnilateral}
                    />

                    {series.map((serie, index) => (
                        <Animated.View
                            key={serie.id}
                            exiting={SlideOutLeft.duration(300)}
                            layout={Layout.springify()}>
                            <Swipeable
                                key={serie.id}
                                ref={el => (swipeableRefs.current[serie.id] = el)}
                                renderRightActions={() => renderRightActions(index)}
                            >
                                <SeriesItem
                                    serie={serie}
                                    index={index}
                                    placeholderReps={oldSeries[index]?.reps}
                                    placeholderWeight={oldSeries[index]?.weight}
                                    onRepChange={(text) => handleChangeSerie(index, 'reps', text)}
                                    onWeightChange={(text) => handleChangeSerie(index, 'weight', text)}
                                    onSideChange={() => handleChangeSide(index)}
                                    isUnilateral={unilateral}
                                />
                            </Swipeable>
                        </Animated.View>
                    ))}
                </ScrollView>

                <ExerciseFooter
                    exerciseQuery={query}
                    onAddPress={handleAddSerieField}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}