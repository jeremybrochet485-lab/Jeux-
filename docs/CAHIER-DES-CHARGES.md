# Cahier des charges — Héros Bleu
## Version à transférer dans Codex

**Date :** 11 octobre 2026  
**Statut :** exigences enregistrées ; modifications du jeu en attente d’une instruction explicite de l’utilisateur.  
**Projet :** « Héros Bleu — Le pouvoir des tentacules ».

> **Instruction prioritaire à Codex : ne pas modifier le jeu pour l’instant.**
>
> Lire ce document, examiner les références et conserver les exigences. L’utilisateur a expressément demandé d’attendre qu’il donne l’ordre de faire les modifications. La réception de ce document ou du dossier de transfert ne constitue pas cet ordre. En attendant, ne pas éditer le code ou les ressources du jeu, générer de nouveaux éléments pour le jeu, ni publier une nouvelle version.
>
> Les points marqués « à préciser » ne sont pas des décisions prises par l’utilisateur. Les clarifier avant une implémentation qui en dépend, ou présenter des propositions quand les modifications seront autorisées.

## 1. Objectif et historique de la demande

L’utilisateur souhaitait d’abord une mini-vidéo animée de son beau-fils dans un univers de super-héros, combattant un méchant avec des super-pouvoirs. L’image d’origine représente un héros bleu avec une étoile rouge sur la poitrine et des tentacules violets.

Une vidéo animée de 21 secondes a ensuite été créée : combat de super-héros, tentacules, bouclier, énergie bleue et victoire, avec sons et musique synthétisés. Cette réalisation constitue le contexte visuel du projet ; la nouvelle demande ne porte pas sur une modification de cette vidéo.

L’utilisateur a ensuite demandé un petit jeu vidéo jouable. Une première version a été réalisée avec ce héros, des robots ennemis, des pouvoirs et trois missions. La demande actuelle consiste à **consigner les évolutions souhaitées et préparer ce cahier des charges**, pour les transférer dans Codex. Aucune évolution décrite ci-dessous n’est autorisée à être appliquée maintenant.

## 2. Première version du jeu : base à conserver

### 2.1 Accès et projet existant

| Élément | Valeur constatée |
| --- | --- |
| Titre | Héros Bleu — Le pouvoir des tentacules |
| Jeu existant | https://heros-bleu-tentacules.spryslug64.chatgpt.site |
| Accès | Site privé du propriétaire |
| Dossier du projet dans l’environnement d’origine | `/workspace/sites/heros-bleu` |
| Identifiant du projet | `appgprj_6aca127b61248191b2ba3123bc670d69` |
| Commit de référence | `093c12e6b43cf7dd467cc4d925303d35a9d14084` |
| Architecture | Jeu statique en HTML, CSS et modules JavaScript ; rendu Canvas 2D ; sons Web Audio |
| Enregistrement actuel | Record local sur l’appareil |

Le dossier de transfert joint contient le présent cahier et les images de référence. Il ne contient pas une copie du dépôt du jeu. Dans un nouvel environnement Codex, fournir aussi l’accès au projet existant avant toute future intervention. Éviter de recréer un jeu différent en perdant les fonctionnalités déjà réalisées.

### 2.2 Héros et gameplay actuels

Le héros conserve son identité : costume bleu, étoile rouge, lunettes, cheveux châtains et tentacules violets, d’après la référence 0.

Fonctionnalités déjà présentes à préserver :

- déplacement horizontal, saut et double saut ;
- tirs d’énergie bleue ;
- attaque avec les tentacules ;
- bouclier permettant de renvoyer les projectiles ennemis arrivant de face ;
- Nova, une attaque puissante disponible lorsque l’énergie est pleine ;
- vie, énergie, score, objets à ramasser et record local ;
- progression par missions, portail de sortie après élimination des ennemis ;
- pause, reprise, recommencement et écran de victoire ;
- commandes au clavier et commandes tactiles, y compris plusieurs doigts simultanément ;
- commandes audio et présentation adaptée aux différentes tailles d’écran.

La nouvelle invisibilité s’ajoute à ces pouvoirs. Elle ne remplace ni les tentacules, ni le bouclier, ni les tirs, ni la Nova.

### 2.3 Missions et difficultés actuelles

La première version comporte :

1. **Les toits de la ville** ;
2. **L’invasion des robots** ;
3. **Le Méchant Vert**, avec le boss de la première version.

Les ennemis actuels sont des robots en armure sombre, avec des éléments verts et des tirs verts. Les difficultés actuelles sont « Découverte » et « Super-héros ». La nouvelle demande prévoit des ennemis, un boss, un décor et des difficultés différents.

La nouvelle description concerne le premier niveau. Le devenir précis du boss actuel de la troisième mission et l’application des nouveautés aux autres missions restent à préciser. Ne pas supprimer les autres missions par défaut.

### 2.4 Commandes actuelles

| Action | Clavier ou souris |
| --- | --- |
| Déplacement | Flèches gauche/droite, Q/D ou A/D |
| Saut et double saut | Espace, flèche haut, Z ou W |
| Tir d’énergie | J ; maintien pour tirer en continu ; clic dans le jeu également disponible |
| Tentacules | K ou X |
| Bouclier | Maintenir L ou C |
| Nova | E ou M |
| Pause et reprise | P ou Échap |

Les boutons tactiles correspondent aux déplacements, au saut, au tir, aux tentacules et au bouclier ; la Nova possède également un bouton. Prévoir une commande accessible pour les nouveaux pouvoirs, après autorisation de les intégrer. La touche de l’invisibilité n’a pas été choisie.

## 3. Références visuelles fournies

Les fichiers du dossier `references/` sont des copies des images fournies, sans retouche. Les numéros 1 à 4 correspondent à la dernière demande de l’utilisateur ; le numéro 0 désigne l’image initiale du héros.

| N° | Fichier dans le dossier de transfert | Utilisation |
| --- | --- | --- |
| 0 | `references/00-heros-original.png` | Identité et apparence du héros |
| 1 | `references/01-decor-niveau-1.jpg` | Décor du premier niveau |
| 2 | `references/02-ennemis-glace-fumee.jpg` | Apparence des ennemis ordinaires du niveau |
| 3 | `references/03-costume-boss.jpg` | Costume du boss |
| 4 | `references/04-visage-boss.jpg` | Visage du boss |

### Référence 0 — héros

Personnage en costume bleu, grande étoile rouge à cinq branches sur le torse, lunettes rectangulaires, cheveux châtains et quatre tentacules violets segmentés avec extrémités pointues. Conserver cette identité lors des animations et des nouveaux pouvoirs.

### Référence 1 — décor

Dessin montrant, de gauche à droite :

- un grand immeuble gris avec des fenêtres jaunes ;
- une structure de balançoires brune, avec deux balançoires ;
- un toboggan bleu avec une échelle grise ;
- une maison claire à droite, toit triangulaire orange, fenêtres jaunes et porte sombre ;
- une bande jaune au sol autour des équipements de jeu.

Reprendre les éléments et la composition du dessin pour le premier niveau. La photographie du papier et du support n’est pas elle-même un élément du décor. La présence des balançoires et du toboggan ne constitue pas une demande de nouvelles interactions physiques avec ces objets.

### Référence 2 — ennemis ordinaires

Personnage rouge, yeux verts anguleux, larges bandes jaunes en forme de X autour du ventre, pistolets sombres. Les traits bleus illustrent les tirs de glace ; le nuage vert correspond à la fumée toxique.

Tous les ennemis ordinaires de ce niveau doivent suivre ce même modèle. Le boss possède son propre modèle.

### Références 3 et 4 — assemblage du boss

Utiliser **le costume de la référence 3 avec le visage de la référence 4**.

Le costume est de type bouffon ou clown : bonnet à trois pointes de couleurs bleu/turquoise, rouge/bordeaux et jaune/orange, avec grelots ; col haut bordeaux bordé de jaune ; veste bleue avec manches et détails rouges/bordeaux.

La photo 4 fournit le visage, avec ses cheveux bruns, ses grands yeux et son sourire. Reprendre le visage reconnaissable dans le style graphique du jeu. Le visage de crâne dessiné dans l’image 3 ne doit pas remplacer celui demandé dans la photo 4. La tenue et la pose de la photo 4 ne sont pas les références du costume.

## 4. Nouvelles exigences enregistrées

### EX-01 — Décor du premier niveau

**Exigence confirmée :** le décor du premier niveau doit ressembler au dessin 1.

Conserver les éléments reconnaissables du dessin et une lisibilité suffisante pour les déplacements, les projectiles, les pièces et les ennemis. Les dimensions du niveau, les plateformes et la disposition des obstacles ne sont pas encore fixées.

### EX-02 — Invisibilité du héros

**Exigences confirmées :**

- ajouter un pouvoir d’invisibilité ;
- une utilisation dure **10 secondes** ;
- du point de vue du joueur, le personnage apparaît **vert** pendant son utilisation, afin de rester visible pour celui qui joue ;
- conserver les pouvoirs précédents ;
- l’invisibilité **ne fonctionne pas contre le boss**.

Interprétation de gameplay à valider : les ennemis ordinaires ne détectent plus le héros pendant l’effet. L’utilisateur n’a pas demandé une invulnérabilité ; ne pas supposer que l’invisibilité empêche tous les dégâts ou les collisions.

À préciser : touche ou bouton, coût éventuel, temps de recharge, nombre d’utilisations, effet des attaques du héros sur l’invisibilité et réaction aux projectiles déjà tirés. Préciser aussi si le boss continue à détecter le héros invisible ou si le pouvoir est désactivé durant son combat.

Pour une durée cohérente, les 10 secondes devront être comptées dans le temps de jeu actif ; une pause ne devra pas consommer l’effet. Le héros retrouve son apparence normale à la fin.

### EX-03 — Pièces et améliorations

**Exigence confirmée :** placer des pièces à ramasser ; **10 pièces donnent une amélioration des pouvoirs**.

Prévoir un compteur de pièces clair, distinct du score. Les étoiles, bonus d’énergie et soins déjà présents ne sont pas automatiquement assimilés à ces pièces.

À préciser :

- amélioration automatique ou choix du joueur ;
- pouvoirs concernés et effet concret de chaque amélioration ;
- consommation ou conservation des 10 pièces ;
- répétition éventuelle de l’amélioration à 20, 30 pièces, etc. ;
- conservation des pièces et améliorations entre les niveaux ou après une défaite.

La durée d’invisibilité demandée reste de 10 secondes. Ne pas décider de la prolonger dans une amélioration sans validation de l’utilisateur.

### EX-04 — Barre bleue et spécial aléatoire

**Exigences confirmées :**

- ajouter une **barre bleue en haut à gauche** ;
- elle se remplit progressivement « **au toucher des ennemis** » ;
- lorsqu’elle est pleine, elle donne un **spécial aléatoire**.

Le sens de « au toucher des ennemis » doit être précisé : est-ce lorsque le héros touche un ennemi avec une attaque, lorsqu’un ennemi touche ou blesse le héros, ou dans les deux situations ? Cette phrase est conservée telle quelle pour éviter d’inventer la règle.

La nouvelle barre doit être identifiable et distincte de la jauge d’énergie existante, qui sert déjà aux tentacules, au bouclier et à la Nova. Aucun remplacement de cette jauge n’a été demandé.

À préciser : quantité gagnée à chaque événement, liste des spéciaux, probabilités, attribution ou déclenchement immédiat, commande d’activation, remise à zéro, stockage éventuel d’un spécial et fonctionnement face au boss. Ne pas réduire le spécial aléatoire à la seule Nova par défaut.

### EX-05 — Ennemis ordinaires du niveau

**Exigences confirmées :**

- tous les ennemis ordinaires du niveau sont identiques, d’après le dessin 2 ;
- leurs pistolets tirent de la **glace** ;
- ils produisent de temps en temps de la **fumée toxique**.

Rendre les deux attaques reconnaissables : glace bleue, fumée toxique verte. Les différences de difficulté peuvent modifier l’équilibrage ; elles ne doivent pas introduire des types visuels supplémentaires qui contredisent cette demande.

À préciser : dégâts, cadence, portée, fréquence de la fumée, zone et durée du nuage, ainsi que l’effet de la glace — ralentissement, immobilisation ou autre effet. L’utilisateur n’a pas fixé de valeurs.

### EX-06 — Boss de fin de niveau

**Exigences confirmées :**

- visage provenant de la photo 4 ;
- costume provenant de la photo 3 ;
- attaques avec des **boules de feu** ;
- plus de vie qu’un ennemi ordinaire ;
- l’invisibilité du héros ne fonctionne pas contre lui ;
- combat difficile quel que soit le mode choisi.

Le boss doit rester battable, avec des attaques compréhensibles et des possibilités d’esquive ou de riposte. « Difficile » ne signifie pas invincible.

**Placement à confirmer :** la demande commence par le premier niveau puis mentionne « le boss final du niveau ». La lecture la plus directe est un boss à la fin du premier niveau décrit. La première version possède déjà un boss dans la troisième mission. Confirmer le remplacement, l’ajout ou le déplacement prévu avant de changer cette structure.

À préciser : vie exacte, dégâts et rythme des boules de feu, mouvements, phases, conditions de victoire et comportement envers le héros invisible. Ne pas déduire que le boss doit être le même personnage que le héros à partir de la photo.

### EX-07 — Musique

**Exigences confirmées :**

- musique de **Spider-Man** dans le reste du jeu ;
- musique **angoissante** lorsque le joueur atteint le boss final.

Le morceau ou la version de Spider-Man n’a pas été indiqué et aucun fichier musical correspondant n’a été fourni. La piste du boss reste également à sélectionner. Ces ressources doivent être identifiées avant leur intégration ; ne pas présenter la musique synthétisée actuelle comme étant celle de Spider-Man.

Prévoir une transition au combat du boss, sans superposer les deux musiques. Conserver les commandes audio et respecter les contraintes de démarrage audio du navigateur. Préciser si « tout le reste du jeu » inclut les menus et les écrans de victoire ou de défaite.

### EX-08 — Choix de difficulté

**Exigence confirmée :** proposer exactement trois modes : **Facile**, **Moyen** et **Difficile**.

Ces choix remplacent les deux intitulés actuels. L’équilibrage peut faire varier la pression des ennemis, leurs dégâts, leur cadence ou d’autres paramètres, mais les valeurs ne sont pas fixées.

**Règle obligatoire : le boss reste difficile à battre dans les trois modes**, y compris Facile. Il peut être adapté au mode choisi tout en conservant une difficulté marquée.

## 5. Points à préciser avant une future mise en œuvre

| Sujet | Décision attendue |
| --- | --- |
| Barre bleue | Quels contacts ou impacts la remplissent ? |
| Spécial aléatoire | Liste des pouvoirs, probabilités, activation et remise à zéro |
| Amélioration pour 10 pièces | Effet, choix éventuel, répétition et consommation des pièces |
| Sauvegarde de progression | Pièces et améliorations conservées entre niveaux, après défaite ou entre sessions ? |
| Invisibilité | Commande, coût, recharge, effets des attaques et des collisions |
| Boss et invisibilité | Boss capable de détecter le héros ou pouvoir indisponible pendant le combat ? |
| Placement du boss | Boss du premier niveau, remplacement du boss actuel ou autre organisation ? |
| Étendue des modifications | Quels éléments doivent aussi s’appliquer aux niveaux 2 et 3 ? |
| Glace et fumée | Effets, dégâts, durées et cadences |
| Musique de Spider-Man | Morceau/version précis et fichier à utiliser |
| Musique du boss | Piste à utiliser et conditions de transition |
| Difficultés | Paramètres et valeurs d’équilibrage |

Ces questions ne suspendent pas la rédaction du cahier. Elles indiquent les décisions qui manquent pour une future implémentation. **Elles ne doivent pas être résolues arbitrairement pendant l’attente du feu vert.**

## 6. Repères techniques pour Codex

### 6.1 Fichiers du projet existant

| Fichier ou dossier, relatif au projet | Rôle actuel |
| --- | --- |
| `dist/index.html` | Menus, interface, HUD, boutons tactiles et écrans du jeu |
| `dist/style.css` | Styles et adaptation aux tailles d’écran |
| `dist/engine.mjs` | Modèle et règles du jeu |
| `dist/game.mjs` | Affichage Canvas, commandes et audio |
| `dist/assets/` | Images du héros, des ennemis et du décor |
| `tests/engine.test.mjs` | Vérifications des règles et de la progression |
| `tests/ui-render.mjs` | Vérification du rendu et événements simulés |
| `README.md` | Présentation et commandes |
| `.openai/hosting.json` | Identité du projet et dossier statique `dist` |

Ces informations servent à retrouver la base. Elles ne constituent pas une instruction d’édition.

### 6.2 Valeurs de la première version

Les valeurs suivantes décrivent la version existante ; elles ne sont pas des valeurs imposées par l’utilisateur pour les nouveautés.

| Mécanique existante | Valeur de référence |
| --- | --- |
| Vie initiale | 100 |
| Énergie initiale | 75 % |
| Régénération de l’énergie hors bouclier | 10 points de pourcentage par seconde |
| Tir d’énergie | Dégâts 1 ; intervalle minimal 0,26 seconde |
| Tentacules | Coût 25 % ; dégâts 3 ; recharge 0,8 seconde ; portée frontale inférieure à 280 unités |
| Bouclier | Consommation 24 % par seconde ; projectile renvoyé : dégâts 2 |
| Nova | Énergie pleine requise, consommée à l’usage ; dégâts 7 ; rayon 660 unités ; recharge 3 secondes |
| Robots ordinaires | 2 points de vie dans la mission 1 ; 3 dans la mission 2 |
| Ancien boss | 18 points de vie en Découverte ; 24 en Super-héros |
| Bonus existants | Étoile : 75 points ; énergie : +22 ; soin : +25 |
| Score | Ennemi vaincu : +150 ; ancien boss : +1 000 ; mission terminée : +300 |

Après une défaite, la version actuelle relance la mission avec la vie restaurée et le score de début de mission. Les règles de conservation des nouvelles pièces et améliorations devront être définies séparément.

## 7. Critères d’acceptation de la future version

Cette liste décrit les vérifications à effectuer **après autorisation et réalisation des modifications**. Elle ne prétend pas que les nouveautés sont déjà présentes.

- [ ] Le premier niveau reprend le décor du dessin 1.
- [ ] L’identité du héros et tous ses pouvoirs précédents sont conservés.
- [ ] L’invisibilité dure exactement 10 secondes de jeu actif.
- [ ] Le héros est visible en vert pour le joueur durant l’invisibilité, puis retrouve son apparence normale.
- [ ] L’invisibilité agit selon la règle validée sur les ennemis ordinaires, mais n’aide pas à échapper au boss.
- [ ] Les pièces sont ramassables et leur compteur est lisible.
- [ ] Le seuil de 10 pièces donne l’amélioration prévue, selon la règle validée.
- [ ] La nouvelle barre bleue apparaît en haut à gauche et se remplit selon les événements validés.
- [ ] Une barre pleine donne un spécial tiré dans la liste validée, avec le comportement d’activation prévu.
- [ ] Tous les ennemis ordinaires du niveau reprennent la référence 2.
- [ ] Leurs tirs de glace et leurs émissions occasionnelles de fumée toxique fonctionnent et sont reconnaissables.
- [ ] Le boss possède le visage de la photo 4 et le costume de la photo 3.
- [ ] Il lance des boules de feu, a plus de vie qu’un ennemi ordinaire et reste difficile dans chaque mode.
- [ ] La musique choisie de Spider-Man joue hors boss, et la piste angoissante prend le relais au boss.
- [ ] Les modes Facile, Moyen et Difficile sont sélectionnables.
- [ ] La pause, la reprise, la défaite, le recommencement, les portails et la victoire restent cohérents.
- [ ] Le clavier et le tactile donnent accès aux anciennes et aux nouvelles actions.
- [ ] Les autres missions restent jouables selon le périmètre validé.

La première version avait été vérifiée par 13 tests du moteur et par un rendu Canvas avec événements simulés. La mise en page et le gameplay complets n’avaient pas été vérifiés dans un véritable navigateur. Prévoir, pour la future version, des tests ciblés sur les nouvelles règles et une vérification réelle sur ordinateur et écran tactile, notamment pour les boutons, la nouvelle barre et les transitions audio.

## 8. Consigne de transfert

Transférer **`Heros-Bleu-transfert-Codex.zip`** pour disposer ensemble du cahier et des cinq images. Extraire l’archive en conservant le dossier `references/`. Le fichier Markdown séparé permet aussi de lire ou copier les consignes directement.

Texte de démarrage à donner à Codex :

> Voici le cahier des charges et les images du projet « Héros Bleu ». Pour l’instant, enregistre les exigences et prends connaissance de la base existante. Ne modifie aucun code, aucune ressource et ne publie rien. Attends que je te demande explicitement d’appliquer les modifications. Conserve les pouvoirs et fonctionnalités déjà réalisés. Les points marqués « à préciser » ne sont pas encore validés.

## Annexe — Consignes originales de la dernière demande

Le texte suivant conserve les formulations de l’utilisateur, notamment les passages qui doivent être précisés :

> je vais te donner des information pour modifier le jeu video ne modifie rien pour l'instant enregistre juste les information que je te donne fait les modif que au moment je te le dirais : le décor du 1er niveau doit être comme le dessin que je te met le heros bleu a comme nouveaux en gardant les précédant pouvoir ,pouvoir d'invisibilité=10 secondes en utilisation vu du joueur bonhomme vert il doit y avoir des pièces qu'on récupère 10=amélioration des pouvoirs . met une barre bleue en haut a gauche qui au toucher des ennemis se recharge au fur et a mesure et une fois la barre remplie elle donne speciale aleatoire.Tout les mechant de ce niveau sont pareils et leur pistolet tire de la glace et de temps en temps de la fumée toxique . dessin numéros 2.le boss final du niveau doit avoir le visage de la photo numéro 4 et le costume de la photo numero 3 il a comme pouvoir de lancer des boules de feu et a plus de vie qu'un mechant classique le pouvoir d invisibilité ne marche pas avec lui met une musique angoissante quand on est rendu au boss finale et tout le reste du jeu met la musique de spider man. le mode de diffculté sera au choix entre facile moyen difficile forcement le boss final est quoi qu'il arrive difficile a battre. fait moi un cahier des charges de toute cette conversation que je puisse transferer dans codex
