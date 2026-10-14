---
title: Choose your hosting
description: Available deployment options and what is still needed for a VPS.
---

## Your instance on Cloudflare

This is the deployment supported by the current repository. You operate:

- a Cloudflare Worker serving the React dashboard and Hono API;
- a Workers KV namespace for PC presence and synchronization signals;
- a PostgreSQL database, developed with Neon and accessed through `pg`;
- Hyperdrive in production to manage PostgreSQL connections.

Better Auth stores user accounts in your PostgreSQL database. The agent only knows the public API URL and its device token, obtained during pairing.

Data passes through your Cloudflare instance and PostgreSQL provider. Running your own instance lets you choose those accounts and the database, while retaining a dependency on Cloudflare.

[Deploy this instance →](/en/docs/cloudflare/)

## Run everything on a VPS or NAS

The repository currently provides no Docker Compose setup, standalone server image or Node entry point serving the API and dashboard.

| Component        | Required adaptation                                                      |
| ---------------- | ------------------------------------------------------------------------ |
| Hono API         | Server entry point and environment variables                             |
| Dashboard        | Static asset serving and application routing                             |
| `SIGNALS`        | Storage with `get`, `put`, `delete` and expiration to replace Workers KV |
| Background tasks | Alternative to `executionCtx.waitUntil`                                  |
| PostgreSQL       | Connections and migrations for the chosen runtime                        |
| Operations       | HTTPS, persistent configuration, backups and packaging                   |

This guide therefore does not provide a Docker command implying that this deployment is ready.

## Prepare the PC

Protection relies on the child using a **standard Windows account**, with a separate administrator account for the parent. An administrator retains control of the machine and can modify or remove the service.

Rules and counters belong to the **PC** in the dashboard. Multiple accounts can be monitored, but they do not yet have independent child profiles and quotas.
