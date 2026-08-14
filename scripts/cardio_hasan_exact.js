const fs = require('fs');
const path = require('path');
const https = require('https');

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
    "exercise.running.name": "0685-oLrKqDH.gif",
    "exercise.treadmill_running.name": "0685-oLrKqDH.gif",
    "exercise.cycling.name": "0798-a8VDgLw.gif",
    "exercise.elliptical.name": "2141-rjtuP6X.gif",
    "exercise.stair_climber.name": "2311-j9Q5crt.gif",
    "exercise.jump_rope.name": "2612-e1e76I2.gif"
    // rowing and swimming remain as icons
};

async function run() {
    let replacedCount = 0;
    
    for (let ex of currentExercises.exercises) {
        if (ex.muscleGroupId >= 10 && ex.muscleGroupId <= 13) {
            const hasanGif = cardioMapping[ex.nameKey];
            if (!hasanGif) {
                // If it was mapped previously, revert it to iconName
                if (ex.image) {
                    delete ex.image;
                    if (ex.muscleGroupId === 10) ex.iconName = 'wind';
                    else if (ex.muscleGroupId === 11) ex.iconName = 'aperture';
                    else if (ex.muscleGroupId === 12) ex.iconName = 'droplet';
                    else if (ex.muscleGroupId === 13) ex.iconName = 'activity';
                }
                continue;
            }
            
            const gifUrl = `https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/${hasanGif}`;
            const destPath = path.join(baseImgDir, hasanGif);
            
            try {
                if (!fs.existsSync(destPath)) {
                    await downloadImage(gifUrl, destPath);
                    console.log(`Downloaded ${hasanGif} for ${ex.nameKey}`);
                }
                
                ex.image = hasanGif;
                delete ex.iconName;
                
                replacedCount++;
                console.log(`Assigned ${hasanGif} to ${ex.nameKey}`);
            } catch (e) {
                console.error(`Error downloading ${hasanGif}`, e.message);
            }
        }
    }

    fs.writeFileSync(exercisesJsonPath, JSON.stringify(currentExercises, null, 4));
    console.log(`Finished. Replaced ${replacedCount} cardio exercises.`);
}

run();
