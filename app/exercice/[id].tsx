import {
    ActivityIndicator,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import { useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchExerciseJson} from "@/services/api";
import {addSessionToExercise, deleteSessionOfExercice, getExerciseHistory, Set, getTodayDate, Side} from "@/services/storage";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import {exerciseImages, muscleGroupImages} from "@/assets/constants/images";

import { ExerciseHeader } from '@/app/components/exercise/ExerciseHeader';
import { SeriesItem } from '@/app/components/exercise/SeriesItem';
import { ExerciseFooter } from '@/app/components/exercise/ExerciseFooter';
import {nanoid} from "nanoid/non-secure";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type LocalSet = {
    id: string;
    reps: string;
    weight: string;
    side: Side;
};

export default function Details(){
    const{id} = useLocalSearchParams();
    const navigation = useNavigation();
    const query = Array.isArray(id) ? id[0] : id;

    const insets = useSafeAreaInsets();

    const {
        data: exercice,
        loading: exerciceLoading,
        error: exerciceError,
    } = useFetch(() => fetchExerciseJson({query: `${id}`}));

    const [oldSeries, setOldSeries] = useState<{reps: string, weight: string, side?: Side}[]>([]);
    const [series, setSeries] = useState<LocalSet[]>([{ id: nanoid(), reps: '', weight: '', side: 'both' }]);
    const [unilateral, setUnilateral] = useState(false);

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
                await deleteSessionOfExercice(query as string, removed.id);
            } catch (e) {
                console.warn("Erreur lors de la suppression du stockage", e);
            }
        }
    };

    useLayoutEffect(() => {
        if(exercice){
            navigation.setOptions({
                headerTitle: () => (
                    <Text className="font-bold text-xl">Série effectué aujourd&#39;hui</Text>
                ),
            });
        }
    }, [navigation, exercice]);

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

            let previousSeries: {reps: string, weight: string, side?: Side}[] = pastSessions.length > 0
                ? pastSessions[0].sets.map(set => ({
                    reps: set.reps.toString(),
                    weight: set.weight.toString(),
                    side: set.side ?? "both",
                }))
                : [];

            while (currentSeries.length < previousSeries.length) {
                currentSeries.push({id: nanoid(), reps: '', weight: '', side: 'left' });
            }

            setOldSeries(previousSeries);
            setSeries(currentSeries.length > 0 ? currentSeries : [{ id: nanoid(), reps: '', weight: '', side: 'both' }]);
        };

        getHistory();
    }, [id]);

    if (exerciceLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (exerciceError) {
        return <Text>Error : {exerciceError?.message}</Text>;
    }

    const renderRightActions = (index : number) => {
        return(
            <View className="flex-row items-center justify-center">
                <TouchableOpacity
                    className="bg-[firebrick] w-[90px] h-[45px] justify-center items-center"
                    onPress={() => handleDeleteSerieField(index)}
                >
                <Image
                    source={require("../../assets/images/trash-2-128.png")}
                    className="w-[25px] h-[25px]"
                />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <GestureHandlerRootView className="flex-1">
            <View className="flex-1">
                <View className="flex-1">
                    <ScrollView className="bg-gray-100" contentContainerStyle={{paddingBottom: 320}}>

                        <ExerciseHeader
                            name={exercice?.name}
                            imageSource={getExerciseImage(exercice?.image)}
                            isUnilateral={exercice?.unilateral}
                            unilateral={unilateral}
                            setUnilateral={setUnilateral}
                        />

                        {series.map((serie, index) => (
                            <Swipeable key={serie.id} renderRightActions={() => renderRightActions(index)}>
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
                        ))}
                    </ScrollView>
                </View>

                <View style={{ paddingBottom: insets.bottom }}>
                    <ExerciseFooter
                        exerciseQuery={query}
                        onAddPress={handleAddSerieField}
                    />
                </View>

            </View>
        </GestureHandlerRootView>
    );
}