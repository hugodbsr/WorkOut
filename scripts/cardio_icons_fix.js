const fs = require('fs');
const path = require('path');

const exercisesPath = path.join(__dirname, '../src/data/exercises/exercises.json');
const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

// Icon mapping for individual exercises based on muscleGroupId
// 10: Running
// 11: Cycling
// 12: Swimming
// 13: Other cardio
exercisesData.exercises.forEach(ex => {
    if (ex.muscleGroupId >= 10 && ex.muscleGroupId <= 13) {
        delete ex.image;
        if (ex.muscleGroupId === 10) ex.iconName = 'wind';
        else if (ex.muscleGroupId === 11) ex.iconName = 'aperture';
        else if (ex.muscleGroupId === 12) ex.iconName = 'droplet';
        else if (ex.muscleGroupId === 13) ex.iconName = 'activity';
    }
});

fs.writeFileSync(exercisesPath, JSON.stringify(exercisesData, null, 4));
console.log('Modified exercises.json for cardio icons properly');
