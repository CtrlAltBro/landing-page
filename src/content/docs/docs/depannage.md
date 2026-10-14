---
title: Dépannage
description: Diagnostiquer la connexion, l’appairage et le service Windows.
---

## Le serveur ne répond pas

Testez `https://votre-instance/api/health`. Un résultat `{"ok":true}` confirme que la route peut interroger PostgreSQL. Si elle échoue :

- vérifiez les secrets dans l’environnement `production` ;
- vérifiez que les identifiants KV et Hyperdrive sont les vôtres ;
- vérifiez la connexion PostgreSQL et son certificat TLS ;
- vérifiez que les migrations ont été appliquées à cette base.

Consultez les logs Cloudflare du Worker pour distinguer une erreur d’authentification, de base et de configuration.

## L’appairage échoue

Le code est à usage unique et expire après 15 minutes. Générez-en un nouveau depuis le dashboard du serveur que vous avez configuré sur le PC.

Vérifiez que l’adresse est l’origine de l’instance, sans `/api`, et que l’installation ou la commande d’appairage dispose des droits administrateur. Le service refuse l’appairage demandé directement depuis le pipe enfant.

## Le PC apparaît hors ligne

Dans PowerShell administrateur :

```powershell
Get-Service CtrlAltBro
Set-Location 'C:\Program Files\CtrlAltBro'
.\node.exe .\service.js status
.\node.exe .\service.js server
Get-Content '.\ctrlaltbro-svc.out.log' -Tail 80
```

Vérifiez ensuite l’accès réseau au serveur, l’appairage et les comptes surveillés. L’arrêt ou la veille signale un départ propre ; une coupure sans signal peut laisser l’ancien état affiché jusqu’à expiration de la présence.

Une réponse HTTP 401 à l’agent peut provoquer la suppression locale de l’appairage. Si l’appareil a été supprimé du dashboard, réappairez-le avec un nouveau code.

## L’application enfant ne s’affiche pas

Le service relance l’application dans les sessions surveillées grâce aux tâches planifiées. Vérifiez que le compte enfant est sélectionné et connecté. La supervision s’exécute environ toutes les dix secondes, avec un délai entre tentatives de relance.

La fermeture de l’interface n’arrête pas le service. Le comptage de secours est cependant moins précis et peut compter une application limitée en arrière-plan.

## Une règle tarde à arriver

Attendez un ping, puis la synchronisation. Le mode rapide s’active lorsque le parent consulte le PC. La propagation de KV peut ajouter un délai ; ces opérations ne sont pas une connexion poussée vers le PC.

Vérifiez que vous modifiez le bon appareil et que le serveur est joignable. Hors réseau, seules les dernières règles reçues peuvent être appliquées.

## Un navigateur n’est plus accessible

Lorsque le filtrage web est actif, certains navigateurs sans politique exploitable par compte sont bloqués automatiquement. Consultez [le fonctionnement du filtrage](/docs/regles/#filtrer-les-sites-et-les-recherches) avant de créer une exception.

## La recherche de cette documentation ne fonctionne pas en développement

L’index Pagefind est généré au build. Pour tester la recherche sur la documentation :

```sh
npm run build
npm run preview
```

Les commandes sont à exécuter dans le dépôt de la landing.
