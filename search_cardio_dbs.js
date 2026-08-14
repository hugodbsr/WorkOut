const https = require('https');

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'NodeJS' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

async function run() {
    try {
        console.log("Fetching Hasan DB...");
        // This is a list of json files, actually hasaneyldrm DB is complex.
        // Wait, I already have /tmp/hasan_exercises.json locally!
        const hasan = require('/tmp/hasan_exercises.json');
        
        console.log("Fetching Yuhonas DB...");
        const yuhonas = await fetchJson('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');

        const terms = ['run', 'bike', 'swim', 'elliptical', 'rope', 'stair', 'row'];
        
        console.log("--- HASAN MATCHES ---");
        for (let ex of hasan) {
            for (let term of terms) {
                if (ex.name && ex.name.toLowerCase().includes(term)) {
                    console.log(`[${term}] ${ex.name} -> ${ex.gif_url}`);
                }
            }
        }
        
        console.log("\n--- YUHONAS MATCHES ---");
        for (let ex of yuhonas) {
            for (let term of terms) {
                if (ex.name && ex.name.toLowerCase().includes(term)) {
                    console.log(`[${term}] ${ex.name} -> ${ex.id}.gif`);
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}
run();
