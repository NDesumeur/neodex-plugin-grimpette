# Grimpette

Un jeu de conduite en pixel art : une petite voiture sur des collines sans fin, avec une vraie physique. Va le plus loin possible sans finir sur le toit ni tomber en panne d'essence.

*English version: [README.en.md](README.en.md)*

## Le garage

Avant chaque partie, tu passes au garage :

- **13 mondes** : Prairie (dès le début), Désert, Neige (ça glisse), Lune (on flotte), Forêt, Plage, Jungle, Marais (boueux), Canyon (pentes raides), Volcan, Mars (gravité faible), Cristaux et Ville la nuit, chacun avec son ciel, son décor et sa physique : la gravité, le sable et la boue qui freinent, la glace et le bitume qui roulent.
- **12 véhicules** : Jeep (équilibrée, dès le début), Monster, Bolide, Quad, Moto, Buggy, Tracteur, Van, Camion, Rallye, Rover (presque sans essence) et Hot-rod (le plus rapide). Chacun a son poids : les lourds retombent vite et tournent peu en l'air, les légers rebondissent ; la Moto et le Hot-rod se cabrent quand on accélère, et les propulsions ne poussent que par la roue arrière.
- **Améliorations**, pour chaque voiture : **moteur**, **pneus** (adhérence) et **réservoir**, sur 5 niveaux.

Terrains, voitures et améliorations s'achètent avec les **pièces** ramassées en course.

## Commandes

- Garage : **↑ ↓** choisir une ligne, **← →** changer, **Entrée** débloquer, améliorer ou partir.
- Course : **→** accélérer, **←** freiner. En l'air, **→** lève le nez et **←** le baisse.
- **P** ou **Échap** : pause. Après une partie, **Espace** ramène au garage.

## Voler

- **Tremplins** : après 90 m, des rampes en bois montent de plus en plus raides puis retombent d'un coup ; lancé, le véhicule décolle loin. Les bosses courtes des collines font aussi sauter dans les descentes rapides.
- En l'air, le véhicule **plane** un peu ; → lève le nez, ← le baisse.
- **Le vol rapporte** : une pièce par demi-seconde en l'air, 10 par **salto**, et 2 pour un **atterrissage parfait** (les deux roues posées ensemble, dans le sens de la pente), qui donne aussi un petit élan.
- **Nitro** (**Espace** ou **Maj**) : une poussée qui fait filer, même en l'air. Sa jauge bleue se remplit en volant, en faisant des saltos et en atterrissant à plat.
- **Le moteur** a son propre son pour chaque véhicule (grave pour le Tracteur et le Camion, aigu pour la Moto, doux pour le Rover) et monte avec la vitesse, l'accélération et le nitro.
- **Plein écran** : le bouton du même nom ; Échap pour en sortir. Sur un écran large, la scène s'élargit pour voir plus loin.

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
