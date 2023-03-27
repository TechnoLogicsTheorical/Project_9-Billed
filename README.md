# Billed App

## Description
Billed est une solution SaaS destinée aux équipes de ressources humaines. 
Cette application permet à un employé de soumettre des notes de frais à son administrateur RH pour remboursement.
La fonctionnalité "Note de frais" est très attendue sur le marché et le top management a mis la priorité dessus. 
L'objectif est de la lancer officiellement auprès de nos clients d'ici 2 semaines. Les délais sont donc très serrés.
Ce projet contient le code source pour le front-end et le back-end de la fonctionnalité "Note de frais".
Il y a deux parcours utilisateurs : un administrateur RH et un employé.

### Fonctionnalités
- Permettre à l'administrateur RH de créer, modifier et supprimer des notes de frais.
- Permettre à l'employé de soumettre une note de frais.
- Permettre à l'employé de suivre l'état d'avancement de sa note de frais.

# Installation
Pour installer et exécuter le projet localement, vous devez cloner ce dépôt et installer les dépendances pour le client et le serveur.

Pour l'exécution de ce projet, il est nécessaire de posséder les logiciels suivants :
- [Node.js v12](https://nodejs.org/en/)

## Installation des dépendances

Pour installer les dépendances de modules exécutés par Node.js nécessaires aux 2 répertoires sous-jacents : "**client**" et "**server**"

### Front-End

1. Ouvrir un nouveau terminal
2. Se rendre dans le dossier Front-End à l'aide de la commande : ``` cd ./client```
3. Exécuter la commande ``` npm install``` pour installer les dépendances nécessaires
4. Enfin lancer le serveur local avec la commande ``` npm start```

### Back-End

1. Pour commencer, il faut ouvrir un autre terminal, en second du precedent
2. Une fois ouvert, il est nécessaire de se déplacer dans le dossier : ``` cd ./server```
3. Exécuter la commande ``` npm install``` pour installer les dépendances nécessaires
4. Lors de la première exécution, il ne manque plus qu'à lancer le serveur Back à l'aide de ``` npm run run:dev```


## Technologies utilisées
- Node.js
- Express
- MongoDB
