# Architecture Backend — Digital Library BF

### API Express.js + Supabase (TypeScript)

**Version 1.0 — Mars 2026**

---

> Ce document définit l'architecture détaillée du backend de Digital Library BF.  
> Il constitue la référence pour le développement et respecte les contrats définis dans :
>
> - [`docs/API.md`](../docs/API.md) — Contrat API (source de vérité des endpoints)
> - [`docs/system_contract_and_invariants.md`](../docs/system_contract_and_invariants.md) — Contrat système et invariants

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Structure des dossiers](#2-structure-des-dossiers)
3. [Architecture en couches](#3-architecture-en-couches)
4. [Configuration et environnement](#4-configuration-et-environnement)
5. [Base de données — Schéma](#5-base-de-données--schéma)
6. [Authentification et autorisation](#6-authentification-et-autorisation)
7. [Middlewares](#7-middlewares)
8. [Routage et contrôleurs](#8-routage-et-contrôleurs)
9. [Services métier](#9-services-métier)
10. [Gestion des fichiers](#10-gestion-des-fichiers)
11. [Gestion des erreurs](#11-gestion-des-erreurs)
12. [Validation des entrées](#12-validation-des-entrées)
13. [Script de seed](#13-script-de-seed)
14. [Documentation API (Swagger)](#14-documentation-api-swagger)
15. [Conformité aux invariants](#15-conformité-aux-invariants)

---

## 1. Vue d'ensemble

Le backend est une **API REST** construite avec **Express.js** et **TypeScript**, utilisant **Supabase** comme plateforme centralisée pour :

- **PostgreSQL** — Base de données relationnelle
- **Supabase Storage** — Stockage de fichiers (PDF, ePub, couvertures)
- **Supabase Auth** — Gestion des sessions JWT et des rôles

L'API est **stateless** (INV-SYS-03) : chaque requête est authentifiée indépendamment via son JWT. Aucune session serveur n'est maintenue.

### Principes architecturaux

| Principe                               | Description                                                           |
| -------------------------------------- | --------------------------------------------------------------------- |
| **Séparation des responsabilités**     | Chaque couche a un rôle unique et défini                              |
| **Contrat API comme source de vérité** | Le code implémente exactement `docs/API.md`                           |
| **Validation côté serveur**            | Toute entrée est validée/nettoyée avant traitement (G-SEC-04)         |
| **Rôles vérifiés côté serveur**        | Aucune confiance dans le client pour le contrôle d'accès (G-AUTHZ-01) |
| **Pas de secrets en dur**              | Toute valeur sensible vient des variables d'environnement (G-SEC-05)  |

---

## 2. Structure des dossiers

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts                 # Chargement et validation des variables d'env
│   │   ├── supabase.ts            # Client Supabase (DB + Storage + Auth)
│   │   └── swagger.ts             # Configuration Swagger/OpenAPI
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts      # Vérification JWT + extraction utilisateur
│   │   ├── admin.middleware.ts     # Vérification du rôle admin
│   │   ├── validate.middleware.ts  # Validation des corps de requête (Zod)
│   │   ├── upload.middleware.ts    # Gestion des uploads fichier (Multer)
│   │   └── error.middleware.ts     # Gestionnaire d'erreurs centralisé
│   │
│   ├── routes/
│   │   ├── index.ts               # Routeur principal — monte tous les sous-routeurs
│   │   ├── auth.routes.ts         # Routes /auth/*
│   │   ├── book.routes.ts         # Routes /books/*
│   │   ├── admin.routes.ts        # Routes /admin/*
│   │   └── profile.routes.ts      # Routes /profile/*
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts     # Logique HTTP pour auth
│   │   ├── book.controller.ts     # Logique HTTP pour livres (public)
│   │   ├── admin.controller.ts    # Logique HTTP pour admin (livres + users + stats)
│   │   └── profile.controller.ts  # Logique HTTP pour profil
│   │
│   ├── services/
│   │   ├── auth.service.ts        # Logique métier : inscription, connexion
│   │   ├── book.service.ts        # Logique métier : CRUD livres, recherche
│   │   ├── download.service.ts    # Logique métier : téléchargement + tracking
│   │   ├── user.service.ts        # Logique métier : gestion utilisateurs
│   │   └── stats.service.ts       # Logique métier : statistiques dashboard
│   │
│   ├── validators/
│   │   ├── auth.validator.ts      # Schémas Zod pour inscription/login
│   │   ├── book.validator.ts      # Schémas Zod pour CRUD livres
│   │   └── profile.validator.ts   # Schémas Zod pour mise à jour profil
│   │
│   ├── types/
│   │   ├── index.ts               # Types partagés
│   │   ├── user.types.ts          # Interfaces User, UserRole
│   │   ├── book.types.ts          # Interfaces Book, BookCreate, BookUpdate
│   │   ├── download.types.ts      # Interface Download
│   │   ├── response.types.ts      # Interfaces ApiResponse, PaginatedResponse
│   │   └── env.d.ts               # Typage des variables d'environnement
│   │
│   ├── utils/
│   │   ├── response.util.ts       # Fonctions helper pour formater les réponses API
│   │   ├── pagination.util.ts     # Fonctions helper pour la pagination
│   │   └── errors.util.ts         # Classes d'erreurs applicatives (AppError, etc.)
│   │
│   ├── app.ts                     # Configuration Express (middlewares globaux, CORS, routes)
│   └── server.ts                  # Point d'entrée — démarrage du serveur
│
├── scripts/
│   └── seed.ts                    # Script de seed : création du compte admin
│
├── .env.example                   # Modèle de variables d'environnement
├── .gitignore
├── package.json
├── tsconfig.json
└── ARCHITECTURE.md                # Ce fichier
```

---

## 3. Architecture en couches

Le backend suit une architecture en **3 couches** avec un flux de données unidirectionnel :

```
Requête HTTP
     │
     ▼
┌─────────────────────────────────────────────┐
│  MIDDLEWARES                                │
│  (CORS → Auth → Admin → Validation → Upload)│
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  CONTRÔLEURS (Controllers)                  │
│  Reçoivent la requête validée               │
│  Appellent le service approprié             │
│  Formatent et renvoient la réponse          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  SERVICES (Business Logic)                  │
│  Contiennent toute la logique métier        │
│  Interagissent avec Supabase (DB + Storage) │
│  Appliquent les règles contractuelles       │
└─────────────────────────────────────────────┘
```

### Responsabilités par couche

| Couche          | Responsabilité                                                            | Ne fait PAS                         |
| --------------- | ------------------------------------------------------------------------- | ----------------------------------- |
| **Middlewares** | Authentification, autorisation, validation, parsing de fichiers           | Logique métier                      |
| **Contrôleurs** | Extraction des paramètres, appel du service, formatage de la réponse HTTP | Accès direct à la DB                |
| **Services**    | Logique métier, requêtes Supabase, application des invariants             | Formatage HTTP, gestion des headers |

---

## 4. Configuration et environnement

### Variables d'environnement requises

```env
# Serveur
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# JWT
JWT_SECRET=votre_secret_jwt_ici
JWT_EXPIRES_IN=24h

# Admin Seed
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@digitallibrary.bf
ADMIN_PASSWORD=MotDePasseAdmin123!

# Storage
STORAGE_BUCKET_BOOKS=books
STORAGE_BUCKET_COVERS=covers
MAX_FILE_SIZE_MB=50
MAX_COVER_SIZE_MB=5
```

### `config/env.ts`

Ce module charge les variables via `dotenv`, les valide, et exporte un objet `env` typé. Le serveur **refuse de démarrer** si une variable obligatoire est manquante.

> **Conformité G-SEC-05 / X-DATA-03** : Aucun secret n'est jamais écrit en dur dans le code.

---

## 5. Base de données — Schéma

### Tables PostgreSQL

#### `users`

```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  role        VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
```

> **Conformité INV-ID-01** : La contrainte `CHECK` garantit exactement un rôle parmi `user` et `admin`.  
> **Conformité INV-ID-02** : La contrainte `UNIQUE` sur `email` empêche les doublons.  
> **Conformité INV-ID-03** : Le champ `password` contient uniquement le hash (bcrypt).

#### `books`

```sql
CREATE TABLE books (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          VARCHAR(255) NOT NULL,
  author         VARCHAR(255) NOT NULL,
  description    TEXT NOT NULL,
  cover_url      TEXT,
  file_url       TEXT NOT NULL,
  file_format    VARCHAR(10) NOT NULL CHECK (file_format IN ('pdf', 'epub')),
  file_size      BIGINT NOT NULL,
  category       VARCHAR(100),
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

> **Conformité INV-DATA-02** : `file_url` est `NOT NULL` — aucun livre sans fichier.

#### `downloads`

```sql
CREATE TABLE downloads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id),
  book_id       UUID NOT NULL REFERENCES books(id),
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_book_id ON downloads(book_id);
```

> **Conformité INV-DATA-01** : Les clés étrangères garantissent la traçabilité.  
> **Conformité G-DATA-01** : L'enregistrement du téléchargement et le service du fichier sont dans une même transaction.

### Trigger — Attribution automatique du rôle

```sql
-- Ce trigger est géré par Supabase Auth :
-- À la création d'un compte via Supabase Auth,
-- un enregistrement est inséré dans users avec role = 'user'.
-- Le champ role ne peut PAS être modifié via l'API publique.
```

### Diagramme des relations

```
┌──────────┐       ┌──────────────┐       ┌──────────┐
│  users   │       │  downloads   │       │  books   │
├──────────┤       ├──────────────┤       ├──────────┤
│ id (PK)  │◄──────│ user_id (FK) │       │ id (PK)  │
│ name     │       │ book_id (FK) │──────►│ title    │
│ email    │       │ downloaded_at│       │ author   │
│ password │       │              │       │ ...      │
│ role     │       └──────────────┘       └──────────┘
│ created_at│
└──────────┘
```

---

## 6. Authentification et autorisation

### Flux d'authentification

```
Client                           Backend                         Supabase
  │                                │                                │
  │── POST /auth/register ────────►│                                │
  │                                │── Créer user (Auth + DB) ─────►│
  │                                │◄── User créé ──────────────────│
  │                                │── Générer JWT ─────────────────│
  │◄── 201 { user, token } ───────│                                │
  │                                │                                │
  │── POST /auth/login ───────────►│                                │
  │                                │── Vérifier credentials ───────►│
  │                                │◄── User trouvé ────────────────│
  │                                │── Générer JWT ─────────────────│
  │◄── 200 { user, token } ───────│                                │
  │                                │                                │
  │── GET /books/:id/download ────►│                                │
  │   Authorization: Bearer <jwt>  │                                │
  │                                │── Vérifier JWT ────────────────│
  │                                │── Vérifier rôle ───────────────│
  │                                │── Servir fichier ─────────────►│
  │◄── 200 (flux binaire) ────────│                                │
```

### Chaîne de middlewares par niveau d'accès

```typescript
// 🌐 Public — aucun middleware d'auth
router.get('/books', bookController.getAll);

// 🔒 Authentifié — vérification JWT
router.get('/profile', authMiddleware, profileController.get);

// 🔑 Admin — vérification JWT + rôle admin
router.post('/admin/books', authMiddleware, adminMiddleware, ...);
```

> **Conformité G-AUTHZ-01** : La vérification du rôle est toujours côté serveur.  
> **Conformité INV-AUTHZ-01** : Chaque endpoint protégé passe par le middleware.  
> **Conformité X-AUTH-02** : Le champ `role` du body est ignoré lors de l'inscription.

---

## 7. Middlewares

### Pipeline de middlewares

L'ordre d'exécution est critique. Chaque requête traverse les middlewares dans cet ordre :

```
Requête
  │
  ├── 1. CORS                    (global)
  ├── 2. express.json()           (global, parsing JSON)
  ├── 3. Rate Limiter             (global, protection DDoS)
  │
  ├── 4. auth.middleware          (routes protégées)
  │      └── Vérifie le JWT
  │      └── Extrait user du token
  │      └── Attache user à req.user
  │
  ├── 5. admin.middleware         (routes admin)
  │      └── Vérifie req.user.role === 'admin'
  │      └── Renvoie 403 si non-admin
  │
  ├── 6. validate.middleware      (routes avec body)
  │      └── Valide req.body via schéma Zod
  │      └── Renvoie 400 si invalide
  │
  ├── 7. upload.middleware        (routes avec fichier)
  │      └── Parse multipart/form-data via Multer
  │      └── Vérifie type et taille du fichier
  │
  └── 8. error.middleware         (global, dernier)
       └── Capture toutes les erreurs
       └── Formate selon le format de réponse standard
       └── Renvoie le code HTTP approprié
```

### `auth.middleware.ts`

```typescript
// Extrait le token du header Authorization: Bearer <token>
// Vérifie la signature et l'expiration du JWT
// Récupère l'utilisateur depuis la DB
// Attache l'objet user à req.user
// Renvoie 401 UNAUTHORIZED si le token est invalide/expiré
```

> **Conformité INV-AUTHZ-02** : Aucun JWT expiré ou malformé n'est accepté.

### `admin.middleware.ts`

```typescript
// Vérifie que req.user existe (dépend de auth.middleware)
// Vérifie que req.user.role === 'admin'
// Renvoie 403 FORBIDDEN si le rôle n'est pas admin
```

> **Conformité G-AUTHZ-03 / X-ACC-02** : Un `user` ne peut jamais accéder aux endpoints admin.

---

## 8. Routage et contrôleurs

### Table de routage complète

| Méthode  | Route                               | Middlewares                   | Contrôleur                         | Ref API.md |
| -------- | ----------------------------------- | ----------------------------- | ---------------------------------- | ---------- |
| `POST`   | `/api/v1/auth/register`             | validate                      | `authController.register`          | §3         |
| `POST`   | `/api/v1/auth/login`                | validate                      | `authController.login`             | §3         |
| `GET`    | `/api/v1/books`                     | —                             | `bookController.getAll`            | §4         |
| `GET`    | `/api/v1/books/:id`                 | —                             | `bookController.getById`           | §4         |
| `GET`    | `/api/v1/books/:id/download`        | auth                          | `bookController.download`          | §5         |
| `POST`   | `/api/v1/admin/books`               | auth, admin, upload, validate | `adminController.createBook`       | §6         |
| `PUT`    | `/api/v1/admin/books/:id`           | auth, admin, upload           | `adminController.updateBook`       | §6         |
| `DELETE` | `/api/v1/admin/books/:id`           | auth, admin                   | `adminController.deleteBook`       | §6         |
| `GET`    | `/api/v1/admin/users`               | auth, admin                   | `adminController.getUsers`         | §7         |
| `GET`    | `/api/v1/admin/users/:id/downloads` | auth, admin                   | `adminController.getUserDownloads` | §7         |
| `GET`    | `/api/v1/admin/dashboard/stats`     | auth, admin                   | `adminController.getStats`         | §8         |
| `GET`    | `/api/v1/profile`                   | auth                          | `profileController.get`            | §9         |
| `PUT`    | `/api/v1/profile`                   | auth, validate                | `profileController.update`         | §9         |
| `PUT`    | `/api/v1/profile/password`          | auth, validate                | `profileController.updatePassword` | §9         |

### Montage des routes dans `routes/index.ts`

```typescript
import { Router } from "express";
import authRoutes from "./auth.routes";
import bookRoutes from "./book.routes";
import adminRoutes from "./admin.routes";
import profileRoutes from "./profile.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/admin", adminRoutes);
router.use("/profile", profileRoutes);

export default router;
```

### Structure d'un contrôleur

```typescript
// controllers/book.controller.ts

export const bookController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, search, category, sortBy, order } = req.query;
      const result = await bookService.getAll({
        page,
        limit,
        search,
        category,
        sortBy,
        order,
      });
      res.json(successResponse(result.data, result.pagination));
    } catch (error) {
      next(error);
    }
  },

  download: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      // Le service enregistre le téléchargement ET retourne le fichier
      const file = await downloadService.downloadBook(id, userId);
      res.setHeader("Content-Type", file.contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.filename}"`,
      );
      res.send(file.buffer);
    } catch (error) {
      next(error);
    }
  },
};
```

---

## 9. Services métier

Chaque service encapsule la logique métier d'un domaine. Les services sont les **seuls** à interagir avec Supabase.

### `auth.service.ts`

| Méthode          | Responsabilité                                                               | Invariants respectés                      |
| ---------------- | ---------------------------------------------------------------------------- | ----------------------------------------- |
| `register(data)` | Hasher le mot de passe, créer l'utilisateur avec `role: 'user'`, générer JWT | G-SEC-01, X-AUTH-01, X-AUTH-02, INV-ID-01 |
| `login(data)`    | Vérifier les credentials, générer JWT                                        | G-SEC-03, INV-AUTHZ-02                    |

### `book.service.ts`

| Méthode                           | Responsabilité                                          | Invariants respectés   |
| --------------------------------- | ------------------------------------------------------- | ---------------------- |
| `getAll(filters)`                 | Requête paginée avec recherche, filtrage et tri         | INV-DATA-03            |
| `getById(id)`                     | Retourner les détails complets d'un livre               | —                      |
| `create(data, file, cover?)`      | Upload fichier + couverture vers Storage, insérer en DB | INV-DATA-02            |
| `update(id, data, file?, cover?)` | Mettre à jour métadonnées et/ou fichiers                | INV-DATA-02            |
| `delete(id)`                      | Supprimer de la DB **ET** du Storage                    | G-DATA-02, INV-DATA-02 |

### `download.service.ts`

| Méthode                        | Responsabilité                                     | Invariants respectés |
| ------------------------------ | -------------------------------------------------- | -------------------- |
| `downloadBook(bookId, userId)` | Enregistrer le download **puis** servir le fichier | G-DATA-01, X-DATA-01 |

> **Règle critique** : L'enregistrement du téléchargement et le service du fichier sont dans une **même opération atomique**. Le fichier n'est jamais renvoyé si l'enregistrement échoue.

### `user.service.ts`

| Méthode                            | Responsabilité                                                  |
| ---------------------------------- | --------------------------------------------------------------- |
| `getAll(filters)`                  | Liste paginée des utilisateurs avec compteur de téléchargements |
| `getDownloads(userId, pagination)` | Historique des téléchargements d'un utilisateur                 |

### `stats.service.ts`

| Méthode               | Responsabilité                                                                      |
| --------------------- | ----------------------------------------------------------------------------------- |
| `getDashboardStats()` | Agrégation : total livres, utilisateurs, téléchargements + derniers téléchargements |

---

## 10. Gestion des fichiers

### Buckets Supabase Storage

| Bucket   | Contenu              | Types acceptés                            | Taille max |
| -------- | -------------------- | ----------------------------------------- | ---------- |
| `books`  | Fichiers de livres   | `application/pdf`, `application/epub+zip` | 50 Mo      |
| `covers` | Images de couverture | `image/jpeg`, `image/png`                 | 5 Mo       |

### Flux d'upload (`POST /admin/books`)

```
1. Multer parse le multipart/form-data
2. Validation du type MIME et de la taille
3. Upload du fichier vers Supabase Storage (bucket 'books')
4. Upload de la couverture si présente (bucket 'covers')
5. Insertion des métadonnées en DB avec les URLs de stockage
6. Retourner la réponse avec les données du livre
```

### Flux de suppression (`DELETE /admin/books/:id`)

```
1. Récupérer le livre depuis la DB
2. Supprimer le fichier du bucket 'books'
3. Supprimer la couverture du bucket 'covers' (si elle existe)
4. Supprimer l'enregistrement de la DB
5. Les étapes 2-4 sont atomiques : si une échoue, tout est annulé
```

> **Conformité G-DATA-02** : Aucun fichier orphelin, aucun enregistrement orphelin après suppression.

---

## 11. Gestion des erreurs

### Classes d'erreurs

```typescript
// utils/errors.util.ts

class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public message: string,
  ) {
    super(message);
  }
}

// Erreurs spécifiques
class ValidationError extends AppError {} // 400
class UnauthorizedError extends AppError {} // 401
class ForbiddenError extends AppError {} // 403
class NotFoundError extends AppError {} // 404
class ConflictError extends AppError {} // 409
```

### Format de réponse d'erreur

Toutes les erreurs sont capturées par `error.middleware.ts` et formatées uniformément :

```json
{
  "success": false,
  "error": {
    "code": "BOOK_NOT_FOUND",
    "message": "Aucun livre correspondant à l'identifiant fourni"
  }
}
```

> **Conformité G-API-01** : Chaque erreur contient un code HTTP approprié et un message lisible.  
> **Conformité X-AUTH-03** : Les erreurs d'authentification ne révèlent **jamais** de mots de passe.

---

## 12. Validation des entrées

La validation est implémentée via **Zod** et appliquée par le `validate.middleware`.

### Schémas de validation

```typescript
// validators/auth.validator.ts
export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  // Le champ 'role' est intentionnellement ABSENT du schéma.
  // Tout champ non défini dans le schéma est automatiquement écarté.
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
```

```typescript
// validators/book.validator.ts
export const createBookSchema = z.object({
  title: z.string().min(2).max(255),
  author: z.string().min(2).max(255),
  description: z.string().min(1),
  category: z.string().optional(),
});

export const updateBookSchema = z.object({
  title: z.string().min(2).max(255).optional(),
  author: z.string().min(2).max(255).optional(),
  description: z.string().min(1).optional(),
  category: z.string().optional(),
});
```

> **Conformité G-SEC-04** : Toutes les entrées sont validées côté serveur.  
> **Conformité X-AUTH-02** : Le champ `role` est exclu des schémas de validation, donc toujours ignoré.

---

## 13. Script de seed

Le fichier `scripts/seed.ts` est exécuté **une seule fois** au déploiement pour créer le compte admin.

### Comportement

```
1. Lire ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD depuis .env
2. Vérifier si un admin existe déjà → si oui, ne rien faire
3. Hasher le mot de passe
4. Insérer l'utilisateur avec role = 'admin'
5. Afficher un message de confirmation
```

### Exécution

```bash
npx tsx scripts/seed.ts
# ou
npm run seed
```

> **Conformité INV-ID-04** : Le nombre d'admins est déterminé uniquement par le script de seed.  
> **Conformité X-AUTH-01** : Aucun admin n'est créé via le formulaire d'inscription.

---

## 14. Documentation API (Swagger)

La documentation Swagger est générée automatiquement et accessible en développement :

```
GET /api-docs        → Interface Swagger UI
GET /api-docs.json   → Spécification OpenAPI en JSON
```

La documentation est configurée dans `config/swagger.ts` et les annotations sont définies via des commentaires JSDoc ou un fichier de spécification YAML.

> **Conformité G-API-02** : La documentation reflète l'état actuel des endpoints.

---

## 15. Conformité aux invariants

Tableau de correspondance entre les invariants système et leur implémentation dans le backend :

| Invariant             | ID           | Comment c'est garanti                                       |
| --------------------- | ------------ | ----------------------------------------------------------- |
| Role Completeness     | INV-ID-01    | Contrainte `CHECK` en DB + attribution automatique `'user'` |
| Email Uniqueness      | INV-ID-02    | Contrainte `UNIQUE` en DB                                   |
| Password Opacity      | INV-ID-03    | Hachage bcrypt avant toute écriture en DB                   |
| Admin Scarcity        | INV-ID-04    | Script de seed uniquement; `role` ignoré dans le schéma Zod |
| Download Traceability | INV-DATA-01  | Clés étrangères sur `user_id` et `book_id`                  |
| Book Completeness     | INV-DATA-02  | `file_url NOT NULL` + suppression atomique DB/Storage       |
| Catalog Consistency   | INV-DATA-03  | Requête directe sur la table `books` sans filtre caché      |
| Role Enforcement      | INV-AUTHZ-01 | `auth.middleware` + `admin.middleware` sur chaque route     |
| Token Validity        | INV-AUTHZ-02 | Vérification JWT avec expiration dans `auth.middleware`     |
| Privilege Isolation   | INV-AUTHZ-03 | `admin.middleware` vérifie `role === 'admin'`               |
| API Parity            | INV-SYS-01   | Une seule API pour tous les clients                         |
| Transport Security    | INV-SYS-02   | HTTPS forcé en production                                   |
| Stateless Requests    | INV-SYS-03   | JWT dans chaque requête, aucune session serveur             |

---

Digital Library BF — Architecture Backend — Version 1.0 — Mars 2026
