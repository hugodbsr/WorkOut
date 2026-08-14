const fs = require('fs');
const path = require('path');
const https = require('https');

const hasanData = JSON.parse(fs.readFileSync('/tmp/hasan_exercises.json', 'utf8'));
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

const cardioNamesToHasan = {
    "exercise.running.name": "run",
    "exercise.cycling.name": "stationary bike", // actually they have "stationary bike"
    "exercise.swimming.name": "butterfly swimming", 
    "exercise.elliptical.name": "elliptical",
    "exercise.rowing.name": null, // none
    "exercise.stair_climber.name": "walking on stepmill", // maybe too generic? let's stick to strict
    "exercise.treadmill_running.name": "run",
    "exercise.jump_rope.name": "jump rope"
};

async function run() {
    let replacedCount = 0;
    
    for (let ex of currentExercises.exercises) {
        if (ex.muscleGroupId >= 10 && ex.muscleGroupId <= 13) {
            const searchName = cardioNamesToHasan[ex.nameKey];
            if (!searchName) continue;
            
            // strictly look for this name in hasan db
            const match = hasanData.find(y => y.name.toLowerCase() === searchName.toLowerCase());
            
            if (match && match.gif_url) {
                const gifUrl = `https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/${match.gif_url}`;
                const newImage = match.gif_url.split('/').pop(); // usually just the filename
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
    }

    fs.writeFileSync(exercisesJsonPath, JSON.stringify(currentExercises, null, 4));
    console.log(`Finished. Replaced ${replacedCount} cardio exercises.`);
}

run();
