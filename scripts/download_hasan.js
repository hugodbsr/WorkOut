const fs = require('fs');
const path = require('path');
const https = require('https');

const hasanData = JSON.parse(fs.readFileSync('/tmp/hasan_exercises.json', 'utf8'));
const exercisesJsonPath = path.join(__dirname, '../src/data/exercises/exercises.json');
const imagesJsPath = path.join(__dirname, '../src/constants/images.js');
const baseImgDir = path.join(__dirname, '../assets/images/exercises_gifs');

const mapping = {
    'other.webp': 'dumbbell kickback',
    'cable_biceps_neutral.webp': 'cable hammer curl (with rope)',
    'concentration_curl_hammer.webp': 'dumbbell concentration curl',
    'concentration_curl_neutral.webp': 'dumbbell concentration curl',
    'dips_chest.webp': 'chest dip',
    'machine_dips.webp': 'assisted triceps dip (kneeling)',
    'triceps_kickback.webp': 'dumbbell kickback',
    'barbell_shoulder_press.webp': 'barbell seated overhead press',
    'machine_shoulder_press.webp': 'lever shoulder press',
    'rear_delt_fly.webp': 'cable rear delt fly',
    'close_grip_seated_row.webp': 'cable seated row',
    'wide_grip_lat_pulldown.webp': 'cable wide-grip pulldown',
    'close_grip_lat_pulldown.webp': 'cable close-grip pulldown',
    'incline_bench_crunch.webp': 'decline crunch'
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
            
            const match = hasanData.find(y => y.name.toLowerCase() === searchName.toLowerCase());
            
            if (match && match.gif_url) {
                const gifUrl = `https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/${match.gif_url}`;
                // Save it simply by its ID to match our standard format
                const newImage = `${match.id}.gif`;
                const destPath = path.join(baseImgDir, newImage);
                
                try {
                    // Check if file exists and has size > 0
                    if (fs.existsSync(destPath) && fs.statSync(destPath).size === 0) {
                        fs.unlinkSync(destPath);
                    }
                    if (!fs.existsSync(destPath)) {
                        await downloadImage(gifUrl, destPath);
                        console.log(`Downloaded ${newImage} for ${searchName}`);
                    } else {
                        console.log(`Already downloaded ${newImage}`);
                    }
                    
                    ex.image = newImage;
                    
                    // Update images.js
                    const regex = new RegExp(`"${oldImage}":\\s*require\\("\\.\\./data/exercises/images/exercises/[a-zA-Z_]+/${oldImage}"\\),?`, 'g');
                    imagesJsContent = imagesJsContent.replace(regex, '');
                    
                    const newRef = `"${newImage}": require("../../assets/images/exercises_gifs/${newImage}"),\n`;
                    if (!imagesJsContent.includes(newImage)) {
                        imagesJsContent = imagesJsContent.replace('};', `    ${newRef}};`);
                    }
                    
                    replacedCount++;
                    console.log(`Replaced ${oldImage} with ${newImage}`);
                } catch (e) {
                    console.error(`Error downloading ${newImage}`, e.message);
                }
            } else {
                console.log(`No match found for ${searchName}`);
            }
        }
    }

    fs.writeFileSync(exercisesJsonPath, JSON.stringify(currentExercises, null, 4));
    fs.writeFileSync(imagesJsPath, imagesJsContent);
    console.log(`Finished. Replaced ${replacedCount} missing images.`);
}

run();
