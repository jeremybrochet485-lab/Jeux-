# Jouer en ligne avec GitHub Pages

Le jeu est compatible avec un hébergement statique. GitHub Pages sert directement les fichiers du dossier `dist/` : les visiteurs n’ont rien à installer, aucun compte à créer et aucune commande à taper.

## Première mise en ligne

1. Connectez-vous à GitHub et ouvrez [le dépôt du jeu](https://github.com/jeremybrochet485-lab/Jeux-).
2. Pour un hébergement Pages gratuit avec GitHub Free, le dépôt doit être **public**. Vérifiez sa visibilité dans **Settings → General**. Si vous choisissez de le rendre public, GitHub rend aussi publics son code et son historique. Les fichiers du jeu sont seuls à être publiés sur le site. Un dépôt privé peut nécessiter une offre GitHub payante ; ne changez pas la visibilité si vous préférez conserver le code privé.
3. Dans **Settings → Pages**, sous **Build and deployment**, choisissez **GitHub Actions** dans **Source**. Ne choisissez pas la publication depuis une branche : le workflow utilise directement `dist/`.
4. Ouvrez **Actions → Publier le jeu sur GitHub Pages**, puis **Run workflow**. Sélectionnez **main**, puis confirmez **Run workflow**. Si Actions est désactivé pour le dépôt, autorisez d’abord les workflows GitHub Actions dans ses paramètres.
5. Attendez la réussite des deux tâches : **Vérifier et préparer le jeu**, puis **Mettre le jeu en ligne**. La première publication prend généralement quelques minutes.
6. Revenez dans **Settings → Pages**, puis cliquez sur **Visit site**. C’est l’adresse publiée par GitHub qui confirme la mise en ligne.

L’adresse attendue, une fois le déploiement réussi, est :

**https://jeremybrochet485-lab.github.io/Jeux-/**

Cette adresse n’est pas annoncée comme déjà active. Conservez le nom du dépôt et sa casse dans le lien. Aucun nom de domaine payant n’est nécessaire ; GitHub fournit le HTTPS.

## Ensuite

Ouvrez le lien dans votre navigateur, sélectionnez une difficulté et cliquez sur **Commencer l’aventure**. Les touches sont affichées sous le jeu. Le bouton **Son désactivé** active l’audio après votre clic, conformément aux règles du navigateur.

Vous pouvez partager cette adresse. Le record est enregistré sur chaque navigateur ; il n’est pas synchronisé entre les ordinateurs.

Après une modification des fichiers du jeu envoyée sur `main`, le workflow republie automatiquement le site, après validation des tests du moteur. Un changement de documentation seule ne déclenche pas de nouveau déploiement. Le lancement manuel reste possible à tout moment.

## Si le lien ne fonctionne pas

- **404 avant le premier déploiement** : vérifiez la source **GitHub Actions**, puis lancez le workflow manuellement. Un envoi du workflow avant l’activation de Pages peut échouer ; relancez-le après activation.
- **Erreur « Get Pages site » ou Pages introuvable** : activez Pages dans **Settings → Pages**. Vérifiez aussi que le dépôt et votre offre sont admissibles.
- **Le menu « Run workflow » manque** : ouvrez le workflow sur la branche `main` et assurez-vous d’être connecté avec les droits du propriétaire du dépôt.
- **Une tâche de déploiement attend une approbation** : si des protections sont configurées pour l’environnement `github-pages`, le propriétaire doit approuver le déploiement dans GitHub.
- **La version précédente s’affiche** : vérifiez que le dernier workflow est réussi, puis actualisez la page. Le cache Pages peut prendre un peu de temps à se mettre à jour.

## Ce qui est préservé

La publication ne change aucune règle du jeu, aucun personnage, aucun pouvoir ni les contrôles. Les exigences et décisions restent dans le dépôt. Le visage du boss et la musique demandée restent en attente des fichiers de référence, comme avant cette préparation.

Le workflow publie uniquement `dist/` ; serveur de développement, tests et documentation ne font pas partie du site. Il utilise les actions officielles GitHub Pages et leurs autorisations de déploiement automatiques. Aucun jeton personnel à renseigner et aucune dépendance à installer pour les visiteurs.

## Vérification avant publication

Les tests du moteur et du navigateur ont été exécutés depuis un serveur statique sous le chemin `/Jeux-/`, reproduisant le chemin d’un site de projet GitHub Pages. Le navigateur vérifie les ressources, le menu, le clavier, l’invisibilité, la pause, le son, les scènes de boss et de fin, le record et les commandes multitactiles. Cela confirme la compatibilité statique ; seul un déploiement GitHub réussi peut confirmer le lien public.

Pour refaire le contrôle avec un serveur statique déjà lancé :

```sh
TEST_URL=http://127.0.0.1:4173/Jeux-/ npm run test:browser
```

Playwright et Chromium ne servent qu’aux tests de développement ; les joueurs n’ont aucun outil à installer.

Sources : [workflow statique officiel](https://github.com/actions/starter-workflows/blob/main/pages/static.yml), [configuration de la publication](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
