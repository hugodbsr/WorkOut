const fs = require('fs');
const path = require('path');
const https = require('https');

const yuhonasData = JSON.parse(fs.readFileSync(path.join(__dirname, '../exercises_db.json'), 'utf8'));
const hasanData = JSON.parse(fs.readFileSync('/tmp/hasan_exercises.json', 'utf8'));

const exercisesJsonPath = path.join(__dirname, '../src/data/exercises/exercises.json');
const enJsonPath = path.join(__dirname, '../src/data/i18n/en.json');
const frJsonPath = path.join(__dirname, '../src/data/i18n/fr.json');
const baseImgDir = path.join(__dirname, '../assets/images/exercises_gifs');

let currentExercises = JSON.parse(fs.readFileSync(exercisesJsonPath, 'utf8'));
let enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
let frJson = JSON.parse(fs.readFileSync(frJsonPath, 'utf8'));

// Find max ID in current exercises
let maxId = 0;
for (let ex of currentExercises.exercises) {
    if (ex.id > maxId) maxId = ex.id;
}

// Remove old forearm exercises
const oldForearms = currentExercises.exercises.filter(ex => ex.muscleGroupId === 9);
for (let old of oldForearms) {
    const keyParts = old.nameKey.split('.'); // e.g. exercise.154.name
    const idKey = keyParts[1];
    delete enJson[idKey];
    delete frJson[idKey];
}
currentExercises.exercises = currentExercises.exercises.filter(ex => ex.muscleGroupId !== 9);

console.log(`Deleted ${oldForearms.length} old forearm exercises.`);

// Find 25 new forearm exercises
const newForearms = yuhonasData.filter(ex => ex.primaryMuscles && ex.primaryMuscles.includes('forearms'));

const downloadImage = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

async function run() {
    let addedCount = 0;
    for (let ex of newForearms) {
        maxId++;
        const newId = maxId;
        
        // Add translations
        enJson[newId] = {
            name: ex.name,
            description: ex.instructions.join(' ')
        };
        frJson[newId] = {
            name: ex.name,
            description: ex.instructions.join(' ')
        };
        
        // Try to find image in Hasan DB
        let gifName = null;
        let match = hasanData.find(h => h.name.toLowerCase() === ex.name.toLowerCase());
        if (!match) {
            // fuzzy match
            match = hasanData.find(h => h.name.toLowerCase().includes(ex.name.toLowerCase()) || ex.name.toLowerCase().includes(h.name.toLowerCase()));
        }
        
        if (match && match.gif_url) {
            const gifUrl = `https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/${match.gif_url}`;
            gifName = `${match.id}.gif`;
            const destPath = path.join(baseImgDir, gifName);
            
            try {
                if (fs.existsSync(destPath) && fs.statSync(destPath).size === 0) {
                    fs.unlinkSync(destPath);
                }
                if (!fs.existsSync(destPath)) {
                    await downloadImage(gifUrl, destPath);
                    console.log(`Downloaded ${gifName} for ${ex.name}`);
                }
            } catch (e) {
                console.error(`Error downloading ${gifName} for ${ex.name}`);
                gifName = null; // revert if failed
            }
        } else {
            console.log(`No GIF found in Hasan DB for ${ex.name}`);
        }
        
        // Add to exercises
        currentExercises.exercises.push({
            id: newId,
            nameKey: `exercise.${newId}.name`,
            descriptionKey: `exercise.${newId}.description`,
            image: gifName || "default.gif",
            exerciseTypeKey: "1",
            muscleGroupId: 9,
            createdByUser: false,
            unilateral: false
        });
        
        addedCount++;
    }
    
    // Write back
    fs.writeFileSync(exercisesJsonPath, JSON.stringify(currentExercises, null, 4));
    fs.writeFileSync(enJsonPath, JSON.stringify(enJson, null, 2));
    fs.writeFileSync(frJsonPath, JSON.stringify(frJson, null, 2));
    
    console.log(`Added ${addedCount} new forearm exercises.`);
}

run();
