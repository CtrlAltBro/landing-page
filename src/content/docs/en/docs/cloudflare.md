---
title: Deploy on Cloudflare
description: Prepare PostgreSQL, KV, Hyperdrive and Worker secrets.
---

Use the [CtrlAltBro/web-api](https://github.com/CtrlAltBro/web-api) repository. The dashboard and API deploy together. The landing page and this documentation are a separate static site.

:::note[Before you start]
Prepare a Cloudflare account, a PostgreSQL database reachable from Cloudflare, Git, Node.js and npm. Choose a Node version compatible with the repository and `--env-file-if-exists`. These steps come from the current code and still need validation on a fresh instance.
:::

## 1. Prepare the project

```sh
git clone https://github.com/CtrlAltBro/web-api.git
cd web-api
npm ci
cp .env.example .env.local
```

Fill in `.env.local`:

```dotenv
DATABASE_URL=postgresql://user:password@host/database?sslmode=verify-full
DATABASE_URL_UNPOOLED=postgresql://user:password@host/database?sslmode=verify-full
BETTER_AUTH_SECRET=your-random-secret
BETTER_AUTH_URL=http://localhost:5173
```

`DATABASE_URL_UNPOOLED` is optional. When set, migrations use it first. The code strengthens `sslmode=require` to `verify-full`, so your database needs a certificate valid for its hostname.

Generate the Better Auth secret:

```sh
openssl rand -base64 32
```

Keep this secret for the Worker configuration. Do not publish `.env.local`.

## 2. Initialize the database

```sh
npm run db:migrate
```

The script applies SQL files in order and records each migration in `schema_migrations`. Do not edit an applied migration.

To explore the dashboard locally:

```sh
npm run dev
```

Local development uses simulated KV storage and does not create production infrastructure.

## 3. Create Cloudflare resources

```sh
npx wrangler login
npx wrangler kv namespace create SIGNALS
npx wrangler hyperdrive create ctrlaltbro-db --caching-disabled --connection-string='postgresql://user:password@host/database?sslmode=require'
```

Replace the sample connection string with yours. It contains a password: avoid retaining it in shared shell history. Hyperdrive query caching is disabled here so rules and commands reflect recent writes.

In `wrangler.jsonc`, replace the original project’s resource IDs with **your own IDs**:

- the `SIGNALS` namespace at the root and in `env.production.kv_namespaces`;
- the Hyperdrive ID in `env.production.hyperdrive`;
- the Worker name at the root and in `env.production`, if needed.

The repository’s `.env.production` selects production using `CLOUDFLARE_ENV`. Check that it contains `CLOUDFLARE_ENV=production`.

## 4. Configure production secrets

Choose the public instance URL: a `workers.dev` URL or a custom domain. `BETTER_AUTH_URL` must be the public dashboard origin, such as `https://parent.example.com`.

```sh
npx wrangler secret put DATABASE_URL --env production
npx wrangler secret put BETTER_AUTH_SECRET --env production
npx wrangler secret put BETTER_AUTH_URL --env production
npx wrangler secret put SIGNUP_ALLOWED_EMAILS --env production
```

Enter values at the prompt. For `SIGNUP_ALLOWED_EMAILS`, enter allowed email addresses separated by commas, including the first parent account. An absent or empty value leaves registration open.

Hyperdrive takes priority over `DATABASE_URL` when configured. Local development uses the direct connection.

## 5. Deploy and verify

```sh
npm run deploy
curl https://parent.example.com/api/health
```

Replace the domain with yours. The health route queries PostgreSQL and should return `{"ok":true}`.

Open the dashboard, create the allowed parent account and generate a pairing code. Then [install the Windows agent](/en/docs/windows/).

For a custom domain, add it to the Worker in Cloudflare and use the same origin for Better Auth and the agent.

## References

- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Create a Hyperdrive configuration](https://developers.cloudflare.com/hyperdrive/get-started/)
- [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
