import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_EXERCISE_KEY = 'user_exercises_data';
const USER_CREATED_EXERCISES_KEY = "user_created_exercises";

export type Side = "left" | "right" | "both";

export type Set = { id: string; reps: number; weight: number; side: Side; };
export type Session = {
    date: string;
    sets: Set[]
};
export type ExerciseEntry = {
    sessions: Session[];
};
type ExerciseUserData = {
    [exerciseId: string]: ExerciseEntry;
};

export const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
};

export const addUserExercise = async (exercise: any) => {
    try {
        const json = await AsyncStorage.getItem(USER_CREATED_EXERCISES_KEY);
        const userExercises = json ? JSON.parse(json) : [];
        userExercises.push(exercise);

        await AsyncStorage.setItem(USER_CREATED_EXERCISES_KEY, JSON.stringify(userExercises));

    } catch (e) {
        console.error("Erreur lors de l'ajout de l'exercice", e);
    }
}

export const addSessionToExercise = async (
    exerciseId: string,
    set: Set
) => {
    try {
        const json = await AsyncStorage.getItem(USER_EXERCISE_KEY);
        const data: ExerciseUserData = json ? JSON.parse(json) : {};
        const date = getTodayDate();

        let existingEntry: ExerciseEntry;
        if (data[exerciseId] && !Array.isArray(data[exerciseId])) {
            existingEntry = data[exerciseId];
        } else {
            existingEntry = { sessions: [] };
        }

        let todaySession = existingEntry.sessions.find(
            (session) => session.date === date
        );

        if (!todaySession) {
            todaySession = { date, sets: [] };
            existingEntry.sessions.push(todaySession);
        }

        const setIndex = todaySession.sets.findIndex(s => s.id === set.id);

        if (setIndex > -1) {
            todaySession.sets[setIndex] = set;
        } else {
            todaySession.sets.push(set);
        }

        data[exerciseId] = existingEntry;

        await AsyncStorage.setItem(USER_EXERCISE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Erreur de sauvegarde", error);
    }
};

export const deleteSessionOfExercise = async (exerciseId: string, setId: string) => {
    try {
        const json = await AsyncStorage.getItem(USER_EXERCISE_KEY);
        const data: ExerciseUserData = json ? JSON.parse(json) : {};
        const date = getTodayDate();

        const existingEntry = data[exerciseId];
        if (!existingEntry) return;

        const todaySession = existingEntry.sessions.find(session => session.date === date);
        if (!todaySession) return;

        todaySession.sets = todaySession.sets.filter(s => s.id !== setId);

        if (todaySession.sets.length === 0) {
            existingEntry.sessions = existingEntry.sessions.filter(session => session.date !== date);
        }

        data[exerciseId] = existingEntry;

        await AsyncStorage.setItem(USER_EXERCISE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Erreur de suppression', error);
    }
}


export const getExerciseHistory = async (exerciseId: string): Promise<ExerciseEntry | null> => {
    try {
        const json = await AsyncStorage.getItem(USER_EXERCISE_KEY);
        const data: ExerciseUserData = json ? JSON.parse(json) : {};
        return data[exerciseId] || null;
    } catch (error) {
        console.error('Erreur de lecture', error);
        return null;
    }
};

export const getAllExerciseHistory = async (): Promise<ExerciseUserData> => {
    try {
        const json = await AsyncStorage.getItem(USER_EXERCISE_KEY);
        return json ? JSON.parse(json) : {};
    } catch (error) {
        console.error('Erreur de lecture', error);
        return {};
    }
};

export const clearAllExerciseHistory = async () => {
    try {
        await AsyncStorage.removeItem(USER_EXERCISE_KEY);
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'historique', error);
    }
};

export const clearUserCreatedExercises = async () => {
    try {
        await AsyncStorage.removeItem(USER_CREATED_EXERCISES_KEY);
    } catch (error) {
        console.error('Erreur lors de la suppression des exercices créés', error);
    }
};
