import exercices from "@/assets/data/exercises/exercices.json"
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_CREATED_EXERCISES_KEY = "user_created_exercises";

// Importation par fichiers JSON
const getNestedValue = (key: string, translations: any): string | undefined => {
    const parts = key.split(".");
    let value: any = translations;
    for (let part of parts) {
        if (!value || typeof value !== 'object' || !value.hasOwnProperty(part)) {
            return undefined;
        }
        value = value[part];
    }
    return typeof value === 'string' || typeof value === 'number' ? value.toString() : undefined;
};

const loadTranslations = async (languageCode: string) => {
    const en = await import('../assets/data/i18n/en.json');
    let primary = en;

    if (languageCode === "fr") {
        try {
            primary = await import('../assets/data/i18n/fr.json');
        } catch {
        }
    }

    return { primary: primary.default, fallback: en.default };
};

const getTranslatedValue = async (key: string, { primary, fallback }: { primary: any, fallback: any }): Promise<string> => {
    let value = getNestedValue(key, primary);

    if (value === undefined) {
        value = getNestedValue(key, fallback);
    }

    return value !== undefined ? value : key;
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
    const translations = await loadTranslations(languageCode);

    const muscles = await Promise.all(
        exercices.muscleGroups.map(async (muscle) => ({
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

    const muscle = exercices.muscleGroups.find(
        (msc: any) => msc.id.toString() === query
    );

    if (!muscle) {
        throw new Error("muscle not found");
    }

    return {
        name: await getTranslatedValue(muscle.nameKey, translations),
    };
};

export const fetchExerciceListJson = async ({ query }: { query: string }) => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslations(languageCode);

    const allExercices = await fetchAllExercises();

    const muscleList = allExercices.filter(
        (ex: any) => ex.muscleGroupId?.toString() === query
    );

    if (!muscleList) {
        throw new Error("no exercice for this muscle");
    }

    return await Promise.all(muscleList.map(async (exercise: any) => ({
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
        (msc: any) => msc.id.toString() === query
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
        exercices.exerciseType.map(async (type) => ({
            id: type.id,
            name: await getTranslatedValue(type.nameKey, translations),
        }))
    );

    return types;
};
