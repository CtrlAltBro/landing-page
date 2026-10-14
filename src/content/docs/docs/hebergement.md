---
title: Choisir son hébergement
description: Ce qui est disponible pour votre instance et ce qui reste à préparer pour un VPS.
---

## Votre instance sur Cloudflare

C’est le parcours disponible dans le dépôt actuel. Vous exploitez :

- un Worker Cloudflare qui sert le dashboard React et l’API Hono ;
- un namespace Workers KV pour la présence des PC et les signaux de synchronisation ;
- une base PostgreSQL, développée avec Neon mais accessible via le pilote `pg` ;
- Hyperdrive en production pour gérer les connexions à PostgreSQL.

Better Auth stocke les comptes dans votre base PostgreSQL. L’agent connaît uniquement l’URL publique de l’API et son jeton d’appareil, obtenu lors de l’appairage.

Les données passent par votre instance Cloudflare et votre fournisseur PostgreSQL. Héberger sa propre instance permet de choisir ces comptes et cette base ; cela conserve une dépendance à Cloudflare.

[Déployer cette instance →](/docs/cloudflare/)

## Tout héberger sur un VPS ou un NAS

Le dépôt ne propose actuellement ni Docker Compose, ni image serveur autonome, ni point d’entrée Node pour servir l’API et le dashboard.

Pour rendre ce parcours disponible, il faut fournir :

| Composant        | Adaptation nécessaire                                                           |
| ---------------- | ------------------------------------------------------------------------------- |
| API Hono         | Un point d’entrée serveur et les variables d’environnement                      |
| Dashboard        | Le service des fichiers statiques et le routage de l’application                |
| `SIGNALS`        | Un stockage avec `get`, `put`, `delete` et expiration pour remplacer Workers KV |
| Tâches différées | Une alternative à `executionCtx.waitUntil`                                      |
| PostgreSQL       | Connexions et migrations adaptées au runtime choisi                             |
| Exploitation     | HTTPS, configuration persistante, sauvegardes et packaging                      |

Ce guide ne propose donc pas de commande Docker qui donnerait l’impression que ce parcours est déjà prêt.

## Préparer le PC

La protection repose sur un enfant utilisant un **compte Windows standard**, avec un compte administrateur distinct pour le parent. Un administrateur conserve le contrôle de la machine et peut modifier ou retirer le service.

Les règles et compteurs sont associés au **PC** dans le dashboard. Plusieurs comptes peuvent être surveillés, mais il ne s’agit pas encore de profils enfant indépendants avec leurs propres quotas.
