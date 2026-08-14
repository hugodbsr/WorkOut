const fs = require('fs');
const path = require('path');

const exercisesPath = path.join(__dirname, 'src/data/exercises/exercises.json');
const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

const gifsDir = path.join(__dirname, 'assets/images/exercises_gifs');
const exercisesBaseDir = path.join(__dirname, 'src/data/exercises/images/exercises');

let output = `// constants/images.js\n\n`;

output += `export const muscleGroupImages = {\n`;
output += `    "chest.png": require("../data/exercises/images/muscles/chest.png"),\n`;
output += `    "back.png": require("../data/exercises/images/muscles/back.png"),\n`;
output += `    "shoulders.png": require("../data/exercises/images/muscles/shoulders.png"),\n`;
output += `    "biceps.png": require("../data/exercises/images/muscles/biceps.png"),\n`;
output += `    "triceps.png": require("../data/exercises/images/muscles/triceps.png"),\n`;
output += `    "legs.png": require("../data/exercises/images/muscles/legs.png"),\n`;
output += `    "abs.png": require("../data/exercises/images/muscles/abs.png")\n`;
output += `};\n\n`;

output += `export const exerciseImages = {\n`;
const added = new Set();
let missingCount = 0;

function findImage(imgName) {
    if (imgName.endsWith('.gif')) {
        const p = path.join(gifsDir, imgName);
        if (fs.existsSync(p)) return p;
        return null;
    }
    const findInDir = (dir) => {
        const items = fs.readdirSync(dir);
        for (let item of items) {
            const itemPath = path.join(dir, item);
            if (fs.statSync(itemPath).isDirectory()) {
                const res = findInDir(itemPath);
                if (res) return res;
            } else if (item === imgName) {
                return itemPath;
            }
        }
        return null;
    };
    return findInDir(exercisesBaseDir);
}

function addImage(imgName) {
    if (!imgName || added.has(imgName)) return;
    const fullPath = findImage(imgName);
    if (fullPath) {
        let relativePath = path.relative(path.join(__dirname, 'src/constants'), fullPath).replace(/\\/g, '/');
        output += `    "${imgName}": require("${relativePath}"),\n`;
        added.add(imgName);
    } else {
        console.warn(`Could not find image file for ${imgName}`);
        missingCount++;
    }
}

// Only add images that are referenced!
exercisesData.exercises.forEach(ex => addImage(ex.image));
exercisesData.cardioGroups.forEach(cg => addImage(cg.image));

// Remove trailing comma from last entry
output = output.replace(/,\n$/, '\n');
output += `};\n`;

fs.writeFileSync(path.join(__dirname, 'src/constants/images.js'), output);
console.log(`Successfully regenerated src/constants/images.js. Found ${added.size} valid images, missing ${missingCount}`);
