---
title: Installer l’agent Windows
description: Sélectionner le serveur, les comptes surveillés et appairer le PC.
---

## Préparer les comptes

Utilisez un compte administrateur pour l’installation et un compte standard pour l’enfant. Créez les comptes à surveiller avant de lancer l’installateur.

L’agent Windows se compose d’un service SYSTEM et d’une application Electron dans la session de l’enfant. Le service applique les règles ; l’application affiche les messages et mesure l’application au premier plan.

## Obtenir un installateur

L’installateur officiel (`.exe` prêt à lancer) arrive bientôt. En attendant, vous pouvez le construire vous-même depuis le dépôt [CtrlAltBro/app](https://github.com/CtrlAltBro/app) : une seule commande produit le `.exe`.

:::caution[Version non finalisée]
Un installateur construit à partir du code actuel est un produit non fini : il peut contenir des bugs, n’est pas signé (Windows SmartScreen affichera un avertissement) et ne bénéficie d’aucune garantie. Vous l’utilisez à vos propres risques ; l’auteur ne pourra être tenu responsable d’aucun dommage lié à son utilisation.
:::

Sur n’importe quel PC Windows, installez :

- Node.js et npm (`node` doit être dans le `PATH` : il est embarqué dans l’installateur, le PC de l’enfant n’a pas besoin de Node) ;
- NSIS : `winget install NSIS.NSIS` ;
- WinSW x64, placé dans `C:\Tools\WinSW-x64.exe`.

Puis, dans PowerShell :

```powershell
git clone https://github.com/CtrlAltBro/app.git
cd app
npm ci
powershell -ExecutionPolicy Bypass -File scripts\build-installer.ps1
```

Le script construit le service et l’application, puis les assemble avec Node et WinSW dans `installer\ctrlaltbro-setup-<version>.exe`. Copiez ce fichier sur le PC de l’enfant : il n’y a plus qu’à le lancer.

Si NSIS ou WinSW sont installés ailleurs :

```powershell
powershell -ExecutionPolicy Bypass -File scripts\build-installer.ps1 -WinSW 'C:\outils\WinSW-x64.exe' -NSIS 'C:\Program Files (x86)\NSIS\makensis.exe'
```

Facultatif : définissez `$env:CTRLALTBRO_API_URL = 'https://parent.example.com'` avant le build pour pré-remplir l’adresse de votre serveur dans l’installateur. Sinon, vous la saisissez au moment de l’installation.

## Installer et appairer

1. Depuis le dashboard de votre instance, générez un code d’appairage. Il expire après 15 minutes.
2. Lancez l’installateur et acceptez l’élévation administrateur.
3. Indiquez l’adresse de votre dashboard déployé sur Cloudflare (URL `workers.dev` ou domaine personnalisé), par exemple `https://parent.example.com`, sans ajouter `/api`.
4. Sélectionnez les comptes Windows à surveiller.
5. Saisissez le code et le nom du PC, puis terminez l’installation. Cette étape est facultative : vous pouvez laisser le code vide et appairer plus tard depuis l’application.
6. Ouvrez la session de l’enfant et vérifiez que le PC apparaît en ligne dans le dashboard.

Sans liste explicite, le service surveille par défaut les comptes locaux activés non administrateurs. Une liste vide correspond à ce défaut ; elle ne signifie pas « ne surveiller personne ».

## Appairer après l’installation

Le plus simple est de passer par l’application CtrlAltBro, dans la session de l’enfant (icône dans la zone de notification, puis « Ouvrir CtrlAltBro »). Tant que le PC n’est pas appairé, elle affiche un formulaire :

1. Générez un code depuis le dashboard (« Ajouter un PC »).
2. Saisissez le code et le nom du PC, puis cliquez sur « Appairer ce PC ».
3. Une fenêtre d’autorisation Windows s’ouvre : saisissez le mot de passe du compte administrateur (parent).

Le service redémarre et l’application affiche « Ce PC est appairé ». Un compte standard ne peut pas valider cette fenêtre : l’enfant ne peut donc pas appairer le PC à son propre compte.

En ligne de commande, dans PowerShell **administrateur** :

```powershell
Set-Location 'C:\Program Files\CtrlAltBro'
.\node.exe .\service.js pair CODE 'PC enfant'
Restart-Service CtrlAltBro
.\node.exe .\service.js status
```

Remplacez `CODE` par un code frais. Le redémarrage permet au service de recharger le jeton. L’appairage direct depuis le pipe de l’application enfant est refusé.

## Vérifier la protection

Créez une limite courte sur une application de test dans le dashboard, attendez la synchronisation et vérifiez son application dans le compte enfant. Vérifiez aussi qu’une règle reçue continue de s’appliquer après une coupure réseau.

Les fichiers d’état sont dans `%ProgramData%\CtrlAltBro`, avec accès réservé à SYSTEM et aux administrateurs. Le jeton d’appareil y est chiffré avec DPAPI en portée machine.

L’installateur tente également de retirer aux utilisateurs standards le droit de changer le fuseau horaire. Cette opération est réalisée au mieux et peut échouer sans faire échouer l’installation.
