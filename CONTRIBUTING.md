# Guide de Contribution — Digital Library BF

### Bibliothèque Numérique du Burkina Faso

Bienvenue dans le projet **Digital Library BF** ! Ce document définit les règles, conventions et processus que chaque membre de l'équipe doit suivre pour contribuer au projet.

---

## Table des matières

1. [Structure du projet](#1-structure-du-projet)
2. [Prérequis](#2-prérequis)
3. [Installation locale](#3-installation-locale)
4. [Stratégie de branches](#4-stratégie-de-branches)
5. [Workflow de contribution](#5-workflow-de-contribution)
6. [Conventions de commits](#6-conventions-de-commits)
7. [Conventions de code](#7-conventions-de-code)
8. [Pull Requests](#8-pull-requests)
9. [Contrat API](#9-contrat-api)
10. [Variables d'environnement](#10-variables-denvironnement)
11. [Communication](#11-communication)

---

## 1. Structure du projet

Le projet est un **monorepo** organisé comme suit :

```
digital-library-bf/
├── backend/          # API Express.js + Supabase (TypeScript)
├── frontend/         # Application web Next.js (TypeScript + shadcn/ui)
├── mobile/           # Application mobile Flutter
├── docs/             # Documentation du projet
│   ├── project_overview.md
│   ├── SRS.md
│   ├── system_contract_and_invariants.md
│   └── API.md
├── CONTRIBUTING.md   # Ce fichier
└── README.md
```

**Règle fondamentale :** Chaque développeur travaille dans **son dossier** (`backend/`, `frontend/`, ou `mobile/`). Si une modification impacte un autre dossier, elle doit être coordonnée avec le responsable concerné.

---

## 2. Prérequis

Assurez-vous d'avoir les outils suivants installés :

| Outil       | Version minimale | Utilisé par       |
| ----------- | ---------------- | ----------------- |
| **Node.js** | 18.x             | Backend, Frontend |
| **npm**     | 9.x              | Backend, Frontend |
| **Flutter** | 3.x              | Mobile            |
| **Dart**    | 3.x              | Mobile            |
| **Git**     | 2.x              | Tous              |

---

## 3. Installation locale

### Cloner le dépôt

```bash
git clone https://github.com/<organisation>/digital-library-bf.git
cd digital-library-bf
```

### Backend

```bash
cd backend
cp .env.example .env       # Configurer les variables d'environnement
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local # Configurer les variables d'environnement
npm install
npm run dev
```

### Mobile

```bash
cd mobile
flutter pub get
flutter run
```

> **⚠️ Important :** Les fichiers `.env` ne sont **JAMAIS** commités. Demandez les valeurs à un membre de l'équipe en privé.

---

## 4. Stratégie de branches

| Branche         | Rôle                               | Pushs directs |
| --------------- | ---------------------------------- | ------------- |
| `main`          | Code stable, déployé en production | ❌ Interdit   |
| `dev`           | Branche d'intégration              | ❌ Interdit   |
| `feature/<nom>` | Branche de travail individuelle    | ✅ Autorisé   |

### Flux de travail

```
feature/<nom-de-la-tâche>  →  dev  →  main
```

- **`main`** contient uniquement du code testé et validé.
- **`dev`** est la branche où toutes les features sont intégrées et testées ensemble.
- **`feature/<nom>`** est votre branche de travail. Créez-en une pour chaque tâche.

---

## 5. Workflow de contribution

### Étape par étape

```bash
# 1. Se positionner sur dev et mettre à jour
git checkout dev
git pull origin dev

# 2. Créer une branche feature
git checkout -b feature/nom-de-la-tâche

# 3. Travailler et commiter régulièrement
git add .
git commit -m "feat(backend): ajouter endpoint de recherche de livres"

# 4. Pousser la branche
git push origin feature/nom-de-la-tâche

# 5. Ouvrir une Pull Request vers dev sur GitHub
```

### Résolution de conflits

Si `dev` a avancé pendant votre travail :

```bash
git checkout dev
git pull origin dev
git checkout feature/nom-de-la-tâche
git merge dev
# Résoudre les conflits si nécessaire
git push origin feature/nom-de-la-tâche
```

---

## 6. Conventions de commits

Les messages de commit suivent le format **Conventional Commits** :

```
<type>(<scope>): <description courte>
```

### Types autorisés

| Type       | Usage                                                       |
| ---------- | ----------------------------------------------------------- |
| `feat`     | Nouvelle fonctionnalité                                     |
| `fix`      | Correction de bug                                           |
| `docs`     | Documentation uniquement                                    |
| `style`    | Formatage, point-virgules, etc. (pas de changement logique) |
| `refactor` | Restructuration du code sans changement fonctionnel         |
| `test`     | Ajout ou modification de tests                              |
| `chore`    | Tâches de maintenance (dépendances, config, CI)             |

### Scopes

| Scope      | Dossier concerné |
| ---------- | ---------------- |
| `backend`  | `backend/`       |
| `frontend` | `frontend/`      |
| `mobile`   | `mobile/`        |
| `docs`     | `docs/`          |

### Exemples

```
feat(backend): ajouter endpoint POST /admin/books
fix(frontend): corriger redirection après login admin
docs(docs): mettre à jour le contrat API
style(mobile): reformater les widgets de la page catalogue
refactor(backend): extraire la logique d'auth en middleware
test(backend): ajouter tests pour l'upload de livres
chore(frontend): mettre à jour les dépendances shadcn/ui
```

### Règles

- ✅ Écrire en **français** ou en **anglais** (choisir une langue et rester cohérent)
- ✅ Utiliser l'**impératif** : "ajouter", "corriger", "supprimer"
- ✅ Première lettre en **minuscule** après le scope
- ❌ Ne pas terminer par un point
- ❌ Ne pas dépasser 72 caractères pour la première ligne

---

## 7. Conventions de code

### Générales

- **Indentation** : 2 espaces (pas de tabulations)
- **Fin de fichier** : toujours une ligne vide en fin de fichier
- **Nommage** : utiliser des noms explicites et descriptifs

### Backend (TypeScript/Express)

- Utiliser **TypeScript strict** (`strict: true` dans `tsconfig.json`)
- Nommer les fichiers en `camelCase` : `bookController.ts`, `authMiddleware.ts`
- Nommer les routes en `kebab-case` : `/admin/books`, `/auth/login`
- Toujours valider les entrées utilisateur côté serveur
- Toujours retourner des réponses au format défini dans le [contrat API](./docs/API.md)

### Frontend (TypeScript/Next.js)

- Nommer les composants en `PascalCase` : `BookCard.tsx`, `AdminDashboard.tsx`
- Nommer les fichiers utilitaires en `camelCase` : `apiClient.ts`, `authGuard.ts`
- Utiliser les composants `shadcn/ui` autant que possible
- Séparer la logique métier de la logique d'affichage

### Mobile (Dart/Flutter)

- Nommer les fichiers en `snake_case` : `book_card.dart`, `login_screen.dart`
- Nommer les classes en `PascalCase` : `BookCard`, `LoginScreen`
- Suivre les [conventions Dart officielles](https://dart.dev/effective-dart/style)
- Organiser les widgets en fichiers séparés par écran

---

## 8. Pull Requests

### Règles

- Toute PR doit cibler la branche **`dev`** (jamais `main` directement)
- Toute PR doit être **relue par au moins un autre membre** de l'équipe
- Toute PR doit avoir une **description claire** de ce qu'elle fait

### Template de description PR

```markdown
## Description

Brève description de la modification.

## Type de changement

- [ ] Nouvelle fonctionnalité (feat)
- [ ] Correction de bug (fix)
- [ ] Refactoring
- [ ] Documentation
- [ ] Autre

## Dossier impacté

- [ ] backend/
- [ ] frontend/
- [ ] mobile/
- [ ] docs/

## Checklist

- [ ] Mon code suit les conventions du projet
- [ ] J'ai testé mes changements localement
- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] Si j'ai modifié l'API, le contrat API (docs/API.md) est à jour
```

---

## 9. Contrat API

Le fichier [`docs/API.md`](./docs/API.md) est la **source de vérité unique** pour l'API.

### Règles strictes

| Règle                     | Description                                                                      |
| ------------------------- | -------------------------------------------------------------------------------- |
| **Documentation d'abord** | Tout changement d'API doit être documenté dans `API.md` **AVANT** implémentation |
| **Backend**               | Implémente **exactement** ce qui est documenté                                   |
| **Frontend / Mobile**     | Consomme **exactement** ce qui est documenté                                     |
| **Écarts**                | Tout écart doit être discuté et validé par l'équipe                              |

Si vous devez modifier un endpoint :

1. Ouvrir une issue ou en discuter avec l'équipe
2. Mettre à jour `docs/API.md` dans votre PR
3. Faire valider la modification
4. Implémenter le changement

---

## 10. Variables d'environnement

### Règles de sécurité

- ❌ **JAMAIS** commiter un fichier `.env`
- ❌ **JAMAIS** écrire un secret en dur dans le code source
- ✅ Utiliser `.env.example` avec des valeurs fictives comme modèle
- ✅ Partager les vraies valeurs **en privé** (message direct, gestionnaire de mots de passe)

### Vérification .gitignore

Assurez-vous que votre `.gitignore` contient :

```
# Environnement
.env
.env.local
.env.production

# Dépendances
node_modules/

# Build
.next/
dist/
build/
```

---

## 11. Communication

### Principes

- **Communiquer tôt** : si vous êtes bloqué, demandez de l'aide rapidement
- **Communiquer les conflits** : si votre travail impacte le dossier d'un autre, prévenez-le
- **Documenter les décisions** : toute décision technique importante doit être notée

### Quand communiquer obligatoirement

| Situation                     | Action                                           |
| ----------------------------- | ------------------------------------------------ |
| Modification de l'API         | Mettre à jour `docs/API.md` et prévenir l'équipe |
| Modification du schéma de BDD | Prévenir toute l'équipe                          |
| Ajout d'une dépendance        | Justifier le choix dans la PR                    |
| Blocage > 30 minutes          | Demander de l'aide                               |

---

> **Merci de respecter ces conventions.** Elles permettent à l'équipe de travailler efficacement et de livrer un produit de qualité dans les délais impartis. 

---

Digital Library BF — Guide de Contribution — Mars 2026
