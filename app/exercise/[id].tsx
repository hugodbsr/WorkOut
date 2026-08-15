import {
    ActivityIndicator,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useLocalSearchParams , useNavigation } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchExerciseJson } from "@/services/api";
import { addSessionToExercise, deleteSessionOfExercise, getExerciseHistory, getTodayDate, Side } from "@/services/storage";
import { useUITranslation } from '@/services/useUITranslation';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { exerciseImages } from "@/src/constants/images";
import { Feather } from '@expo/vector-icons';

import { ExerciseHeader } from '@/app/components/exercise/ExerciseHeader';
import { SeriesItem } from '@/app/components/exercise/SeriesItem';
import { ExerciseFooter } from '@/app/components/exercise/ExerciseFooter';
import { nanoid } from "nanoid/non-secure";
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { SlideOutLeft, Layout } from 'react-native-reanimated';

import { useBannerActive } from "@/app/context/TimerContext";

type LocalSet = {
    id: string;
    reps: string;
    weight: string;
    side: Side;
    isDropSet?: boolean;
};

export default function Details() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const query = Array.isArray(id) ? id[0] : id;

    const bannerActive = useBannerActive();
    
    const bannerGap = bannerActive ? 42 : 0; // Réduit à 42px au lieu de 52px pour la page des séries

    const {
        data: exercise,
        loading: exerciseLoading,
        error: exerciseError,
    } = useFetch(() => fetchExerciseJson({ query: `${id}` }));

    const [oldSeries, setOldSeries] = useState<{ reps: string, weight: string, side?: Side }[]>([]);
    const [series, setSeries] = useState<LocalSet[]>([{ id: nanoid(), reps: '', weight: '', side: 'both' }]);
    const [unilateral, setUnilateral] = useState(false);
    const [dropSetButtonVisible, setDropSetButtonVisible] = useState<Record<string, boolean>>({});

    const [isEditing, setIsEditing] = useState(false);
    const swipeableRefs = React.useRef<Record<string, Swipeable | null>>({});
    const scrollViewRef = React.useRef<ScrollView>(null);

    const handleAddSerieField = () => {
        setSeries([...series, { id: nanoid(), reps: '', weight: '', side: unilateral ? "left" : "both", isDropSet: false }]);
    };

    const saveSetToStorage = async (set: LocalSet) => {
        const isComplete = set.reps !== '';
        if (isComplete) {
            await addSessionToExercise(
                query as string,
                {
                    id: set.id,
                    reps: parseInt(set.reps, 10),
                    weight: set.weight ? parseFloat(set.weight) : 0,
                    side: set.side,
                    isDropSet: set.isDropSet || false,
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

    const handleAddDropSet = (globalMainIndex: number, dropSetsCount: number) => {
        const insertAt = globalMainIndex + dropSetsCount + 1;
        const newSeries = [...series];
        const mainSide = newSeries[globalMainIndex].side;
        newSeries.splice(insertAt, 0, { id: nanoid(), reps: '', weight: '', side: mainSide, isDropSet: true });
        setSeries(newSeries);
    };

    function getExerciseImage(name?: string) {
        if (!name) return undefined;
        if (name.startsWith('file://') || name.startsWith('http')) {
            return name;
        }
        try {
            if (exerciseImages[name as keyof typeof exerciseImages]) {
                return exerciseImages[name as keyof typeof exerciseImages];
            } else {
                return undefined;
            }
        } catch (error) {
            console.error("Erreur lors du chargement de l'image:", error);
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

    const uiTodaySeries = useUITranslation('today_series', "Séries effectuées aujourd'hui");

    useLayoutEffect(() => {
        if (exercise) {
            navigation.setOptions({
                headerTitle: () => (
                    <Text className="font-bold text-xl text-white italic">{uiTodaySeries}</Text>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={toggleEditMode}>
                        <Feather
                            name={isEditing ? "x-circle" : "edit"}
                            size={24}
                            color="white"
                            className="mr-4"
                        />
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation, exercise, isEditing, uiTodaySeries]);

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
                    reps: set.reps != null ? set.reps.toString() : '',
                    weight: set.weight != null ? set.weight.toString() : '',
                    side: set.side ?? "both",
                    isDropSet: set.isDropSet || false,
                }))
                : [];

            let previousSeries: { reps: string, weight: string, side?: Side }[] = pastSessions.length > 0
                ? pastSessions[0].sets.map(set => ({
                    reps: set.reps != null ? set.reps.toString() : '',
                    weight: set.weight != null ? set.weight.toString() : '',
                    side: set.side ?? "both",
                }))
                : [];

            while (currentSeries.length < previousSeries.length) {
                currentSeries.push({ id: nanoid(), reps: '', weight: '', side: 'left', isDropSet: false });
            }

            setOldSeries(previousSeries);
            setSeries(currentSeries.length > 0 ? currentSeries : [{ id: nanoid(), reps: '', weight: '', side: 'both', isDropSet: false }]);
        };

        getHistory();
    }, [id]);

    if (exerciseLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <ActivityIndicator size="large" color="#3456AD" />
            </SafeAreaView>
        );
    }

    if (exerciseError) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <Text className="text-red-500 font-medium">Error : {exerciseError?.message}</Text>
            </SafeAreaView>
        );
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

    const toggleDropSetButton = (groupId: string, dropSetsCount: number) => {
        if (dropSetsCount > 0) return; // Bloqué sur ON s'il y a des drop sets
        setDropSetButtonVisible(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    }

    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView className="flex-1 bg-gray-100">
                <KeyboardAvoidingView 
                    style={{ flex: 1 }} 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <ScrollView 
                        ref={scrollViewRef}
                        className="bg-gray-100" 
                        style={{ marginBottom: 110 }} 
                        contentContainerStyle={{ flexGrow: 1, paddingTop: bannerGap }}
                        keyboardShouldPersistTaps="handled"
                        onContentSizeChange={() => {
                            scrollViewRef.current?.scrollToEnd({ animated: true });
                        }}
                    >

                        <ExerciseHeader
                            name={exercise?.name}
                            description={exercise?.description}
                            imageSource={getExerciseImage(exercise?.image)}
                            iconName={(exercise as any)?.iconName}
                            isUnilateral={!!exercise?.unilateral}
                            unilateral={unilateral}
                            setUnilateral={setUnilateral}
                        />

                        {(() => {
                            type GroupedSets = {
                                mainSet: LocalSet;
                                globalMainIndex: number;
                                mainDisplayIndex: number;
                                dropSets: { set: LocalSet; globalIndex: number; dropDisplayIndex: number }[];
                            };

                            const groupedSeries: GroupedSets[] = [];
                            let currentGroup: GroupedSets | null = null;
                            let mainCounter = 1;
                            
                            series.forEach((serie, globalIndex) => {
                                if (!serie.isDropSet) {
                                    if (currentGroup) groupedSeries.push(currentGroup);
                                    currentGroup = {
                                        mainSet: serie,
                                        globalMainIndex: globalIndex,
                                        mainDisplayIndex: mainCounter++,
                                        dropSets: []
                                    };
                                } else {
                                    if (currentGroup) {
                                        currentGroup.dropSets.push({
                                            set: serie,
                                            globalIndex: globalIndex,
                                            dropDisplayIndex: currentGroup.dropSets.length + 1
                                        });
                                    }
                                }
                            });
                            if (currentGroup) groupedSeries.push(currentGroup);

                            return groupedSeries.map((group) => (
                                <Animated.View
                                    key={group.mainSet.id}
                                    exiting={SlideOutLeft.duration(300)}
                                    layout={Layout.springify()}
                                    className="mx-4 my-2 rounded-2xl shadow-sm"
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 2,
                                        elevation: 2,
                                    }}
                                >
                                    <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                        <Swipeable
                                            key={`swipe-main-${group.mainSet.id}`}
                                            ref={el => { swipeableRefs.current[group.mainSet.id] = el; }}
                                            renderRightActions={() => renderRightActions(group.globalMainIndex)}
                                        >
                                            <SeriesItem
                                                serie={group.mainSet}
                                                index={group.mainDisplayIndex}
                                                placeholderReps={oldSeries[group.globalMainIndex]?.reps}
                                                placeholderWeight={oldSeries[group.globalMainIndex]?.weight}
                                                onRepChange={(text) => handleChangeSerie(group.globalMainIndex, 'reps', text)}
                                                onWeightChange={(text) => handleChangeSerie(group.globalMainIndex, 'weight', text)}
                                                onSideChange={() => handleChangeSide(group.globalMainIndex)}
                                                isUnilateral={unilateral}
                                                trackingMode={exercise?.trackingMode || 'WEIGHT_REPS'}
                                                isDropSet={false}
                                                onOptionsPress={() => toggleDropSetButton(group.mainSet.id, group.dropSets.length)}
                                                isDropSetButtonVisible={group.dropSets.length > 0 || dropSetButtonVisible[group.mainSet.id]}
                                            />
                                    </Swipeable>
                                    
                                    {group.dropSets.map((drop) => (
                                        <Swipeable
                                            key={`swipe-drop-${drop.set.id}`}
                                            ref={el => { swipeableRefs.current[drop.set.id] = el; }}
                                            renderRightActions={() => renderRightActions(drop.globalIndex)}
                                        >
                                            <SeriesItem
                                                serie={drop.set}
                                                index={drop.dropDisplayIndex}
                                                placeholderReps={oldSeries[drop.globalIndex]?.reps}
                                                placeholderWeight={oldSeries[drop.globalIndex]?.weight}
                                                onRepChange={(text) => handleChangeSerie(drop.globalIndex, 'reps', text)}
                                                onWeightChange={(text) => handleChangeSerie(drop.globalIndex, 'weight', text)}
                                                onSideChange={() => handleChangeSide(drop.globalIndex)}
                                                isUnilateral={unilateral}
                                                trackingMode={exercise?.trackingMode || 'WEIGHT_REPS'}
                                                isDropSet={true}
                                            />
                                        </Swipeable>
                                    ))}
                                    
                                    {(() => {
                                        const isVisible = group.dropSets.length > 0 || dropSetButtonVisible[group.mainSet.id];
                                        
                                        if (!isVisible) return null;
                                        
                                        return (
                                            <TouchableOpacity
                                                onPress={() => handleAddDropSet(group.globalMainIndex, group.dropSets.length)}
                                                className="py-3 items-center justify-center border-t border-gray-100 bg-slate-50/50"
                                                activeOpacity={0.7}
                                            >
                                                <Text className="text-[#3456AD] font-bold">+ Ajouter Drop set</Text>
                                            </TouchableOpacity>
                                        );
                                    })()}
                                    </View>
                                </Animated.View>
                            ));
                        })()}
                    </ScrollView>
                </KeyboardAvoidingView>

                <ExerciseFooter
                    exerciseQuery={query}
                    onAddPress={handleAddSerieField}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}