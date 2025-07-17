import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_EXERCISE_KEY = 'user_exercises_data';

type Set = { reps: number; weight: number;};
type Session = { sets: Set[] };
type ExerciseEntry = {
    date: string;
    sessions: Session[];
};
type ExerciseUserData = {
    [exerciseId: string]: ExerciseEntry[];
};

const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
};

export const addSessionToExercise = async (exerciseId: number, sets: Set[]) => {
    try {
        const json = await AsyncStorage.getItem(USER_EXERCISE_KEY);
        const data: ExerciseUserData = json ? JSON.parse(json) : {};
        const date = getTodayDate();

        const existing = data[exerciseId] || [];

        const updated = [...existing];
        const todayEntry = updated.find(e => e.date === date);

        if (todayEntry) {
            todayEntry.sessions.push({ sets });
        } else {
            updated.push({
                date,
                sessions: [{ sets }]
            });
        }

        data[exerciseId] = updated;

        await AsyncStorage.setItem(USER_EXERCISE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Erreur de sauvegarde', error);
    }
};

export const getExerciseHistory = async (exerciseId: number): Promise<ExerciseEntry[] | null> => {
    try {
        const json = await AsyncStorage.getItem(USER_EXERCISE_KEY);
        const data: ExerciseUserData = json ? JSON.parse(json) : {};
        return data[exerciseId] || null;
    } catch (error) {
        console.error('Erreur de lecture', error);
        return null;
    }
};
