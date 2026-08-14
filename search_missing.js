const fs = require('fs');

const yuhonasData = JSON.parse(fs.readFileSync('exercises_db.json', 'utf8'));
const myExercises = [
    'other.webp', 'cable_biceps_neutral.webp', 'concentration_curl_hammer.webp', 
    'concentration_curl_neutral.webp', 'dips_chest.webp', 'machine_dips.webp', 
    'triceps_kickback.webp', 'barbell_shoulder_press.webp', 'machine_shoulder_press.webp', 
    'rear_delt_fly.webp', 'close_grip_seated_row.webp', 'wide_grip_lat_pulldown.webp', 
    'close_grip_lat_pulldown.webp', 'incline_bench_crunch.webp'
];

for (let ex of myExercises) {
    const name = ex.replace('.webp', '').replace(/_/g, ' ');
    const matches = yuhonasData.filter(y => y.name.toLowerCase().includes(name.split(' ')[0]) || y.name.toLowerCase().includes('kickback'));
    console.log(`Searching for ${name}... Found ${matches.length} matches. e.g. ${matches.slice(0, 3).map(m => m.name).join(', ')}`);
}
