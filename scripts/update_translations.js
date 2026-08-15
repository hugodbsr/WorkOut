const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '../src/data/i18n/en.json');
const frPath = path.join(__dirname, '../src/data/i18n/fr.json');

let en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
let fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

const translations = {
  "157": {
    "en": { "name": "Bottoms-Up Clean From The Hang Position", "description": "Clean the kettlebell from a hang position while keeping the bottom of the kettlebell facing upwards." },
    "fr": { "name": "Épaulé Kettlebell Inversé", "description": "Épaulez la kettlebell depuis une position suspendue en gardant le fond dirigé vers le haut." }
  },
  "158": {
    "en": { "name": "Cable Wrist Curl", "description": "Sit on a bench and curl the cable straight bar upwards by only moving your wrists." },
    "fr": { "name": "Flexion des poignets à la poulie", "description": "Assis sur un banc, fléchissez vos poignets vers le haut à l'aide de la poulie basse." }
  },
  "159": {
    "en": { "name": "Dumbbell Lying Pronation", "description": "Lie on a bench and externally rotate your forearm until it is parallel to the floor." },
    "fr": { "name": "Pronation couché avec haltère", "description": "Allongé sur un banc, effectuez une rotation externe de l'avant-bras jusqu'à l'horizontale." }
  },
  "160": {
    "en": { "name": "Dumbbell Lying Supination", "description": "Lie on a bench and externally rotate your forearm upward in a semicircle motion." },
    "fr": { "name": "Supination couché avec haltère", "description": "Allongé sur un banc, effectuez une rotation externe de l'avant-bras vers le haut." }
  },
  "161": {
    "en": { "name": "Farmer's Walk", "description": "Walk for a set distance or time while gripping heavy weights tightly." },
    "fr": { "name": "Marche du fermier", "description": "Marchez avec des poids lourds dans chaque main. Excellent pour la poigne." }
  },
  "162": {
    "en": { "name": "Finger Curls", "description": "Roll a barbell down to your fingertips, then curl your fingers to squeeze it back up." },
    "fr": { "name": "Flexion des doigts à la barre", "description": "Laissez rouler la barre jusqu'au bout des doigts, puis refermez-les fermement." }
  },
  "163": {
    "en": { "name": "Kneeling Forearm Stretch", "description": "Kneel with your palms flat on the floor, fingers pointing towards your knees, and lean back slightly." },
    "fr": { "name": "Étirement des avant-bras à genoux", "description": "À genoux, paumes au sol et doigts pointés vers vous, basculez légèrement vers l'arrière." }
  },
  "164": {
    "en": { "name": "Palms-Down Dumbbell Wrist Curl Over Bench", "description": "Rest your forearms on a bench and extend your wrists upward while holding dumbbells palms down." },
    "fr": { "name": "Extension poignets haltères sur banc", "description": "Avant-bras posés sur un banc, remontez les poignets vers le haut en tenant les haltères en pronation." }
  },
  "165": {
    "en": { "name": "Palms-Down Wrist Curl Over A Bench", "description": "Rest your forearms on a bench and extend your wrists upward holding a barbell palms down." },
    "fr": { "name": "Extension poignets barre sur banc", "description": "Avant-bras sur un banc, remontez les poignets vers le haut en tenant une barre en pronation." }
  },
  "166": {
    "en": { "name": "Palms-Up Barbell Wrist Curl Over A Bench", "description": "Rest your forearms on a bench and curl your wrists upward holding a barbell palms up." },
    "fr": { "name": "Flexion poignets barre sur banc", "description": "Avant-bras sur un banc, fléchissez les poignets vers le haut avec une barre en supination." }
  },
  "167": {
    "en": { "name": "Palms-Up Dumbbell Wrist Curl Over A Bench", "description": "Rest your forearms on a bench and curl your wrists upward holding dumbbells palms up." },
    "fr": { "name": "Flexion poignets haltères sur banc", "description": "Avant-bras posés sur un banc, fléchissez les poignets vers le haut avec haltères en supination." }
  },
  "168": {
    "en": { "name": "Plate Pinch", "description": "Hold two or more plates together with a pinch grip for as long as possible." },
    "fr": { "name": "Pincement de disques", "description": "Pincez deux poids ou plus ensemble le plus longtemps possible." }
  },
  "169": {
    "en": { "name": "Rickshaw Carry", "description": "Lift the rickshaw frame and walk for a given distance to build grip and core strength." },
    "fr": { "name": "Marche avec cadre Rickshaw", "description": "Soulevez le cadre rickshaw et marchez sur une distance donnée." }
  },
  "170": {
    "en": { "name": "Seated Dumbbell Palms-Down Wrist Curl", "description": "Sit on a bench, rest your forearms on your thighs, and extend your wrists upward." },
    "fr": { "name": "Extension poignets haltères assis", "description": "Assis, avant-bras sur les cuisses, remontez les poignets vers le haut en pronation." }
  },
  "171": {
    "en": { "name": "Seated Dumbbell Palms-Up Wrist Curl", "description": "Sit on a bench, rest your forearms on your thighs, and curl your wrists upward." },
    "fr": { "name": "Flexion poignets haltères assis", "description": "Assis, avant-bras sur les cuisses, fléchissez les poignets vers le haut en supination." }
  },
  "172": {
    "en": { "name": "Seated One-Arm Dumbbell Palms-Down Wrist Curl", "description": "Sit and rest one forearm on your thigh, extending your wrist upward with a dumbbell." },
    "fr": { "name": "Extension poignet unilatérale haltère", "description": "Assis, un avant-bras sur la cuisse, remontez le poignet vers le haut avec un haltère." }
  },
  "173": {
    "en": { "name": "Seated One-Arm Dumbbell Palms-Up Wrist Curl", "description": "Sit and rest one forearm on your thigh, curling your wrist upward with a dumbbell." },
    "fr": { "name": "Flexion poignet unilatérale haltère", "description": "Assis, un avant-bras sur la cuisse, fléchissez le poignet vers le haut avec un haltère." }
  },
  "174": {
    "en": { "name": "Seated Palm-Up Barbell Wrist Curl", "description": "Sit and rest your forearms on your thighs, curling your wrists upward with a barbell." },
    "fr": { "name": "Flexion poignets barre assis", "description": "Assis, avant-bras sur les cuisses, fléchissez les poignets vers le haut avec une barre." }
  },
  "175": {
    "en": { "name": "Seated Palms-Down Barbell Wrist Curl", "description": "Sit and rest your forearms on your thighs, extending your wrists upward with a barbell." },
    "fr": { "name": "Extension poignets barre assis", "description": "Assis, avant-bras sur les cuisses, remontez les poignets vers le haut avec une barre." }
  },
  "176": {
    "en": { "name": "Seated Two-Arm Palms-Up Low-Pulley Wrist Curl", "description": "Sit in front of a low pulley and curl the straight bar upward with your wrists." },
    "fr": { "name": "Flexion poignets poulie basse assis", "description": "Assis devant une poulie basse, fléchissez les poignets vers le haut avec la barre droite." }
  },
  "177": {
    "en": { "name": "Standing Olympic Plate Hand Squeeze", "description": "Stand and pinch a heavy weight plate with your fingers and thumb to build pinch strength." },
    "fr": { "name": "Pincement de disque debout", "description": "Debout, pincez un disque de poids lourd avec les doigts pour renforcer la poigne." }
  },
  "178": {
    "en": { "name": "Standing Palms-Up Barbell Behind The Back", "description": "Stand and hold a barbell behind your back, curling your wrists upward." },
    "fr": { "name": "Flexion poignets barre dans le dos", "description": "Debout, tenez une barre derrière le dos et fléchissez les poignets vers le haut." }
  },
  "179": {
    "en": { "name": "Wrist Circles", "description": "Make circular motions with your wrists to warm up or strengthen them." },
    "fr": { "name": "Rotations des poignets", "description": "Effectuez des mouvements circulaires avec les poignets." }
  },
  "180": {
    "en": { "name": "Wrist Roller", "description": "Roll a suspended weight up and down by twisting the handle in your hands." },
    "fr": { "name": "Bobine Andrieu (Wrist Roller)", "description": "Enroulez et déroulez le câble d'un poids suspendu en tournant la poignée." }
  },
  "181": {
    "en": { "name": "Wrist Rotations with Straight Bar", "description": "Hold a straight bar and rotate your wrists up and down for forearms endurance." },
    "fr": { "name": "Rotations de barre droite", "description": "Tenez une barre droite et tournez les poignets vers le haut et le bas." }
  }
};

for (const [id, trans] of Object.entries(translations)) {
  if (en.exercise[id]) {
    en.exercise[id].name = trans.en.name;
    en.exercise[id].description = trans.en.description;
  }
  if (fr.exercise[id]) {
    fr.exercise[id].name = trans.fr.name;
    fr.exercise[id].description = trans.fr.description;
  }
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(frPath, JSON.stringify(fr, null, 2));
console.log('Translations updated and shortened.');
