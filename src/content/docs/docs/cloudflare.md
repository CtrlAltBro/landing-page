---
title: Déployer sur Cloudflare
description: Préparer PostgreSQL, KV, Hyperdrive et les secrets du Worker.
---

Ce parcours utilise le dépôt [CtrlAltBro/web-api](https://github.com/CtrlAltBro/web-api). Il déploie le dashboard et l’API ensemble. La landing et cette documentation sont un site statique séparé de cette API.

:::note[Avant de commencer]
Préparez un compte Cloudflare, une base PostgreSQL accessible depuis Cloudflare, Git, Node.js et npm. Utilisez une version de Node compatible avec le dépôt et avec `--env-file-if-exists`. Les étapes ci-dessous sont dérivées du code actuel et restent à vérifier sur une instance neuve.
:::

## 1. Préparer le projet

```sh
git clone https://github.com/CtrlAltBro/web-api.git
cd web-api
npm ci
cp .env.example .env.local
```

Renseignez `.env.local` :

```dotenv
DATABASE_URL=postgresql://utilisateur:mot-de-passe@hote/base?sslmode=verify-full
DATABASE_URL_UNPOOLED=postgresql://utilisateur:mot-de-passe@hote/base?sslmode=verify-full
BETTER_AUTH_SECRET=votre-secret-aleatoire
BETTER_AUTH_URL=http://localhost:5173
```

`DATABASE_URL_UNPOOLED` est optionnelle ; lorsqu’elle est définie, le script de migration l’utilise en priorité. Le code renforce `sslmode=require` en `verify-full` : votre serveur doit présenter un certificat valide pour son nom d’hôte.

Générez le secret Better Auth :

```sh
openssl rand -base64 32
```

Conservez ce secret pour la configuration du Worker. Ne publiez pas `.env.local`.

## 2. Initialiser la base

```sh
npm run db:migrate
```

Le script applique les fichiers SQL dans l’ordre et enregistre chaque migration dans `schema_migrations`. Une migration déjà appliquée ne doit pas être modifiée.

Pour découvrir le dashboard localement :

```sh
npm run dev
```

Le mode local utilise un KV simulé. Il ne crée pas votre infrastructure de production.

## 3. Créer les ressources Cloudflare

```sh
npx wrangler login
npx wrangler kv namespace create SIGNALS
npx wrangler hyperdrive create ctrlaltbro-db --caching-disabled --connection-string='postgresql://utilisateur:mot-de-passe@hote/base?sslmode=require'
```

La chaîne ci-dessus est un exemple : remplacez-la par votre connexion PostgreSQL. Elle contient un mot de passe ; évitez de la conserver dans un historique de terminal partagé.

Le cache de résultats Hyperdrive est désactivé ici pour que les lectures de règles et commandes reflètent les écritures récentes.

Dans `wrangler.jsonc`, remplacez les identifiants de ressources du projet original par **vos propres identifiants** :

- le namespace `SIGNALS` au niveau racine et dans `env.production.kv_namespaces` ;
- l’identifiant Hyperdrive dans `env.production.hyperdrive` ;
- le nom du Worker à la racine et dans `env.production`, si nécessaire.

Le fichier `.env.production` du dépôt sélectionne l’environnement de production via `CLOUDFLARE_ENV`. Vérifiez qu’il contient `CLOUDFLARE_ENV=production`.

## 4. Configurer les secrets de production

Choisissez l’URL publique de l’instance : URL `workers.dev` ou domaine personnalisé. `BETTER_AUTH_URL` doit être l’origine publique du dashboard, par exemple `https://parent.example.com`.

```sh
npx wrangler secret put DATABASE_URL --env production
npx wrangler secret put BETTER_AUTH_SECRET --env production
npx wrangler secret put BETTER_AUTH_URL --env production
npx wrangler secret put SIGNUP_ALLOWED_EMAILS --env production
```

Saisissez les valeurs à l’invite. Pour `SIGNUP_ALLOWED_EMAILS`, indiquez les adresses autorisées, séparées par des virgules, dont celle du premier compte parent. Sans cette variable, ou avec une valeur vide, les inscriptions sont ouvertes.

Hyperdrive est prioritaire sur `DATABASE_URL` lorsqu’il est configuré. La connexion directe reste utilisée dans l’environnement local.

## 5. Déployer et vérifier

```sh
npm run deploy
curl https://parent.example.com/api/health
```

Remplacez le domaine par celui de votre instance. La route de santé interroge PostgreSQL et doit renvoyer `{"ok":true}`.

Ouvrez le dashboard, créez le compte parent autorisé et générez un code d’appairage. Puis [installez l’agent Windows](/docs/windows/).

Pour un domaine personnalisé, ajoutez-le à votre Worker dans Cloudflare et utilisez cette même origine pour Better Auth et l’agent.

## Références

- [Configuration de Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Créer une configuration Hyperdrive](https://developers.cloudflare.com/hyperdrive/get-started/)
- [Secrets du Worker](https://developers.cloudflare.com/workers/configuration/secrets/)
