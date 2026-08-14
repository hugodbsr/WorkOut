const fs = require('fs');
const https = require('https');

const filesToFix = [
    '0019', '0091', '0165', '0251', '0277', '0297', '0333', '0603', '0861'
];

const hasanData = JSON.parse(fs.readFileSync('/tmp/hasan_exercises.json', 'utf8'));

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

async function fix() {
    for (let id of filesToFix) {
        const match = hasanData.find(x => x.id === id);
        if (match && match.gif_url) {
            const destPath = `../assets/images/exercises_gifs/${id}.gif`;
            if (fs.existsSync(destPath)) {
                fs.unlinkSync(destPath); // force delete the 0 byte file
            }
            const gifUrl = `https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/${match.gif_url}`;
            try {
                await downloadImage(gifUrl, destPath);
                console.log(`Successfully downloaded ${id}.gif from ${gifUrl}`);
            } catch (e) {
                console.error(`Failed to download ${id}.gif:`, e.message);
            }
        }
    }
}
fix();
