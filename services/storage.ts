import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_EXERCISE_KEY = 'user_exercises_data';
const USER_CREATED_EXERCISES_KEY = "user_created_exercises";
const USER_CREATED_ROUTINES_KEY = "user_created_routines";

export type Side = "left" | "right" | "both";

export type Set = { id: string; reps: number; weight: number; side: Side; isDropSet?: boolean; };
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

export const updateUserExercise = async (exerciseId: string, updatedData: any) => {
    try {
        const json = await AsyncStorage.getItem(USER_CREATED_EXERCISES_KEY);
        if (json) {
            const userExercises = JSON.parse(json);
            const index = userExercises.findIndex((ex: any) => ex.id === exerciseId);
            if (index > -1) {
                userExercises[index] = { ...userExercises[index], ...updatedData };
                await AsyncStorage.setItem(USER_CREATED_EXERCISES_KEY, JSON.stringify(userExercises));
            }
        }
    } catch (e) {
        console.error("Erreur lors de la mise à jour de l'exercice personnalisé", e);
    }
}

export const deleteUserExercise = async (exerciseId: string) => {
    try {
        const json = await AsyncStorage.getItem(USER_CREATED_EXERCISES_KEY);
        if (json) {
            const userExercises = JSON.parse(json);
            const filteredExercises = userExercises.filter((ex: any) => ex.id !== exerciseId);
            await AsyncStorage.setItem(USER_CREATED_EXERCISES_KEY, JSON.stringify(filteredExercises));
        }
    } catch (e) {
        console.error("Erreur lors de la suppression de l'exercice personnalisé", e);
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

const USER_WEIGHT_HISTORY_KEY = 'user_weight_history';

export type WeightEntry = { date: string; weight: number };

export const addWeightEntry = async (weight: number, date: string) => {
    try {
        const json = await AsyncStorage.getItem(USER_WEIGHT_HISTORY_KEY);
        let history: WeightEntry[] = json ? JSON.parse(json) : [];
        
        const existingIndex = history.findIndex(entry => entry.date === date);
        if (existingIndex > -1) {
            history[existingIndex].weight = weight;
        } else {
            history.push({ date, weight });
        }
        
        history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        await AsyncStorage.setItem(USER_WEIGHT_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error("Erreur ajout poids", e);
    }
};

export const getWeightHistory = async (): Promise<WeightEntry[]> => {
    try {
        const json = await AsyncStorage.getItem(USER_WEIGHT_HISTORY_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error("Erreur lecture poids", e);
        return [];
    }
};

// --- ROUTINES (Entraînements personnalisés) ---

export const getUserRoutines = async (): Promise<any[]> => {
    try {
        const json = await AsyncStorage.getItem(USER_CREATED_ROUTINES_KEY);
        if (json) {
            return JSON.parse(json);
        }
    } catch (e) {
        console.error("Erreur getUserRoutines", e);
    }
    return [];
};

export const saveUserRoutine = async (routine: any) => {
    try {
        const routines = await getUserRoutines();
        const index = routines.findIndex((r) => r.id === routine.id);
        if (index >= 0) {
            routines[index] = routine;
        } else {
            routines.push(routine);
        }
        await AsyncStorage.setItem(USER_CREATED_ROUTINES_KEY, JSON.stringify(routines));
    } catch (e) {
        console.error("Erreur saveUserRoutine", e);
        throw e;
    }
};

export const deleteUserRoutine = async (routineId: string) => {
    try {
        const routines = await getUserRoutines();
        const filtered = routines.filter((r) => r.id !== routineId);
        await AsyncStorage.setItem(USER_CREATED_ROUTINES_KEY, JSON.stringify(filtered));
    } catch (e) {
        console.error("Erreur deleteUserRoutine", e);
        throw e;
    }
};

// --- Routine History ---

const ROUTINE_HISTORY_KEY = 'user_routine_history';

export const saveRoutineForDay = async (date: string, routineId: string) => {
    try {
        const json = await AsyncStorage.getItem(ROUTINE_HISTORY_KEY);
        const history = json ? JSON.parse(json) : {};
        history[date] = routineId;
        await AsyncStorage.setItem(ROUTINE_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error("Erreur lors de la sauvegarde de la routine du jour", e);
    }
};

export const getRoutineForDay = async (date: string): Promise<string | null> => {
    try {
        const json = await AsyncStorage.getItem(ROUTINE_HISTORY_KEY);
        if (!json) return null;
        const history = JSON.parse(json);
        return history[date] || null;
    } catch (e) {
        console.error("Erreur lors de la récupération de la routine du jour", e);
        return null;
    }
};
