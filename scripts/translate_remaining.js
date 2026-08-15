const fs = require('fs');
const path = require('path');

const frPath = path.join(__dirname, '../src/data/i18n/fr.json');
let fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

const translations = {
  "84": "Fentes",
  "85": "Développé couché incliné à un bras avec haltère",
  "86": "Good morning jambes tendues à la barre",
  "87": "Pompes claquées",
  "88": "Élévation frontale debout avec barre",
  "89": "Skieur à la barre",
  "90": "Développé incliné marteau avec haltères sur ballon",
  "91": "Développé prise serrée avec haltères",
  "92": "Curl biceps avec haltère en équilibre sur Bosu",
  "93": "Développé Arnold",
  "94": "Flexion latérale à la barre",
  "95": "Développé Arnold",
  "96": "Oiseau couché avec haltères",
  "97": "Kickback avec haltère",
  "98": "Curl biceps à genoux avec haltères sur ballon",
  "99": "Crunch décliné",
  "100": "Roulette abdos à la barre sur banc",
  "101": "Squat rapide à la barre",
  "102": "Développé décliné prise inversée à la barre",
  "103": "Soulevé de terre roumain à la barre",
  "104": "Élévation frontale avec haltères",
  "105": "Écarté décliné avec haltères",
  "106": "Étirement de la grenouille",
  "107": "Élévation latérale vers frontale avec haltères",
  "108": "Fentes latérales à la barre",
  "109": "Essuie-glaces isométriques",
  "110": "Muscle up (Kipping)",
  "111": "Étirement des pectoraux et deltoïdes",
  "112": "Squat avant prise épaulé à la barre",
  "113": "Squat sauté à la barre avec fente arrière",
  "114": "Étirement arrière des pectoraux",
  "115": "Développé incliné avec haltères sur ballon",
  "116": "Fentes sautées",
  "117": "Curl pupitre couché à la barre",
  "118": "Rotation landmine 180",
  "119": "Extension triceps avec haltère en pronation",
  "120": "Développé décliné avec haltères",
  "121": "Dips coréens",
  "122": "Élévation alternée debout avec haltères",
  "123": "Pullover à la barre",
  "124": "Élévation latérale arrière à un bras couché",
  "125": "Curl marteau croisé avec haltère",
  "126": "Étirement des quadriceps couché",
  "127": "Tirage sumo avec haltère",
  "128": "Flexion latérale à 45°",
  "129": "Relevé de genoux obliques suspendu",
  "130": "Tirage horizontal à un bras sur machine",
  "131": "Élévation deltoïde postérieur à un bras couché",
  "132": "L-sit au sol",
  "133": "Tirage incliné avec haltères",
  "134": "Fentes marchées avec genoux hauts",
  "135": "Marche de l'ours",
  "136": "Pas avant-arrière",
  "137": "Course foulée courte",
  "138": "Demi-squat sauté",
  "139": "Marche sur tapis incliné",
  "140": "Sauts en ciseaux",
  "141": "Course avec poussée",
  "142": "Vélo elliptique",
  "143": "Course à pied",
  "144": "Burpee jumping jack",
  "145": "Montées de genoux contre un mur",
  "146": "Swing 360",
  "147": "Vélo d'appartement course",
  "148": "Marche sur vélo elliptique",
  "149": "Vélo d'appartement marche",
  "150": "Sauts en étoile",
  "151": "Burpee avec haltères",
  "152": "Pas de patineur",
  "153": "Marche sur stepper"
};

for (const [id, name] of Object.entries(translations)) {
  if (fr.exercise[id]) {
    fr.exercise[id].name = name;
  }
}

// Ensure 154, 155, 156 are deleted from exercise object in both en and fr
const enPath = path.join(__dirname, '../src/data/i18n/en.json');
let en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

delete en.exercise["154"];
delete en.exercise["155"];
delete en.exercise["156"];
delete fr.exercise["154"];
delete fr.exercise["155"];
delete fr.exercise["156"];

fs.writeFileSync(frPath, JSON.stringify(fr, null, 2));
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));

console.log('Translated 70 exercise names to French and cleaned up obsolete keys.');
