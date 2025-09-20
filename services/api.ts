import exercices from "@/assets/data/exercises/exercices.json"
import * as Localization from "expo-localization";

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

export const fetchMuscleJsonList = async () => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslation(languageCode);

    return exercices.muscleGroups.map((muscle) => ({
        id: muscle.id,
        name: translated(muscle.nameKey, translations),
        image: muscle.image,
    }));
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

    const muscleList = exercices.exercises.filter(
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

    const exercise = exercices.exercises.find(
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

    return exercices.exerciseType.map((type) => ({
        id: type.id,
        name: translated(type.nameKey, translations),
    }));
};
