import { Slug } from 'react-native-body-highlighter';

export const EXACT_EXERCISE_MAPPING: Record<string, Slug[]> = {
    "1": ["chest", "triceps", "deltoids"], // Bench Press
    "2": ["upper-back", "biceps"], // Pull up
    "3": ["biceps", "forearm"], // Barbell curl
    "4": ["biceps"], // Preacher curl
    "5": ["biceps", "forearm"], // Cable biceps hammer
    "6": ["biceps"], // Cable biceps neutral
    "7": ["biceps"], // Concentration curl hammer
    "8": ["biceps"], // Concentration curl neutral
    "9": ["biceps", "forearm"], // Hammer curl
    "10": ["biceps"], // Dumbbell curl
    "11": ["biceps"], // Incline dumbbell curl
    "12": ["biceps", "forearm"], // Incline hammer curl
    "13": ["chest", "triceps", "deltoids"], // Incline bench press
    "14": ["chest", "triceps", "deltoids"], // Dumbbell bench press
    "15": ["chest", "triceps", "deltoids"], // Incline dumbbell press
    "16": ["chest"], // Pec fly
    "17": ["chest"], // Cable crossover
    "18": ["chest", "triceps", "deltoids"], // Dips chest
    "19": ["chest", "triceps", "deltoids"], // Push up
    "20": ["chest", "triceps", "deltoids"], // Machine chest press
    "21": ["triceps"], // Skull crusher
    "23": ["triceps", "chest", "deltoids"], // Dips triceps
    "24": ["triceps", "chest", "deltoids"], // Machine dips
    "25": ["triceps"], // Dumbbell triceps extension
    "26": ["triceps"], // Cable triceps extension
    "27": ["triceps"], // Triceps kickback
    "28": ["triceps"], // Overhead triceps extension
    "29": ["triceps"], // Lying triceps extension
    "30": ["deltoids", "triceps"], // Arnold press
    "31": ["deltoids", "triceps"], // Military press
    "32": ["deltoids", "triceps"], // Barbell shoulder press
    "33": ["deltoids", "triceps"], // Machine shoulder press
    "34": ["deltoids", "upper-back"], // Rear delt fly
    "35": ["deltoids", "upper-back"], // Rear delt raise
    "36": ["deltoids"], // Dumbbell front raise
    "37": ["deltoids"], // Cable front raise
    "38": ["deltoids"], // Dumbbell lateral raise
    "39": ["deltoids"], // Cable lateral raise
    "41": ["upper-back", "biceps"], // Close grip pull up
    "42": ["upper-back", "biceps", "lower-back"], // Wide grip seated row
    "43": ["upper-back", "biceps", "lower-back"], // Close grip seated row
    "44": ["upper-back", "biceps"], // Wide grip lat pulldown
    "45": ["upper-back", "biceps"], // Close grip lat pulldown
    "46": ["upper-back", "lower-back", "biceps"], // Barbell row
    "47": ["trapezius"], // Dumbbell shrug
    "48": ["lower-back", "gluteal", "hamstring", "quadriceps", "trapezius"], // Deadlift
    "49": ["gluteal", "adductors"], // Hip abduction
    "50": ["adductors"], // Hip adduction
    "51": ["calves"], // Dumbbell calf raise
    "52": ["quadriceps", "gluteal", "hamstring"], // Dumbbell lunge
    "53": ["quadriceps", "gluteal"], // Hack squat
    "54": ["hamstring"], // Seated leg curl
    "55": ["hamstring"], // Lying leg curl
    "56": ["quadriceps"], // Leg extension
    "57": ["quadriceps", "gluteal"], // Leg press
    "58": ["quadriceps", "gluteal", "lower-back"], // Barbell squat
    "59": ["quadriceps", "gluteal"], // Dumbbell squat
    "60": ["abs"], // Floor crunch
    "61": ["abs"], // Incline bench crunch
    "62": ["abs"], // Cable crunch
    "63": ["obliques", "abs"], // Oblique crunch
};

// Map de fallback pour les groupes musculaires génériques
export const FALLBACK_MUSCLE_MAPPING: Record<string, Slug[]> = {
    "1": ["chest"],
    "2": ["upper-back", "lower-back", "trapezius"],
    "3": ["deltoids"],
    "4": ["biceps"],
    "5": ["triceps"],
    "6": ["quadriceps", "hamstring", "calves", "gluteal"],
    "7": ["abs", "obliques"],
};
