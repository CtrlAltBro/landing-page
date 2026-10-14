---
title: Règles et limites
description: Applications, navigateurs, horaires et comportement hors ligne.
---

## Bloquer ou limiter une application

Une règle peut bloquer une application ou lui donner un budget quotidien. Le temps est compté au premier plan lorsque l’application de session fonctionne. Si elle manque, le service compte les applications limitées en cours d’exécution, y compris en arrière-plan.

À la limite, le service ferme l’application et peut empêcher les relances avec une clé Windows IFEO. Les compteurs persistent sur disque et suivent le minuit local du PC. Le parent peut réinitialiser un usage depuis le dashboard.

IFEO s’applique à toute la machine. Le service suspend ces blocages de lancement lorsqu’une session non surveillée est ouverte, pour laisser le parent utiliser le PC. La fermeture des processus surveillés reste un mécanisme distinct.

Les clés IFEO ciblent un nom d’exécutable. Pour des copies renommées, le service cherche aussi l’identité d’origine à partir des métadonnées et signatures, puis ferme les processus identifiés. Ce mécanisme est réactif et ne garantit pas la reconnaissance de tout binaire modifié.

## Filtrer les sites et les recherches

Les politiques sont écrites dans la ruche des comptes surveillés pour Edge, Chrome, Chromium, Brave et Vivaldi. Elles comprennent le blocage d’URL, SafeSearch et la restriction YouTube selon les options choisies. Les fenêtres privées sont désactivées lorsque le filtrage est actif.

Certains moteurs de recherche sont ajoutés à la liste de blocage lorsque SafeSearch ne peut pas y être imposé.

Les navigateurs que le service ne sait pas filtrer par compte, dont Firefox et plusieurs dérivés, sont ajoutés aux applications bloquées lorsque le filtrage web est actif. Une règle explicite du parent sur ces navigateurs prend priorité : l’autoriser peut donc ouvrir un chemin sans filtrage équivalent.

## Définir les horaires

Le planning définit, par jour de semaine :

- les créneaux autorisés ;
- un plafond total de temps d’écran.

Le service vérifie le planning toutes les 20 secondes environ. Hors créneau ou après épuisement du budget, il verrouille ou déconnecte la session surveillée. Un avertissement est prévu cinq minutes avant l’échéance. Le planning utilise le fuseau local du PC.

## Envoyer une action ponctuelle

Les commandes `kill_app`, `lock_session` et `show_message` servent respectivement à fermer une application, verrouiller la session et afficher un message. Elles sont reçues lors d’une synchronisation. Une règle représente un état durable ; une commande représente une action ponctuelle.

## Sans Internet

Les dernières règles reçues continuent de fonctionner. Les nouvelles règles et commandes attendent le retour du réseau. Les données et résultats en attente sont conservés pour un prochain envoi.

## Ce qui n’est pas encore fourni

- Des budgets indépendants par enfant sur un même PC.
- Une authentification complète du client du pipe.
- Un collecteur d’historique navigateur dans l’agent actuel : les routes serveur et le contrat acceptent ces données, mais cela ne suffit pas à les collecter.
- Une garantie de prévention du lancement pour toutes les applications Store/UWP ou tous les exécutables modifiés.
