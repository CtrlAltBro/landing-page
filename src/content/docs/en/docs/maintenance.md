---
title: Backups and updates
description: Preserve data, apply migrations and maintain agents.
---

## Back up the instance

PostgreSQL stores accounts, devices, rules, commands, measurements and events. Use your provider’s backups or a PostgreSQL export, then test restoration into a separate database.

Also keep these in secure storage:

- the Better Auth secret and URL configuration;
- Cloudflare configuration with your resource IDs;
- the deployed code version and migration state.

KV contains coordination signals. Token caches and presence can be rebuilt through agent contacts; restoring the database does not instantly restore every presence record or KV signal.

## Update the server

1. Back up the database and record the currently deployed version.
2. Retrieve the chosen code version and review new migrations.
3. Install dependencies using `npm ci`.
4. Configure `.env.local` for the correct database and run `npm run db:migrate`.
5. Verify production resources and secrets, then run `npm run deploy`.
6. Test `/api/health`, parent sign-in and synchronization with a PC.

Do not edit applied migrations. Rolling back a Worker does not automatically roll back the PostgreSQL schema: check compatibility first.

## Update Windows

The reviewed code does not provide automatic downloading and installation of service updates. Use an installer built from the chosen version, run with administrator rights.

The installation script retains previous configuration when server, accounts or pairing code are left blank. Verify status, monitored accounts and a rule after updating.

## Restore a PC’s state

Local data lives in `%ProgramData%\CtrlAltBro`. The token uses machine-scope DPAPI: copying `device.json` to another machine is not a reliable way to restore pairing. Plan to pair again after a fresh Windows installation.

## Retention

The current repository provides no automatic retention policy for screen-time measurements and history. Plan a policy for your instance and backups. Deleting a device in the dashboard revokes access and deletes its associated data; back up first if you need to retain it.
