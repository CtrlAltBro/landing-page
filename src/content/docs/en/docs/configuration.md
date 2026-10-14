---
title: Configuration
description: Server variables and agent administrator commands.
---

## Server

| Variable or binding     | Purpose                                                                   |
| ----------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`          | Direct PostgreSQL connection, used without Hyperdrive                     |
| `DATABASE_URL_UNPOOLED` | Preferred migration connection when defined                               |
| `BETTER_AUTH_SECRET`    | Authentication secret, kept stable across deployments                     |
| `BETTER_AUTH_URL`       | Public dashboard and API origin                                           |
| `SIGNUP_ALLOWED_EMAILS` | Comma-separated signup allowlist; empty or absent means open registration |
| `SIGNALS`               | Workers KV namespace                                                      |
| `HYPERDRIVE`            | Pooled PostgreSQL connection, preferred in production                     |

Documentation may live at `https://example.com/en/docs/`, while the dashboard and API live at `https://parent.example.com`. Give the agent the **dashboard/API origin**, not this documentation’s address.

## Windows agent

Change the server and monitored accounts from the CtrlAltBro app: the “Paramètres” button, then “Enregistrer”. A Windows authorization prompt asks for the administrator password, then the service restarts with the new configuration. Leave administrator (parent) accounts unchecked.

From the command line, run configuration changes in administrator PowerShell from the installation folder:

```powershell
Set-Location 'C:\Program Files\CtrlAltBro'
.\node.exe .\service.js status
.\node.exe .\service.js server
.\node.exe .\service.js monitor list
```

Select accounts explicitly:

```powershell
.\node.exe .\service.js monitor set 'Child1,Child2'
```

Use existing local account names or their SIDs. To restore automatic selection of non-administrator accounts:

```powershell
.\node.exe .\service.js monitor default
```

The monitored account list reloads about once a minute.

## Change servers

:::caution[Pairing again is required]
Changing the server origin clears the existing pairing. Generate a new code in the destination dashboard before proceeding.
:::

From the app: “Paramètres”, new server address, “Enregistrer”. The pairing form then shows again; enter the new code.

From the command line:

```powershell
.\node.exe .\service.js server 'https://new-parent.example.com'
.\node.exe .\service.js pair CODE 'Child PC'
```

Restart the service to use the updated configuration:

```powershell
Restart-Service CtrlAltBro
```

To deliberately remove pairing:

```powershell
.\node.exe .\service.js unpair
```

State is stored in `%ProgramData%\CtrlAltBro`. Prefer the provided commands to manually editing files while the service is running.
