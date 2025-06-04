# Guide d'Installation Rapide - FirewallAI Interface

## Installation en 3 Étapes

### Étape 1: Prérequis
Téléchargez et installez Node.js depuis : https://nodejs.org/
(Choisissez la version LTS recommandée)

### Étape 2: Démarrage Automatique

#### Sur Windows:
1. Double-cliquez sur le fichier `start.bat`
2. L'installation et le démarrage se feront automatiquement

#### Sur Mac/Linux:
1. Ouvrez un terminal dans le dossier du projet
2. Exécutez : `./start.sh`

### Étape 3: Accès à l'Interface
- Ouvrez votre navigateur
- Allez sur : http://localhost:5000
- Connectez-vous avec :
  - Email : `root@root.fr`
  - Mot de passe : `root`

## Démarrage Manuel (Alternative)

```bash
# Installation des dépendances
npm install

# Démarrage de l'application
npm run dev
```

## Fonctionnalités Disponibles

✓ Authentification sécurisée
✓ Dashboard de surveillance complète
✓ Gestion des utilisateurs (admin)
✓ Thèmes clair/sombre
✓ Interface responsive
✓ Données de démonstration réalistes

## Dépannage

**Problème de port :** Si le port 5000 est occupé, modifiez le port dans `server/index.ts` ligne 62.

**Erreur ENOTSUP :** Cette erreur est maintenant corrigée - le serveur utilise localhost au lieu de 0.0.0.0.

**Erreur d'installation :** Assurez-vous d'avoir Node.js version 18+ installé.

**Interface non accessible :** Vérifiez que l'application est démarrée et que le message "serving on port 5000" apparaît dans le terminal.

**Navigateur ne charge pas :** Essayez d'actualiser la page ou utilisez http://127.0.0.1:5000 comme alternative.