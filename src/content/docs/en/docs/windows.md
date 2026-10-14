---
title: Install the Windows agent
description: Select the server, monitored accounts and pair the PC.
---

## Prepare accounts

Install using an administrator account and give your child a standard account. Create monitored accounts before running the installer.

The Windows agent consists of a SYSTEM service and an Electron app in the child’s session. The service enforces rules; the app displays messages and measures the foreground application.

## Obtain an installer

The official installer (a ready-to-run `.exe`) is coming soon. In the meantime, you can build it yourself from the [CtrlAltBro/app](https://github.com/CtrlAltBro/app) repository: a single command produces the `.exe`.

:::caution[Unfinished release]
An installer built from the current code is an unfinished product: it may contain bugs, is not signed (Windows SmartScreen will show a warning) and comes with no warranty. You use it at your own risk; the author cannot be held liable for any damage resulting from its use.
:::

On any Windows PC, install:

- Node.js and npm (`node` must be on the `PATH`: it is bundled into the installer, so the child’s PC does not need Node);
- NSIS: `winget install NSIS.NSIS`;
- WinSW x64, placed at `C:\Tools\WinSW-x64.exe`.

Then, in PowerShell:

```powershell
git clone https://github.com/CtrlAltBro/app.git
cd app
npm ci
powershell -ExecutionPolicy Bypass -File scripts\build-installer.ps1
```

The script builds the service and app, then packages them with Node and WinSW into `installer\ctrlaltbro-setup-<version>.exe`. Copy that file to the child’s PC: all that is left is to run it.

If NSIS or WinSW live elsewhere:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\build-installer.ps1 -WinSW 'C:\tools\WinSW-x64.exe' -NSIS 'C:\Program Files (x86)\NSIS\makensis.exe'
```

Optional: set `$env:CTRLALTBRO_API_URL = 'https://parent.example.com'` before building to prefill your server address in the installer. Otherwise, you enter it during installation.

## Install and pair

1. Generate a pairing code in your instance’s dashboard. It expires after 15 minutes.
2. Run the installer and accept administrator elevation.
3. Enter the address of your dashboard deployed on Cloudflare (`workers.dev` URL or custom domain), such as `https://parent.example.com`, without `/api`.
4. Select Windows accounts to monitor.
5. Enter the pairing code and PC name, then finish installation. This step is optional: you can leave the code empty and pair later from the app.
6. Sign in as your child and check that the PC appears online in the dashboard.

Without an explicit list, the service monitors enabled local non-administrator accounts. An empty list means this default; it does not mean “monitor nobody”.

## Pair after installation

The easiest way is through the CtrlAltBro app, in the child’s session (notification area icon, then “Ouvrir CtrlAltBro”). While the PC is not paired, it shows a form:

1. Generate a code in the dashboard (“Add a PC”).
2. Enter the code and PC name, then click “Appairer ce PC”.
3. A Windows authorization prompt opens: enter the administrator (parent) account password.

The service restarts and the app shows “Ce PC est appairé”. A standard account cannot approve that prompt, so the child cannot pair the PC to their own account.

From the command line, in **administrator PowerShell**:

```powershell
Set-Location 'C:\Program Files\CtrlAltBro'
.\node.exe .\service.js pair CODE 'Child PC'
Restart-Service CtrlAltBro
.\node.exe .\service.js status
```

Replace `CODE` with a fresh code. The restart makes the service reload the token. Direct pairing through the child app’s pipe is rejected.

## Verify protection

Set a short limit on a test application, wait for synchronization and verify enforcement in the child account. Check that a received rule still applies after a network outage.

State files live in `%ProgramData%\CtrlAltBro`, accessible only to SYSTEM and administrators. The device token is encrypted using machine-scope DPAPI.

The installer also attempts to remove standard users’ permission to change the time zone. This is best effort and can fail without failing installation.
