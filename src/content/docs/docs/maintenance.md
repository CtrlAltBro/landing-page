---
title: Sauvegardes et mises à jour
description: Conserver les données, appliquer les migrations et entretenir les agents.
---

## Sauvegarder l’instance

La base PostgreSQL conserve notamment les comptes, appareils, règles, commandes, mesures et événements. Utilisez les sauvegardes de votre fournisseur ou un export PostgreSQL, puis vérifiez une restauration dans une base séparée.

Conservez également, dans un stockage sécurisé :

- le secret Better Auth et la configuration des URL ;
- la configuration Cloudflare, avec vos identifiants de ressources ;
- la version du code déployé et l’état des migrations.

KV contient des signaux de coordination. Les caches de jetons et la présence peuvent être reconstruits par les contacts des agents ; une restauration de la base ne rétablit pas instantanément toute la présence ni tous les signaux KV.

## Mettre à jour le serveur

1. Sauvegardez la base et relevez la version actuellement déployée.
2. Récupérez la version du code choisie et consultez les nouvelles migrations.
3. Installez les dépendances avec `npm ci`.
4. Configurez `.env.local` pour cibler la bonne base et lancez `npm run db:migrate`.
5. Vérifiez les ressources et secrets de production, puis lancez `npm run deploy`.
6. Testez `/api/health`, une connexion parent et la synchronisation d’un PC.

Ne modifiez pas une migration déjà appliquée. Revenir à un ancien Worker ne revient pas automatiquement à un ancien schéma PostgreSQL : vérifiez leur compatibilité avant un retour arrière.

## Mettre à jour Windows

Le code examiné ne fournit pas de mécanisme de téléchargement et d’installation automatique des mises à jour du service. Utilisez un installateur construit depuis la version choisie, lancé avec les droits administrateur.

Le script d’installation conserve la configuration précédente lorsque serveur, comptes ou code d’appairage sont laissés vides. Vérifiez le statut, les comptes surveillés et une règle après la mise à jour.

## Restaurer l’état d’un PC

Les données locales résident dans `%ProgramData%\CtrlAltBro`. Le jeton est chiffré par DPAPI en portée machine : copier `device.json` sur une autre machine ne constitue pas une restauration fiable de l’appairage. Sur une nouvelle installation Windows, prévoyez un nouvel appairage.

## Rétention

Le dépôt actuel ne fournit pas de politique automatique de rétention des mesures de temps d’écran et d’historique. Prévoyez une politique adaptée à votre instance et à vos sauvegardes. Supprimer un appareil dans le dashboard révoque son accès et supprime ses données associées ; faites une sauvegarde avant une suppression si vous souhaitez les conserver.
