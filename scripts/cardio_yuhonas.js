const fs = require('fs');
const path = require('path');
const https = require('https');

// The Yuhonas URL for downloading gifs
const yuhonasBase = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

const exercisesJsonPath = path.join(__dirname, '../src/data/exercises/exercises.json');
const baseImgDir = path.join(__dirname, '../assets/images/exercises_gifs');

let currentExercises = JSON.parse(fs.readFileSync(exercisesJsonPath, 'utf8'));

const downloadImage = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

const cardioMapping = {
    "exercise.running.name": "Trail_Running_Walking.gif", // Or just leave icon if not exact
    "exercise.treadmill_running.name": "Running_Treadmill.gif",
    "exercise.cycling.name": "Air_Bike.gif", 
    "exercise.elliptical.name": "Elliptical_Trainer.gif",
    "exercise.rowing.name": "Rowing_Stationary.gif",
    "exercise.stair_climber.name": "Stairmaster.gif",
    "exercise.jump_rope.name": "Rope_Jumping.gif",
    // Swimming has no exact match in Yuhonas
};

async function run() {
    let replacedCount = 0;
    
    for (let ex of currentExercises.exercises) {
        if (ex.muscleGroupId >= 10 && ex.muscleGroupId <= 13) {
            const yuhonasGif = cardioMapping[ex.nameKey];
            if (!yuhonasGif) {
                // If it was modified by the previous hasan script, revert it to iconName
                if (ex.image) {
                    delete ex.image;
                    if (ex.muscleGroupId === 10) ex.iconName = 'wind';
                    else if (ex.muscleGroupId === 11) ex.iconName = 'aperture';
                    else if (ex.muscleGroupId === 12) ex.iconName = 'droplet';
                    else if (ex.muscleGroupId === 13) ex.iconName = 'activity';
                }
                continue;
            }
            
            const gifUrl = yuhonasBase + yuhonasGif;
            const newImage = yuhonasGif.toLowerCase(); // keep it lowercase like other muscle gifs
            const destPath = path.join(baseImgDir, newImage);
            
            try {
                if (!fs.existsSync(destPath)) {
                    await downloadImage(gifUrl, destPath);
                    console.log(`Downloaded ${newImage} for ${ex.nameKey}`);
                }
                
                ex.image = newImage;
                delete ex.iconName;
                
                replacedCount++;
                console.log(`Assigned ${newImage} to ${ex.nameKey}`);
            } catch (e) {
                console.error(`Error downloading ${newImage}`, e.message);
            }
        }
    }

    fs.writeFileSync(exercisesJsonPath, JSON.stringify(currentExercises, null, 4));
    console.log(`Finished. Replaced ${replacedCount} cardio exercises.`);
}

run();
