# Décisions de la version 0.1

La demande explicite de développer un jeu dans le dépôt vide remplace l’attente historique indiquée dans le cahier joint. Le document reste une référence d’exigences, et non une instruction de suspendre cette demande.

## Décision confirmée pendant le développement

La barre spéciale se charge lorsque les **attaques du héros touchent les ennemis**. Le joueur a choisi cette option dans la conversation.

## Propositions utilisées pour rendre le niveau 1 jouable

Ces choix sont configurables et ne sont pas présentés comme des décisions antérieures de l’utilisateur :

| Sujet              | Proposition implémentée                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Niveau             | Parc horizontal de 3 400 unités ; 8 gardes ; arène ouverte après leur élimination                                              |
| Boss               | Fin du niveau 1, 95 PV dans les trois modes, portail après sa défaite                                                          |
| Invisibilité       | I ; sans coût ; 10 s ; recharge 25 s depuis activation ; attaques autorisées ; boss détecte toujours                           |
| Pièces             | Amélioration automatique tous les 10 ramassages, conservation du compteur, remise à zéro au recommencement                     |
| Pouvoirs améliorés | Tir +0,35/rang, tentacules +1/rang, Nova +2/rang ; durée d’invisibilité inchangée                                              |
| Spécial            | +12 par impact ; soin / énergie / tempête équiprobables ; activation R ; une réserve ; remise à zéro après activation          |
| Glace              | 12 dégâts de base, ralentit 2 s ; projectiles renvoyables                                                                      |
| Fumée              | Rayon 65 ; durée 5 s ; 7 dégâts de base par pulsation ; non bloquée par bouclier                                               |
| Modes              | Gardes 3/4/5 PV ; multiplicateurs de dégâts 0,65/1/1,4 ; tirs toutes les 2,4/1,8/1,3 s                                         |
| Boss               | Feu : 19 dégâts ; tirs doubles toutes les 1,4 s, triples toutes les 1 s sous 50 % de vie ; aucun allègement en Facile          |
| Sauvegarde         | Record seulement, via localStorage ; fonctionnement conservé si stockage indisponible                                          |
| Audio              | Deux compositions originales de remplacement ; audio sur interaction explicite ; pause musicale pendant pause et écrans de fin |

## Limitations de fidélité

- Pas de copie du jeu ancien ni de ses ressources : niveaux 2 et 3 hors de cette première réalisation. Aucun ancien fichier n’a été supprimé.
- Références 0–4 absentes : interprétations vectorielles des descriptions, visage du boss provisoire.
- Musique Spider-Man et piste du boss non fournies : compositions originales annoncées comme telles.
- Validation tactile en Chromium avec deux points de contact natifs simulés ; aucun appareil physique testé.
- Fluidité vérifiée au fonctionnement dans Chromium, sans certification de performances sur tous les ordinateurs.
