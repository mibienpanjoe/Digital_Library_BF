# Digital Library BF

## Table des matières

- [Vision du projet](#vision-du-projet)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Documentation](#documentation)
- [Installation](#installation)
- [Démarrage rapide](#démarrage-rapide)
- [Équipe](#équipe)
- [Contribution](#contribution)

---

## Vision du projet

Digital Library BF est une plateforme de bibliothèque numérique fullstack dédiée au Burkina Faso. Elle permet la gestion, la distribution et le téléchargement de ressources documentaires (livres, PDF) à travers une application web et une application mobile.

### Objectifs Fonctionnels

- Les administrateurs peuvent uploader et gérer les livres disponibles sur la plateforme.
- Les utilisateurs peuvent s'inscrire, se connecter, rechercher et télécharger des livres.
- Un système de contrôle d'accès basé sur les rôles (RBAC) sécurise les actions sensibles.
- Chaque téléchargement est tracé à des fins de statistiques et de suivi.

## Stack technique

Le projet utilise les technologies suivantes, choisies pour leur rapidité de mise en œuvre :

- **Backend** : Node.js (Express.js) avec TypeScript
- **Frontend Web** : Next.js avec TypeScript et shadcn/ui
- **Mobile** : Flutter
- **Base de données, Stockage & Auth** : Supabase (PostgreSQL, Supabase Storage, Supabase Auth)
- **Déploiement** : Vercel (Frontend) et Railway/Render (Backend)

## Architecture

Le projet est organisé sous forme de **monorepo** contenant les applications et l'API :

```
digital-library-bf/
├── backend/          # API Express.js + Supabase (TypeScript)
├── frontend/         # Application web Next.js (TypeScript + shadcn/ui)
├── mobile/           # Application mobile Flutter
└── docs/             # Documentation du projet
```

Les différentes parties du système communiquent via une API REST documentée (Swagger/OpenAPI). La base de données de production se trouve sur Supabase, qui gère également directement l'authentification et le stockage des fichiers.

## Documentation

La documentation détaillée du projet se trouve dans le dossier `docs/` :

- [Aperçu du projet (Project Overview)](./docs/project_overview.md)
- [Spécifications des Exigences (SRS)](./docs/SRS.md)
- [Contrat API](./docs/API.md)
- [Identité Visuelle](./docs/visual_identity.md)
- [Contrats Système et Invariants](./docs/system_contract_and_invariants.md)

## Installation

### Prérequis

- **Node.js** (18.x min) et **npm** (9.x min)
- **Flutter** (3.x min) et **Dart** (3.x min)
- **Git** (2.x min)

### Cloner le dépôt

```bash
git clone https://github.com/mibienpanjoe/Digital_Library_BF.git
cd Digital_Library_BF
```

## Démarrage rapide

### Backend

```bash
cd backend
cp .env.example .env       # Configurer les variables d'environnement (demander à l'équipe)
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local # Configurer les variables d'environnement (demander à l'équipe)
npm install
npm run dev
```

### Mobile

```bash
cd mobile
flutter pub get
flutter run
```

## Équipe

Les développeurs sont répartis par dossier :

- **Backend** : Développeur(s) Backend responsable(s) de l'API Express.js et de l'intégration Supabase.
- **Frontend Web** : Développeur(s) Frontend responsable(s) de l'application Next.js.
- **Mobile** : Développeur(s) Mobile responsable(s) de l'application Flutter.

## Contribution

Veuillez consulter notre [Guide de Contribution](./CONTRIBUTING.md) pour connaître :
- La structure du projet
- La stratégie de branches (`main`, `dev`, `feature/*`)
- Le processus de Pull Request
- Les conventions de commit et de code

> **⚠️ Important :** Ne commitez jamais les fichiers `.env` contenant des secrets.
