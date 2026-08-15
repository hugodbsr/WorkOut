import exercisesData from "@/src/data/exercises/exercises.json";
import routinesData from "@/src/data/routines_db.json";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadTranslations, getTranslatedValue, getLanguageCode } from "./translation";

const USER_CREATED_EXERCISES_KEY = "user_created_exercises";

export type MuscleGroup = {
    id: string | number;
    nameKey: string;
    image?: string;
    iconName?: string;
};

export type Exercise = {
    id: string | number;
    nameKey: string;
    descriptionKey?: string;
    image?: string;
    iconName?: string;
    muscleGroupId?: string | number;
    categoryId?: string | number;
    exerciseTypeKey?: string | number;
    createdByUser?: boolean;
    unilateral?: boolean;
};

export type ExerciseType = {
    id: string | number;
    nameKey: string;
};

// Importation par fichiers JSON

export const fetchAllExercises = async (): Promise<Exercise[]> => {
    try {
        const stored = await AsyncStorage.getItem(USER_CREATED_EXERCISES_KEY);
        const userExercises = stored ? JSON.parse(stored) : [];
        return [...exercisesData.exercises, ...userExercises];
    } catch (e) {
        console.error("Erreur lors du chargement des exercices", e);
        return exercisesData.exercises;
    }
};

export const fetchMuscleJsonList = async () => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslations(languageCode);

    const muscles = await Promise.all(
        exercisesData.muscleGroups.map(async (muscle: MuscleGroup) => ({
            id: muscle.id,
            name: await getTranslatedValue(muscle.nameKey, translations),
            image: muscle.image,
            iconName: muscle.iconName,
        }))
    );

    return muscles;
};

export const fetchCardioGroupsJsonList = async () => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslations(languageCode);

    const cardioGroups = await Promise.all(
        exercisesData.cardioGroups.map(async (group: MuscleGroup) => ({
            id: group.id,
            name: await getTranslatedValue(group.nameKey, translations),
            image: group.image,
            iconName: group.iconName,
        }))
    );

    return cardioGroups;
};

export const fetchMuscleJson = async ({ query }: { query: string }) => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslations(languageCode);

    let muscle = exercisesData.muscleGroups.find(
        (msc: MuscleGroup) => msc.id.toString() === query
    );

    if (!muscle) {
        muscle = exercisesData.cardioGroups.find(
            (msc: any) => msc.id.toString() === query
        ) as any;
    }

    if (!muscle) {
        throw new Error("muscle not found");
    }

    return {
        name: await getTranslatedValue(muscle.nameKey, translations),
    };
};

export const fetchExerciseListJson = async ({ query }: { query: string }) => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslations(languageCode);

    const allExercices = await fetchAllExercises();

    const muscleList = allExercices.filter(
        (ex: Exercise) => ex.muscleGroupId?.toString() === query
    );

    if (!muscleList) {
        throw new Error("no exercice for this muscle");
    }

    return await Promise.all(muscleList.map(async (exercise: Exercise) => {
        const exerciseTypeObj = exercisesData.exerciseType.find(
            (t: any) => t.id.toString() === (exercise as any).exerciseTypeKey?.toString()
        );
        return {
            id: exercise.id,
            name: await getTranslatedValue(exercise.nameKey, translations),
            image: exercise.image,
            exerciseTypeKey: (exercise as any).exerciseTypeKey,
            trackingMode: (exercise as any).trackingMode || (exerciseTypeObj ? (exerciseTypeObj as any).trackingModeId : 'WEIGHT_REPS')
        };
    }));
};

export const fetchExerciseJson = async ({ query }: { query: string }) => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslations(languageCode);

    const allExercices = await fetchAllExercises();

    const exercise = allExercices.find(
        (msc: Exercise) => msc.id.toString() === query?.toString()
    );

    if (!exercise) {
        throw new Error("exercice hasn't been found");
    }

    const exerciseTypeObj = exercisesData.exerciseType.find(
        (t: any) => t.id.toString() === (exercise as any).exerciseTypeKey?.toString()
    );

    return {
        id: exercise.id,
        name: await getTranslatedValue(exercise.nameKey, translations),
        image: exercise.image,
        description: await getTranslatedValue(exercise.descriptionKey ?? '', translations),
        unilateral: exercise.unilateral,
        exerciseTypeKey: (exercise as any).exerciseTypeKey,
        trackingMode: (exercise as any).trackingMode || (exerciseTypeObj ? (exerciseTypeObj as any).trackingModeId : 'WEIGHT_REPS')
    };
};

export const fetchExerciseTypeJson = async () => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslations(languageCode);

    const types = await Promise.all(
        exercisesData.exerciseType.map(async (type: ExerciseType) => ({
            id: type.id,
            name: await getTranslatedValue(type.nameKey, translations),
        }))
    );

    return types;
};

export const fetchTrackingModesJson = async () => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslations(languageCode);

    const modes = await Promise.all(
        (exercisesData.trackingModes || []).map(async (mode: any) => ({
            value: mode.id,
            label: await getTranslatedValue(mode.nameKey, translations),
        }))
    );

    return modes;
};

import { getUserRoutines } from "./storage";

export const fetchRoutinesJsonList = async () => {
    const languageCode = getLanguageCode();
    const userRoutines = await getUserRoutines();

    const formattedJsonRoutines = routinesData.map((routine: any) => ({
        id: routine.id,
        title: routine.title[languageCode] || routine.title["en"],
        description: routine.description[languageCode] || routine.description["en"],
        level: routine.level,
        duration: routine.duration,
        exercises: routine.exercises,
        isCustom: false,
    }));

    return [...userRoutines, ...formattedJsonRoutines];
};

export const fetchRoutineJson = async ({ query }: { query: string }) => {
    const languageCode = getLanguageCode();
    
    // Check in user routines first
    const userRoutines = await getUserRoutines();
    const customRoutine = userRoutines.find((r: any) => r.id === query);
    if (customRoutine) {
        return customRoutine;
    }

    // Then in JSON
    const routine = routinesData.find((r: any) => r.id === query);
    
    if (!routine) throw new Error("Routine not found");

    return {
        id: routine.id,
        title: routine.title[languageCode] || routine.title["en"],
        description: routine.description[languageCode] || routine.description["en"],
        level: routine.level,
        duration: routine.duration,
        exercises: routine.exercises,
        isCustom: false,
    };
};

export const fetchAllTranslatedExercises = async () => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslations(languageCode);
    const allExercices = await fetchAllExercises();

    return await Promise.all(allExercices.map(async (exercise: Exercise) => {
        return {
            id: exercise.id,
            name: await getTranslatedValue(exercise.nameKey, translations),
            image: exercise.image,
            iconName: exercise.iconName,
        };
    }));
};
