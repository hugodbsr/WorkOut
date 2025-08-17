import exercices from "@/assets/data/exercices.json"
import * as RNLocalize from "react-native-localize";

//Importation par fichiers JSON

const loadTranslation = async (languageCode:string) => {
    try {
        let translations;
        if(languageCode==="fr"){
            translations = await import(`../assets/data/i18n/fr.json`);
        }
        return translations;
    } catch {
        const fallback = await import(`../assets/data/i18n/en.json`);
        return fallback;
    }
}

const translated = (key: string, translations: any) => {
    const parts = key.split(".");
    let value: any = translations;
    for (let part of parts) {
        value = value?.[part];
    }
    return value || key;
};

export const fetchMuscleJsonList = async () => {
    const languageCode = RNLocalize.getLocales()[0]?.languageCode;
    const translations = await loadTranslation(languageCode);


    return exercices.muscleGroups.map((muscle) => ({
        id: muscle.id,
        name: translated(muscle.nameKey, translations),
        image: muscle.image,
    }));
}

export const fetchMuscleJson = async ({query}: {query:string})  => {
    const languageCode = RNLocalize.getLocales()[0]?.languageCode;
    const translations = await loadTranslation(languageCode);

    const muscle = exercices.muscleGroups.find(
        (msc:any) => msc.id.toString() === query
    );

    if(!muscle){
        throw new Error("muscle not found");
    }

    return {
        name: translated(muscle.nameKey, translations),
    }
}

export const fetchExerciceListJson = async ({query}: {query:string})  => {
    const languageCode = RNLocalize.getLocales()[0]?.languageCode;
    const translations = await loadTranslation(languageCode);

    const muscleList = exercices.exercises.filter(
        (msc:any) => msc.id.toString() === query
    )

    if(!muscleList){
        throw new Error("no exercice for this muscle");
    }

    return muscleList.map((exercise: any) => ({
        id: exercise.id,
        name: translated(exercise.nameKey, translations),
        image: exercise.image
    }));
}

export const fetchExerciseJson = async ({query}: {query:string})  => {
    const languageCode = RNLocalize.getLocales()[0]?.languageCode;
    const translations = await loadTranslation(languageCode);

    const exercise = exercices.exercises.find(
        (msc:any)=> msc.id.toString() === query
    )

    if(!exercise){
        throw new Error("exercice hasn't been find");
    }

    return {
        id: exercise.id,
        name: translated(exercise.nameKey, translations),
        description: translated(exercise.descriptionKey, translations),
    };
}

//Importation par API

export const API_CONFIG = {
    BASE_URL: 'https://wger.de/api/v2',
    headers: {
        accept: 'application/json',
    },
};

export const fetchMuscleList = async () => {
    const endpoint = `${API_CONFIG.BASE_URL}/exercisecategory/`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.headers,
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    return data.results;
};

export const fetchMuscle = async ({query}: {query:string}) => {
    const endpoint = `${API_CONFIG.BASE_URL}/exercisecategory/${query}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.headers,
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();

    return {
        name: data?.name,
    };
}

export const fetchExerciceList = async ({query}: {query:string}) => {
    const endpoint = `${API_CONFIG.BASE_URL}/exerciseinfo/?category=${query}&language=2&limit=200`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.headers,
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    return data.results
        .filter((exercise: any) => exercise.images.length > 0)
        .map((exercise: any) => {
            const translation = exercise.translations.find((t: any) => t.language === 2);
            return {
                id: exercise.id,
                name: translation?.name,
                description: translation?.description,
                image: exercise.images[0]?.image,
            };
        })
        .filter(Boolean);
};

export const fetchExercice = async ({query}: {query:string}) => {
    const endpoint = `${API_CONFIG.BASE_URL}/exerciseinfo/${query}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.headers,
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    const translation = data.translations?.find((t: any) => t.language === 2);

    return {
        name: translation?.name,
        description: translation?.description,
    };
}