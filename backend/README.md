# Digital Library BF — Backend API

API REST de la Bibliothèque Numérique du Burkina Faso.

## Stack Technique

- **Runtime** : Node.js + TypeScript
- **Framework** : Express.js
- **Base de données** : PostgreSQL (Supabase)
- **Authentification** : JWT + bcrypt
- **Validation** : Zod
- **Upload** : Multer → Supabase Storage
- **Documentation** : Swagger (OpenAPI 3.0)

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# → remplir les valeurs dans .env

# 3. Créer le compte admin (une seule fois)
npm run seed

# 4. Lancer en développement
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.

## URLs utiles

| URL                                   | Description              |
| ------------------------------------- | ------------------------ |
| `http://localhost:3000/health`        | Health check             |
| `http://localhost:3000/api-docs`      | Documentation Swagger UI |
| `http://localhost:3000/api-docs.json` | Spec OpenAPI (JSON)      |

## Endpoints API

Base URL : `/api/v1`

### Auth (Public)

| Méthode | Endpoint         | Description |
| ------- | ---------------- | ----------- |
| POST    | `/auth/register` | Inscription |
| POST    | `/auth/login`    | Connexion   |

### Books (Public + Auth)

| Méthode | Endpoint              | Auth | Description   |
| ------- | --------------------- | ---- | ------------- |
| GET     | `/books`              | ❌   | Liste paginée |
| GET     | `/books/:id`          | ❌   | Détails       |
| GET     | `/books/:id/download` | 🔒   | Télécharger   |

### Profile (Auth)

| Méthode | Endpoint            | Description          |
| ------- | ------------------- | -------------------- |
| GET     | `/profile`          | Mon profil           |
| PUT     | `/profile`          | Modifier profil      |
| PUT     | `/profile/password` | Changer mot de passe |

### Admin (Auth + Admin)

| Méthode | Endpoint                     | Description         |
| ------- | ---------------------------- | ------------------- |
| POST    | `/admin/books`               | Ajouter un livre    |
| PUT     | `/admin/books/:id`           | Modifier un livre   |
| DELETE  | `/admin/books/:id`           | Supprimer un livre  |
| GET     | `/admin/users`               | Liste utilisateurs  |
| GET     | `/admin/users/:id/downloads` | Downloads d'un user |
| GET     | `/admin/dashboard/stats`     | Statistiques        |

## Scripts

```bash
npm run dev      # Développement (hot reload)
npm run build    # Compilation TypeScript
npm run start    # Production
npm run seed     # Créer le compte admin
```

## Architecture

```
src/
├── config/          # Env, Supabase, Swagger
├── controllers/     # Handlers HTTP
├── middlewares/      # Auth, admin, validation, erreurs, upload
├── routes/          # Définition des routes + annotations Swagger
├── services/        # Logique métier
├── types/           # Interfaces TypeScript
├── utils/           # Helpers (erreurs, réponse, pagination)
├── validators/      # Schémas Zod
├── app.ts           # Configuration Express
└── server.ts        # Point d'entrée
```

Voir [`ARCHITECTURE.md`](./ARCHITECTURE.md) pour la documentation complète.
