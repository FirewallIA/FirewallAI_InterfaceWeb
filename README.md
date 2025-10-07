# FirewallAI - Interface de Gestion Intelligente

Une interface front-end professionnelle pour FirewallAI, offrant une solution de surveillance de sécurité intelligente et intuitive avec des capacités AI et EDR avancées.

## Technologies Utilisées

- React.js avec TypeScript
- Tailwind CSS pour le styling
- Express.js pour le backend
- Système d'authentification avec sessions
- Gestion des thèmes clair/sombre
- Système de gestion des utilisateurs avec contrôle d'accès basé sur les rôles

## Installation et Démarrage Rapide

### Prérequis
- Node.js (version 20.19.5 ou supérieure)
- npm

### 1. Cloner le projet
```bash
git clone https://github.com/FirewallIA/FirewallAI_InterfaceWeb.git
cd firewallai-interface
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Démarrer l'application
```bash
npm run dev

ou

./start.sh
```

L'application sera accessible à l'adresse : **http://localhost:5000**

## Comptes de Test

### Compte Administrateur
- **Email** : root@root.fr
- **Mot de passe** : root
- **Permissions** : Accès complet, gestion des utilisateurs

## Fonctionnalités Principales

### 🔐 Authentification
- Système de connexion sécurisé
- Gestion des sessions utilisateur
- Contrôle d'accès basé sur les rôles (admin/utilisateur)

### 🎨 Interface Utilisateur
- Thème sombre par défaut, basculement vers thème clair
- Interface responsive (mobile, tablette, desktop)
- Navigation intuitive avec sidebar
- Logo FirewallAI transparent intégré

### 👥 Gestion des Utilisateurs (Admin uniquement)
- Créer, modifier, supprimer des utilisateurs
- Attribution des rôles (admin/utilisateur)
- Interface de gestion complète accessible via `/users`

### 📊 Dashboard de Surveillance
- **Statut du Système** : Protection active, menaces bloquées, santé système
- **Surveillance Réseau** : Trafic entrant/sortant, topologie réseau
- **Détection de Menaces** : Alertes en temps réel, analyse des incidents
- **Analyse des Logs** : Visualisation des données, résumés statistiques
- **Monitoring EDR** : Couverture des endpoints, activités suspectes
- **Assistant IA** : Interface de chat pour requêtes et analyses

### 🛡️ Modules de Sécurité
- **Règles de Firewall** : Configuration et gestion des règles
- **Détection de Menaces** : Surveillance active des intrusions
- **Surveillance Réseau** : Monitoring temps réel du trafic
- **EDR** : Endpoint Detection and Response
- **Analyse des Logs** : Traitement intelligent des journaux

## Structure du Projet

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants UI réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Hooks personnalisés (auth, theme)
│   │   └── lib/            # Utilitaires et configuration
├── server/                 # Backend Express
│   ├── auth.ts            # Système d'authentification
│   ├── routes.ts          # Routes API
│   └── storage.ts         # Gestion des données utilisateur
└── shared/                # Schémas partagés
```

## Navigation de l'Interface

### Pages Principales
- `/` - Dashboard principal
- `/firewall-rules` - Gestion des règles de firewall
- `/network-monitor` - Surveillance réseau
- `/threat-detection` - Détection de menaces
- `/logs-analysis` - Analyse des logs
- `/ai-assistant` - Assistant IA
- `/edr-monitoring` - Surveillance EDR
- `/users` - Gestion des utilisateurs (admin uniquement)
- `/settings` - Paramètres du système

### Fonctionnalités de l'Interface
1. **Barre de navigation supérieure** : Recherche, notifications, sélecteur de thème, profil utilisateur
2. **Sidebar gauche** : Navigation principale entre les modules
3. **Contenu principal** : Tableaux de bord, graphiques, et interfaces de gestion
4. **Thèmes** : Basculement entre mode sombre et clair via l'icône soleil/lune

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/user` - Informations utilisateur actuel

### Gestion des Utilisateurs (Admin)
- `GET /api/users` - Liste des utilisateurs
- `POST /api/auth/register` - Créer un utilisateur
- `PATCH /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

### Données de Surveillance
- `GET /api/system/status` - Statut du système
- `GET /api/alerts` - Alertes actives
- `GET /api/network/traffic` - Données de trafic réseau
- `GET /api/threats/latest` - Dernières menaces détectées
- `GET /api/logs/analysis` - Analyse des logs
- `GET /api/edr/status` - Statut EDR

## Configuration pour la Démo

### Variables d'Environnement
Le projet utilise des données simulées pour la démonstration. Aucune configuration externe n'est requise.

### Données de Test
L'application inclut des données simulées réalistes pour :
- Alertes de sécurité
- Trafic réseau
- Menaces détectées
- Logs système
- Activités EDR

## Support et Utilisation

### Pour une Démonstration
1. Démarrez l'application avec `npm run dev`
2. Connectez-vous avec le compte admin (root@root.fr / root)
3. Explorez les différents modules via la sidebar
4. Testez le changement de thème avec l'icône en haut à droite
5. Accédez à la gestion des utilisateurs si vous êtes admin

### Personnalisation
- Les couleurs et thèmes peuvent être modifiés dans `client/src/index.css`
- Les données simulées se trouvent dans `server/routes.ts`
- L'ajout de nouvelles pages se fait dans `client/src/pages/`

## Développement

### Scripts Disponibles
- `npm run dev` - Démarrage en mode développement
- `npm run build` - Construction pour la production
- `npm run start` - Démarrage en mode production

### Technologies de Développement
- TypeScript pour la sécurité des types
- Tailwind CSS pour le styling rapide
- React Query pour la gestion des données
- Wouter pour le routing côté client
- Express.js avec sessions pour l'authentification

---

**Note** : Cette interface est conçue pour être utilisée dans le cadre d'un projet universitaire démontrant les capacités d'un système de firewall intelligent avec IA intégrée.
