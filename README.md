# WorkOut App

WorkOut est une application mobile complète développée avec **React Native** et **Expo**. Elle vous permet de suivre votre progression sportive, d'enregistrer vos séances de musculation et de gérer l'historique de vos exercices de façon simple et hors-ligne.

## Fonctionnalités

- **Base de données d'exercices** : Parcourez une liste complète d'exercices triés par groupes musculaires (Pectoraux, Dos, Jambes, Épaules, Bras, Abdos, etc.).
- **Exercices personnalisés** : Créez et ajoutez vos propres exercices à la base de données.
- **Suivi des séances** : Enregistrez vos séries, vos répétitions et vos poids pour chaque exercice.
- **Support unilatéral** : Suivez indépendamment le côté gauche et le côté droit pour les exercices unilatéraux.
- **Chronomètre de repos** : Un minuteur intelligent intégré (Bandeau chrono) accessible depuis n'importe quelle page pour chronométrer vos temps de repos entre deux séries.
- **Historique et Records** : Consultez vos anciennes séances et suivez votre progression au fil du temps.
- **Bilingue (i18n)** : L'application supporte entièrement le **Français** et l'**Anglais**.
- **100% Hors-ligne** : Toutes vos données sont sauvegardées localement sur votre téléphone de façon sécurisée via AsyncStorage.

## Stack Technique

- **Framework** : [React Native](https://reactnative.dev/) et [Expo](https://expo.dev/)
- **Navigation** : [Expo Router](https://docs.expo.dev/router/introduction/) (Routage basé sur les fichiers)
- **Style** : [NativeWind](https://www.nativewind.dev/) (TailwindCSS pour React Native) et StyleSheet
- **Stockage local** : @react-native-async-storage/async-storage
- **Icônes** : @expo/vector-icons (Feather)

## Démarrage rapide

### Prérequis

Assurez-vous d'avoir [Node.js](https://nodejs.org/) d'installé sur votre machine.

### Installation

1. Clonez le dépôt (ou téléchargez les sources) :
   ```bash
   git clone https://github.com/hugodbsr/WorkOut.git
   cd WorkOut
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez le serveur de développement :
   ```bash
   npx expo start
   ```

4. **Testez sur votre téléphone** :
   - Téléchargez l'application **Expo Go** sur votre appareil (iOS ou Android).
   - Scannez le code QR affiché dans votre terminal.
   - (Alternativement : appuyez sur 'a' pour lancer un émulateur Android, ou 'i' pour un simulateur iOS sur Mac).

## Structure du projet

- app/ : Les différentes pages de l'application (gérées par Expo Router).
- app/components/ : Les composants réutilisables de l'interface (Chrono, Boutons, Headers...).
- app/context/ : Les Contextes React (comme le TimerContext pour le chrono global).
- services/ : La logique de l'application (appels de données, stockage local, traductions).
- src/data/ : La base de données JSON des exercices, les traductions, et les images/GIFs.
- assets/ : Les polices d'écriture et les icônes de l'application.
