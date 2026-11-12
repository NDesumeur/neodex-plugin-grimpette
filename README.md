# Grimpette

Un jeu de conduite en pixel art : une petite voiture sur des collines sans fin, avec une vraie physique. Va le plus loin possible sans finir sur le toit ni tomber en panne d'essence.

*English version: [README.en.md](README.en.md)*

## Le garage

Avant chaque partie, tu passes au garage :

- **Terrain** : Prairie (dès le début), Désert, Neige (ça glisse) et Lune (on flotte).
- **Voiture** : Jeep (équilibrée, dès le début), Monster (grosses roues, grimpe tout) et Bolide (très rapide, boit beaucoup).
- **Améliorations**, pour chaque voiture : **moteur**, **pneus** (adhérence) et **réservoir**, sur 5 niveaux.

Terrains, voitures et améliorations s'achètent avec les **pièces** ramassées en course.

## Commandes

- Garage : **↑ ↓** choisir une ligne, **← →** changer, **Entrée** débloquer, améliorer ou partir.
- Course : **→** accélérer, **←** freiner. En l'air, **→** lève le nez et **←** le baisse.
- **P** ou **Échap** : pause. Après une partie, **Espace** ramène au garage.

## Comment ça marche

- Si le **toit** touche le sol, la partie est finie.
- L'essence baisse en roulant : attrape les **bidons rouges** pour refaire le plein.
- Un **salto** complet rapporte 10 pièces.
- Un **record** en mètres est gardé pour chaque terrain.

## Données et synchronisation

Tes pièces, tes voitures et tes records sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Grimpette → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
