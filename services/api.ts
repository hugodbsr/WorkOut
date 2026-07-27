import exercisesData from "@/src/data/exercises/exercises.json"
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadTranslations, getTranslatedValue, getLanguageCode } from "./translation";

const USER_CREATED_EXERCISES_KEY = "user_created_exercises";

export type MuscleGroup = {
    id: string | number;
    nameKey: string;
    image: string;
};

export type Exercise = {
    id: string | number;
    nameKey: string;
    descriptionKey: string;
    image: string;
    muscleGroupId: string | number;
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
        }))
    );

    return muscles;
};

export const fetchMuscleJson = async ({ query }: { query: string }) => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslations(languageCode);

    const muscle = exercisesData.muscleGroups.find(
        (msc: MuscleGroup) => msc.id.toString() === query
    );

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

    return await Promise.all(muscleList.map(async (exercise: Exercise) => ({
        id: exercise.id,
        name: await getTranslatedValue(exercise.nameKey, translations),
        image: exercise.image,
    })));
};

export const fetchExerciseJson = async ({ query }: { query: string }) => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslations(languageCode);

    const allExercices = await fetchAllExercises();

    const exercise = allExercices.find(
        (msc: Exercise) => msc.id.toString() === query
    );

    if (!exercise) {
        throw new Error("exercice hasn't been found");
    }

    return {
        id: exercise.id,
        name: await getTranslatedValue(exercise.nameKey, translations),
        image: exercise.image,
        description: await getTranslatedValue(exercise.descriptionKey, translations),
        unilateral: exercise.unilateral
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
