# Héros Bleu — Le pouvoir des tentacules

Première version jouable du **niveau 1 : Le parc sous la glace**, pour navigateur sur ordinateur, avec commandes tactiles complémentaires. Jeu de plateforme Canvas 2D, graphismes vectoriels originaux, sons Web Audio. Aucun compte, service externe ou téléchargement de ressource n’est nécessaire pour jouer.

## Démarrer

Prérequis : Node.js 20 ou supérieur (développement vérifié avec Node.js 24).

```sh
cd /workspace/Jeux-
npm start
```

Le serveur écoute sur le port 3000. Sur votre ordinateur, ouvrez `http://localhost:3000`. Changez le port avec `PORT=3001 npm start` si nécessaire. Il faut servir les fichiers par HTTP, et non ouvrir `index.html` directement. Aucun `npm install` n’est requis : l’application et le serveur n’ont aucune dépendance.

Tout le jeu se trouve dans `dist/`, prêt pour un hébergeur statique. Aucun site public ni GitHub Pages n’est activé par ce projet.

## Jouer

Sélectionnez **Facile**, **Moyen** ou **Difficile**, puis commencez. Éliminez les huit gardes, traversez le parc, battez le Bouffon embrasé et rejoignez le portail. Le boss garde 95 points de vie, ses attaques et sa seconde phase dans les trois modes.

| Action                                     | Commandes                       |
| ------------------------------------------ | ------------------------------- |
| Déplacement                                | ← / →, Q / D ou A / D           |
| Saut et double saut                        | Espace, ↑, Z ou W               |
| Tir bleu continu                           | Maintenir J ou clic dans le jeu |
| Tentacules                                 | K ou X                          |
| Bouclier et renvoi des projectiles de face | Maintenir L ou C                |
| Nova, énergie pleine                       | E ou M                          |
| Invisibilité                               | I                               |
| Spécial aléatoire                          | R                               |
| Pause / reprise                            | P ou Échap, ou bouton de pause  |

Sur écran tactile, les boutons permettent de bouger et d’utiliser un pouvoir simultanément. Le jeu se met en pause quand la fenêtre perd le focus. Le son est désactivé par défaut ; activez-le avec le bouton en haut à droite.

## Règles de cette version

- Identité du héros : costume bleu, étoile rouge, cheveux bruns, lunettes, quatre tentacules violets segmentés.
- Parc : immeuble gris aux fenêtres jaunes, deux balançoires brunes, toboggan bleu et échelle grise, maison claire au toit orange, bande jaune au sol.
- Gardes identiques : rouges, yeux verts, bandes jaunes en X, pistolets sombres ; tirs de glace bleus et fumée toxique verte.
- Invisibilité de **10 secondes de jeu actif**, apparence verte, recharge de 25 secondes à partir de l’activation, sans coût d’énergie. Les gardes ne visent plus le héros ; les attaques du héros n’interrompent pas l’effet. Projectiles existants, contacts et fumée restent dangereux. Le boss continue à le détecter.
- Une amélioration automatique à chaque lot de 10 pièces. Les pièces restent dans le compteur ; tirs +0,35 dégât/rang, tentacules +1, Nova +2. L’invisibilité ne s’allonge pas. La progression est réinitialisée au recommencement ; seul le record est conservé localement.
- Barre spéciale bleue en haut à gauche, distincte de l’énergie : **+12 par impact réussi sur un ennemi**, conformément au choix de l’utilisateur. À 100, un spécial est choisi avec probabilités égales : soin (+45 vie), énergie pleine, ou tempête de glace (dégâts et gel de 4 s dans un rayon de 700). R l’active et remet la barre à zéro ; une seule réserve, pas de charge pendant qu’un spécial est stocké. Fonctionne contre le boss.
- Glace : ralentissement de 2 s ; nuages toxiques : durée 5 s, dégâts périodiques. Le bouclier peut renvoyer glace et feu arrivant de face, mais ne protège pas du contact ni de la fumée.
- Boss plus résistant, tirs de feu doubles puis triples sous 50 % de vie, même puissance dans chaque mode. Les difficultés modifient les gardes, pas l’identité visuelle.
- Étoiles, soins et bonus d’énergie restent distincts des pièces. Chaque ennemi vaincu rend 8 points d’énergie.

Les choix d’équilibrage non définis par le cahier sont des propositions d’implémentation, répertoriées dans [les décisions](docs/DECISIONS.md).

## Références encore nécessaires

Seul le Markdown a été fourni ; les cinq images et l’ancien code n’étaient pas accessibles dans ce dépôt vide. Cette réalisation est une nouvelle base pour le niveau 1. Les niveaux 2 et 3 de l’ancien projet n’ont pas été importés et ne sont pas annoncés comme disponibles.

Les personnages et le décor sont dessinés d’après les descriptions. **Le visage humain du boss est provisoire**, en attendant la photo 4 et le costume de la référence 3. Aucun visage de crâne n’est utilisé. Fournir les cinq références permettra d’améliorer la fidélité visuelle.

Les musiques d’exploration et de boss sont **originales, synthétisées**, avec une transition vers une ambiance plus inquiétante. Ce n’est pas la musique de Spider-Man. Son intégration attend le morceau exact et un fichier utilisable. Aucun extrait musical n’a été récupéré arbitrairement.

Le cahier original est conservé dans `docs/CAHIER-DES-CHARGES.md`. Sa consigne historique d’attente a été supersédée par la demande explicite de l’utilisateur de créer ce projet et d’envoyer les fichiers sur GitHub.

## Vérifications

```sh
npm test
# Avec le serveur déjà démarré, Playwright et Chromium disponibles :
npm run test:browser
```

Les 19 tests du moteur portent notamment sur le double saut, les améliorations, les impacts, les trois spéciaux, la Nova, les tentacules, le bouclier, la glace, la fumée, le boss, la pause, la défaite et la victoire. Une simulation complète utilise les vrais tirs (avec protection contrôlée du joueur pour vérifier la progression).

Le test navigateur utilise Playwright et Chromium. Ils sont déjà présents dans l’environnement cloud de développement. Pour une autre machine, installez les outils **hors du dépôt** :

```sh
npm install --prefix /tmp/heros-bleu-browser-tools --no-save playwright@1.56.1
NODE_PATH=/tmp/heros-bleu-browser-tools/node_modules CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
```

Adaptez `CHROMIUM_PATH` au navigateur installé. `TEST_URL` remplace l’adresse du serveur et `ARTIFACT_DIR` le dossier des captures (par défaut `/tmp/heros-bleu-tests`). Le test contrôle menu, clavier, appuis brefs, saut, invisibilité, pause, audio, aide, scènes de boss/victoire/défaite et deux touches tactiles natives simultanées. Certaines transitions utilisent des états préparés via `?test=1`, uniquement pour les tests. Cela ne remplace pas un essai humain de l’équilibrage ni une validation sur appareil tactile physique.

## Structure

- `dist/engine.mjs` : règles et simulation indépendantes de l’affichage.
- `dist/render.mjs` : dessins, décors, animations et effets Canvas.
- `dist/game.mjs` : boucle de jeu, commandes et interface.
- `dist/audio.mjs` : sons et compositions originales.
- `dist/index.html`, `dist/style.css` : interface et adaptation aux écrans.
- `server.mjs` : serveur statique de développement.
- `tests/` : tests du moteur et du navigateur.
- `.github/workflows/test.yml` : vérification du moteur à chaque push et PR.
