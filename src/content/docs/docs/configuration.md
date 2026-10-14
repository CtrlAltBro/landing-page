---
title: Configuration
description: Variables du serveur et commandes administrateur de l’agent.
---

## Serveur

| Variable ou binding     | Usage                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | Connexion PostgreSQL directe, utilisée sans Hyperdrive                                          |
| `DATABASE_URL_UNPOOLED` | Connexion prioritaire du script de migration, si définie                                        |
| `BETTER_AUTH_SECRET`    | Secret de l’authentification, stable entre les déploiements                                     |
| `BETTER_AUTH_URL`       | Origine publique du dashboard et de l’API                                                       |
| `SIGNUP_ALLOWED_EMAILS` | Liste d’emails autorisés à créer un compte, séparés par des virgules ; vide ou absente = ouvert |
| `SIGNALS`               | Namespace Workers KV                                                                            |
| `HYPERDRIVE`            | Connexion PostgreSQL mutualisée, prioritaire en production                                      |

L’URL de documentation peut être `https://example.com/docs/`, tandis que le dashboard et l’API résident sur `https://parent.example.com`. L’agent doit recevoir l’origine du **dashboard/API**, pas l’adresse de cette documentation.

## Agent Windows

Le serveur et les comptes surveillés se modifient depuis l’application CtrlAltBro : bouton « Paramètres », puis « Enregistrer ». Une fenêtre d’autorisation Windows demande le mot de passe administrateur, puis le service redémarre avec la nouvelle configuration. Les comptes administrateur (parents) ne doivent pas être cochés.

En ligne de commande, exécutez les commandes qui modifient la configuration dans un PowerShell administrateur, depuis le dossier d’installation :

```powershell
Set-Location 'C:\Program Files\CtrlAltBro'
.\node.exe .\service.js status
.\node.exe .\service.js server
.\node.exe .\service.js monitor list
```

Pour sélectionner explicitement les comptes :

```powershell
.\node.exe .\service.js monitor set 'Enfant1,Enfant2'
```

Utilisez des noms de comptes locaux existants ou leurs SID. Pour revenir au choix automatique des comptes non administrateurs :

```powershell
.\node.exe .\service.js monitor default
```

La liste des comptes surveillés est rechargée environ toutes les minutes.

## Changer de serveur

:::caution[Un nouvel appairage sera nécessaire]
Changer l’origine du serveur efface l’appairage existant. Générez un nouveau code dans le dashboard de destination avant de procéder.
:::

Depuis l’application : « Paramètres », nouvelle adresse du serveur, « Enregistrer ». Le formulaire d’appairage réapparaît ensuite ; saisissez le nouveau code.

En ligne de commande :

```powershell
.\node.exe .\service.js server 'https://nouveau-parent.example.com'
.\node.exe .\service.js pair CODE 'PC enfant'
```

Redémarrez le service après ce changement pour repartir avec la nouvelle configuration :

```powershell
Restart-Service CtrlAltBro
```

Pour retirer volontairement l’appairage :

```powershell
.\node.exe .\service.js unpair
```

L’état est stocké dans `%ProgramData%\CtrlAltBro`. Préférez les commandes fournies à l’édition manuelle des fichiers pendant que le service fonctionne.
