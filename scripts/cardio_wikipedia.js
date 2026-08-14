const fs = require('fs');
const path = require('path');

const exercisesPath = path.join(__dirname, '../src/data/exercises/exercises.json');
const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

// Restore images for cardio groups
exercisesData.cardioGroups.forEach(cg => {
    delete cg.iconName;
    if (cg.id === 10) cg.image = 'wiki_running.gif';
    else if (cg.id === 11) cg.image = 'wiki_cycling.gif';
    else if (cg.id === 12) cg.image = 'wiki_swimming.gif';
    else if (cg.id === 13) cg.image = 'wiki_running.gif';
});

// Restore images for cardio exercises
exercisesData.exercises.forEach(ex => {
    if (ex.muscleGroupId >= 10 && ex.muscleGroupId <= 13) {
        delete ex.iconName;
        if (ex.muscleGroupId === 10) ex.image = 'wiki_running.gif';
        else if (ex.muscleGroupId === 11) ex.image = 'wiki_cycling.gif';
        else if (ex.muscleGroupId === 12) ex.image = 'wiki_swimming.gif';
        else if (ex.muscleGroupId === 13) ex.image = 'wiki_running.gif';
    }
});

fs.writeFileSync(exercisesPath, JSON.stringify(exercisesData, null, 4));
console.log('Modified exercises.json to use wikipedia gifs for cardio');
