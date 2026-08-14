const fs = require('fs');
const path = require('path');

const exercisesPath = path.join(__dirname, '../src/data/exercises/exercises.json');
const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

// Icons mapping for cardio groups
const groupIconMapping = {
    10: 'wind', // running
    11: 'life-buoy', // cycling (maybe we use a standard feather icon, bike is not in feather usually? actually feather has no bike. let's use standard feather icons)
    12: 'droplet', // swimming
    13: 'activity' // other
};
// We will use Feather icons.
// Running -> 'wind' or 'navigation' or 'activity'
// Cycling -> 'circle' or 'disc' or 'activity'
// Actually let's use Lucide or Feather. The app imports `{ Feather } from '@expo/vector-icons'` in cardio.tsx!
// Feather icons: 'activity', 'wind', 'droplet', 'target', 'compass', 'zap'

// Update groups
exercisesData.cardioGroups.forEach(group => {
    delete group.image;
    group.iconName = groupIconMapping[group.id] || 'activity';
});

// Icon mapping for individual exercises based on categoryId
// 10: Running
// 11: Cycling
// 12: Swimming
// 13: Other cardio
exercisesData.exercises.forEach(ex => {
    if (ex.categoryId >= 10 && ex.categoryId <= 13) {
        delete ex.image;
        if (ex.categoryId === 10) ex.iconName = 'wind';
        else if (ex.categoryId === 11) ex.iconName = 'aperture'; // wheel-like
        else if (ex.categoryId === 12) ex.iconName = 'droplet';
        else if (ex.categoryId === 13) ex.iconName = 'activity';
    }
});

fs.writeFileSync(exercisesPath, JSON.stringify(exercisesData, null, 4));
console.log('Modified exercises.json for cardio icons');
