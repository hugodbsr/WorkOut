import exercices from "@/assets/data/exercises/exercices.json"
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_CREATED_EXERCISES_KEY = "user_created_exercises";

// Importation par fichiers JSON
const loadTranslation = async (languageCode: string) => {
    try {
        let translations;
        if (languageCode === "fr") {
            translations = await import(`../assets/data/i18n/fr.json`);
        } else {
            translations = await import(`../assets/data/i18n/en.json`);
        }
        return translations;
    } catch {
        const fallback = await import(`../assets/data/i18n/en.json`);
        return fallback;
    }
};

const translated = async (key: string, translations: any) => {
    const parts = key.split(".");
    let value: any = translations;
    for (let part of parts) {
        value = value?.[part];
    }
    if (!value) {
        const en = await import(`../assets/data/i18n/en.json`)
        let value: any = en;
        for (let part of parts) {
            value = value?.[part];
        }
    }
    return value || key;
};

const getLanguageCode = (): string => {
    const locales = Localization.getLocales();

    if (locales && locales.length > 0) {
        const locale = locales[0];
        if (locale.languageCode) {
            return locale.languageCode;
        }
    }
    return 'en';
};

const fetchAllExercises = async () => {
    try {
        const stored = await AsyncStorage.getItem(USER_CREATED_EXERCISES_KEY);
        const userExercises = stored ? JSON.parse(stored) : [];
        return [...exercices.exercises, ...userExercises];
    } catch (e) {
        console.error("Erreur lors du chargement des exercices", e);
        return exercices.exercises;
    }
};

export const fetchMuscleJsonList = async () => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslation(languageCode);

    const muscles = await Promise.all(
        exercices.muscleGroups.map(async (muscle) => ({
            id: muscle.id,
            name: await translated(muscle.nameKey, translations),
            image: muscle.image,
        }))
    );

    return muscles;
};

export const fetchMuscleJson = async ({ query }: { query: string }) => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslation(languageCode);

    const muscle = exercices.muscleGroups.find(
        (msc: any) => msc.id.toString() === query
    );

    if (!muscle) {
        throw new Error("muscle not found");
    }

    return {
        name: translated(muscle.nameKey, translations),
    };
};

export const fetchExerciceListJson = async ({ query }: { query: string }) => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslation(languageCode);

    const allExercices = await fetchAllExercises();

    const muscleList = allExercices.filter(
        (ex: any) => ex.muscleGroupId?.toString() === query
    );

    if (!muscleList) {
        throw new Error("no exercice for this muscle");
    }

    return muscleList.map((exercise: any) => ({
        id: exercise.id,
        name: translated(exercise.nameKey, translations),
        image: exercise.image,
    }));
};

export const fetchExerciseJson = async ({ query }: { query: string }) => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslation(languageCode);

    const allExercices = await fetchAllExercises();

    const exercise = allExercices.find(
        (msc: any) => msc.id.toString() === query
    );

    if (!exercise) {
        throw new Error("exercice hasn't been found");
    }

    return {
        id: exercise.id,
        name: translated(exercise.nameKey, translations),
        image: exercise.image,
        description: translated(exercise.descriptionKey, translations),
        unilateral: exercise.unilateral
    };
};

export const fetchExerciseTypeJson = async () => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslation(languageCode);

    const types = await Promise.all(
        exercices.exerciseType.map(async (type) => ({
            id: type.id,
            name: await translated(type.nameKey, translations),
        }))
    );

    return types;
};
