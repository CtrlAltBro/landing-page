---
title: Troubleshooting
description: Diagnose connection, pairing and the Windows service.
---

## The server does not respond

Test `https://your-instance/api/health`. A response of `{"ok":true}` confirms that the route can query PostgreSQL. If it fails:

- check secrets in the `production` environment;
- verify that KV and Hyperdrive IDs belong to your resources;
- check PostgreSQL connectivity and its TLS certificate;
- verify that migrations were applied to this database.

Read Worker logs in Cloudflare to distinguish authentication, database and configuration errors.

## Pairing fails

Codes are single-use and expire after 15 minutes. Generate a fresh code in the dashboard of the server configured on the PC.

Check that the address is the instance origin without `/api`, and that the installer or pairing command has administrator rights. Direct pairing from the child app’s pipe is rejected.

## The PC appears offline

In administrator PowerShell:

```powershell
Get-Service CtrlAltBro
Set-Location 'C:\Program Files\CtrlAltBro'
.\node.exe .\service.js status
.\node.exe .\service.js server
Get-Content '.\ctrlaltbro-svc.out.log' -Tail 80
```

Then check network access, pairing and monitored accounts. Shutdown and sleep report a clean departure; an unreported outage can leave the previous state displayed until presence expires.

An HTTP 401 response can clear local pairing. If the device was deleted from the dashboard, pair it again with a new code.

## The child app does not appear

The service relaunches the app in monitored sessions using scheduled tasks. Check that the child account is selected and signed in. Supervision runs about every ten seconds, with a delay between relaunch attempts.

Closing the UI does not stop the service. Fallback counting is less precise, however, and can count a limited app in the background.

## A rule takes time to arrive

Allow time for a ping and synchronization. Fast mode activates when the parent views the PC. KV propagation may add delay; commands are not pushed through an incoming connection to the PC.

Check the selected device and server connectivity. Offline, only the last received rules can be applied.

## A browser is no longer accessible

Some browsers without usable per-account policies are automatically blocked while web filtering is active. Read [how filtering works](/en/docs/regles/#filter-websites-and-search) before creating an exception.

## Documentation search does not work during development

Pagefind builds its index during the production build. Test search with:

```sh
npm run build
npm run preview
```

Run these commands in the landing repository.
