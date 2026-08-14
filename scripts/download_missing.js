const fs = require('fs');
const path = require('path');
const https = require('https');

const yuhonasData = JSON.parse(fs.readFileSync('../exercises_db.json', 'utf8'));
const exercisesJsonPath = path.join(__dirname, '../src/data/exercises/exercises.json');
const imagesJsPath = path.join(__dirname, '../src/constants/images.js');
const baseImgDir = path.join(__dirname, '../assets/images/exercises_gifs');

const mapping = {
    'cable_biceps_neutral.webp': 'cable hammer curl',
    'concentration_curl_hammer.webp': 'concentration curl', // no specific hammer concentration curl
    'concentration_curl_neutral.webp': 'concentration curl',
    'dips_chest.webp': 'dips - chest version',
    'machine_dips.webp': 'machine dip',
    'triceps_kickback.webp': 'tricep dumbbell kickback',
    'barbell_shoulder_press.webp': 'barbell shoulder press',
    'machine_shoulder_press.webp': 'leverage shoulder press',
    'rear_delt_fly.webp': 'cable rear delt fly',
    'close_grip_seated_row.webp': 'cable seated row',
    'wide_grip_lat_pulldown.webp': 'wide-grip lat pulldown',
    'close_grip_lat_pulldown.webp': 'v-bar pulldown',
    'incline_bench_crunch.webp': 'decline crunch' // incline crunch is usually decline bench
};

let currentExercises = JSON.parse(fs.readFileSync(exercisesJsonPath, 'utf8'));
let imagesJsContent = fs.readFileSync(imagesJsPath, 'utf8');

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
    let replacedCount = 0;
    
    for (let ex of currentExercises.exercises) {
        if (ex.image && mapping[ex.image]) {
            const oldImage = ex.image;
            const searchName = mapping[oldImage];
            
            const match = yuhonasData.find(y => y.name.toLowerCase() === searchName.toLowerCase());
            
            if (match && match.gifUrl) {
                // Ensure gifUrl points to github raw
                const gifUrl = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${match.id}.gif`;
                
                const newImage = `${match.id}.gif`;
                const destPath = path.join(baseImgDir, newImage);
                
                try {
                    if (!fs.existsSync(destPath)) {
                        await downloadImage(gifUrl, destPath);
                        console.log(`Downloaded ${newImage}`);
                    }
                    
                    ex.image = newImage;
                    
                    // Update images.js
                    // Remove old webp reference if it exists
                    const regex = new RegExp(`"${oldImage}":\\s*require\\("\\.\\./data/exercises/images/exercises/[a-zA-Z_]+/${oldImage}"\\),?`, 'g');
                    imagesJsContent = imagesJsContent.replace(regex, '');
                    
                    // Add new gif reference
                    const newRef = `"${newImage}": require("../../assets/images/exercises_gifs/${newImage}"),\n`;
                    if (!imagesJsContent.includes(newImage)) {
                        imagesJsContent = imagesJsContent.replace('};', `    ${newRef}};`);
                    }
                    
                    replacedCount++;
                    console.log(`Replaced ${oldImage} with ${newImage}`);
                } catch (e) {
                    console.error(`Error downloading ${gifUrl}`, e.message);
                }
            } else {
                console.log(`No exact match found for ${searchName}`);
            }
        }
    }

    fs.writeFileSync(exercisesJsonPath, JSON.stringify(currentExercises, null, 4));
    fs.writeFileSync(imagesJsPath, imagesJsContent);
    console.log(`Finished. Replaced ${replacedCount} missing images.`);
}

run();
