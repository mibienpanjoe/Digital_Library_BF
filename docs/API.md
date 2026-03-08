# Contrat API — Digital Library BF

### Bibliothèque Numérique du Burkina Faso

**Version 1.0 — Mars 2026**

---

> **⚠️ Ce document est la source de vérité unique.**
>
> - Le backend implémente **exactement** ce qui est documenté ici.
> - Les frontends (Next.js + Flutter) consomment **exactement** ce qui est documenté ici.
> - Tout changement d'API **DOIT** être documenté ici **AVANT** implémentation.
> - Tout écart doit être discuté et validé par l'équipe.

---

## Table des matières

1. [Conventions générales](#1-conventions-générales)
2. [Authentification](#2-authentification)
3. [Endpoints — Auth](#3-endpoints--auth)
4. [Endpoints — Livres (Public)](#4-endpoints--livres-public)
5. [Endpoints — Téléchargement](#5-endpoints--téléchargement)
6. [Endpoints — Gestion des livres (Admin)](#6-endpoints--gestion-des-livres-admin)
7. [Endpoints — Gestion des utilisateurs (Admin)](#7-endpoints--gestion-des-utilisateurs-admin)
8. [Endpoints — Tableau de bord (Admin)](#8-endpoints--tableau-de-bord-admin)
9. [Endpoints — Profil](#9-endpoints--profil)
10. [Codes d'erreur](#10-codes-derreur)
11. [Modèles de données](#11-modèles-de-données)
12. [Historique des modifications](#12-historique-des-modifications)

---

## 1. Conventions générales

### Base URL

```
Production : https://<domaine-api>/api/v1
Développement : http://localhost:<PORT>/api/v1
```

### Format des données

| Élément           | Convention                                                          |
| ----------------- | ------------------------------------------------------------------- |
| Format de requête | `application/json` (sauf upload de fichier : `multipart/form-data`) |
| Format de réponse | `application/json`                                                  |
| Encodage          | UTF-8                                                               |
| Dates             | ISO 8601 (`2026-03-08T21:00:00Z`)                                   |
| IDs               | UUID v4 (chaîne de caractères)                                      |

### Structure de réponse standard

**Succès :**

```json
{
  "success": true,
  "data": { ... },
  "message": "Description du résultat"
}
```

**Succès avec pagination :**

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Erreur :**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description lisible de l'erreur"
  }
}
```

### Pagination

Tous les endpoints retournant des listes supportent la pagination via des query parameters :

| Paramètre | Type    | Défaut | Description                            |
| --------- | ------- | ------ | -------------------------------------- |
| `page`    | integer | `1`    | Numéro de la page                      |
| `limit`   | integer | `20`   | Nombre d'éléments par page (max : 100) |

### En-têtes requis

| En-tête         | Valeur                                      | Obligatoire                   |
| --------------- | ------------------------------------------- | ----------------------------- |
| `Content-Type`  | `application/json` ou `multipart/form-data` | Oui                           |
| `Authorization` | `Bearer <jwt_token>`                        | Endpoints protégés uniquement |

---

## 2. Authentification

### Mécanisme

L'authentification repose sur **JWT (JSON Web Token)**.

1. Le client envoie ses identifiants à l'endpoint de login.
2. Le serveur retourne un JWT signé.
3. Le client inclut ce token dans l'en-tête `Authorization` de chaque requête protégée.

### Rôles

| Rôle    | Description          | Création                  |
| ------- | -------------------- | ------------------------- |
| `user`  | Utilisateur standard | Inscription publique      |
| `admin` | Administrateur       | Script de seed uniquement |

### Niveaux d'accès

| Niveau         | Notation dans ce document | Signification                       |
| -------------- | ------------------------- | ----------------------------------- |
| 🌐 Public      | `Public`                  | Aucune authentification requise     |
| 🔒 Authentifié | `Auth`                    | JWT valide requis                   |
| 🔑 Admin       | `Admin`                   | JWT valide avec rôle `admin` requis |

---

## 3. Endpoints — Auth

---

### `POST /auth/register`

**Accès :** 🌐 Public

Crée un nouveau compte utilisateur.

**Corps de la requête :**

```json
{
  "name": "Amadou Ouédraogo",
  "email": "amadou@example.com",
  "password": "MotDePasse123!"
}
```

| Champ      | Type   | Obligatoire | Contraintes                 |
| ---------- | ------ | ----------- | --------------------------- |
| `name`     | string | Oui         | 2–100 caractères            |
| `email`    | string | Oui         | Format email valide, unique |
| `password` | string | Oui         | 8 caractères minimum        |

**Réponse succès — `201 Created` :**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-v4",
      "name": "Amadou Ouédraogo",
      "email": "amadou@example.com",
      "role": "user",
      "createdAt": "2026-03-08T21:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Inscription réussie"
}
```

**Erreurs possibles :**

| Code HTTP | Code erreur            | Cause                         |
| --------- | ---------------------- | ----------------------------- |
| `400`     | `VALIDATION_ERROR`     | Champs manquants ou invalides |
| `409`     | `EMAIL_ALREADY_EXISTS` | Email déjà utilisé            |

**Règle contractuelle :** Même si un champ `role` est envoyé dans le corps de la requête, il est **ignoré**. Le rôle attribué est toujours `user`.

---

### `POST /auth/login`

**Accès :** 🌐 Public

Authentifie un utilisateur (user ou admin).

**Corps de la requête :**

```json
{
  "email": "amadou@example.com",
  "password": "MotDePasse123!"
}
```

| Champ      | Type   | Obligatoire |
| ---------- | ------ | ----------- |
| `email`    | string | Oui         |
| `password` | string | Oui         |

**Réponse succès — `200 OK` :**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-v4",
      "name": "Amadou Ouédraogo",
      "email": "amadou@example.com",
      "role": "user",
      "createdAt": "2026-03-08T21:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Connexion réussie"
}
```

**Erreurs possibles :**

| Code HTTP | Code erreur           | Cause                           |
| --------- | --------------------- | ------------------------------- |
| `400`     | `VALIDATION_ERROR`    | Champs manquants                |
| `401`     | `INVALID_CREDENTIALS` | Email ou mot de passe incorrect |

---

## 4. Endpoints — Livres (Public)

---

### `GET /books`

**Accès :** 🌐 Public

Retourne la liste paginée des livres du catalogue.

**Query parameters :**

| Paramètre  | Type    | Défaut      | Description                                   |
| ---------- | ------- | ----------- | --------------------------------------------- |
| `page`     | integer | `1`         | Numéro de la page                             |
| `limit`    | integer | `20`        | Éléments par page                             |
| `search`   | string  | —           | Recherche par mot-clé (titre, auteur)         |
| `category` | string  | —           | Filtrer par catégorie                         |
| `sortBy`   | string  | `createdAt` | Champ de tri (`title`, `author`, `createdAt`) |
| `order`    | string  | `desc`      | Ordre de tri (`asc`, `desc`)                  |

**Réponse succès — `200 OK` :**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-v4",
      "title": "Histoire du Burkina Faso",
      "author": "Joseph Ki-Zerbo",
      "description": "Un regard approfondi sur l'histoire...",
      "coverUrl": "https://storage.example.com/covers/uuid.jpg",
      "category": "Histoire",
      "fileFormat": "pdf",
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### `GET /books/:id`

**Accès :** 🌐 Public

Retourne les détails complets d'un livre.

**Paramètres de chemin :**

| Paramètre | Type          | Description                 |
| --------- | ------------- | --------------------------- |
| `id`      | string (UUID) | Identifiant unique du livre |

**Réponse succès — `200 OK` :**

```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "title": "Histoire du Burkina Faso",
    "author": "Joseph Ki-Zerbo",
    "description": "Un regard approfondi sur l'histoire...",
    "coverUrl": "https://storage.example.com/covers/uuid.jpg",
    "fileFormat": "pdf",
    "fileSize": 5242880,
    "category": "Histoire",
    "downloadCount": 127,
    "createdAt": "2026-03-01T10:00:00Z",
    "updatedAt": "2026-03-05T14:30:00Z"
  },
  "message": "Livre récupéré avec succès"
}
```

**Erreurs possibles :**

| Code HTTP | Code erreur      | Cause                          |
| --------- | ---------------- | ------------------------------ |
| `404`     | `BOOK_NOT_FOUND` | Aucun livre trouvé avec cet ID |

---

## 5. Endpoints — Téléchargement

---

### `GET /books/:id/download`

**Accès :** 🔒 Auth

Télécharge le fichier d'un livre. Chaque appel réussi **enregistre un événement de téléchargement**.

**Paramètres de chemin :**

| Paramètre | Type          | Description                 |
| --------- | ------------- | --------------------------- |
| `id`      | string (UUID) | Identifiant unique du livre |

**En-têtes requis :**

| En-tête         | Valeur               |
| --------------- | -------------------- |
| `Authorization` | `Bearer <jwt_token>` |

**Réponse succès — `200 OK` :**

- **Content-Type** : `application/pdf` ou `application/epub+zip`
- **Content-Disposition** : `attachment; filename="titre-du-livre.pdf"`
- **Corps** : flux binaire du fichier

**Erreurs possibles :**

| Code HTTP | Code erreur      | Cause                          |
| --------- | ---------------- | ------------------------------ |
| `401`     | `UNAUTHORIZED`   | Token manquant ou invalide     |
| `404`     | `BOOK_NOT_FOUND` | Aucun livre trouvé avec cet ID |

**Règle contractuelle :** Le fichier n'est JAMAIS renvoyé sans que l'événement de téléchargement ne soit enregistré.

---

## 6. Endpoints — Gestion des livres (Admin)

---

### `POST /admin/books`

**Accès :** 🔑 Admin

Ajoute un nouveau livre au catalogue.

**Format de requête :** `multipart/form-data`

| Champ         | Type   | Obligatoire | Description                                |
| ------------- | ------ | ----------- | ------------------------------------------ |
| `title`       | string | Oui         | Titre du livre (2–255 caractères)          |
| `author`      | string | Oui         | Auteur du livre (2–255 caractères)         |
| `description` | string | Oui         | Description du livre                       |
| `category`    | string | Non         | Catégorie du livre                         |
| `cover`       | file   | Non         | Image de couverture (JPEG, PNG — max 5 Mo) |
| `file`        | file   | Oui         | Fichier du livre (PDF ou ePub — max 50 Mo) |

**Réponse succès — `201 Created` :**

```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "title": "Nouveau Livre",
    "author": "Auteur Exemple",
    "description": "Description du livre...",
    "coverUrl": "https://storage.example.com/covers/uuid.jpg",
    "fileFormat": "pdf",
    "fileSize": 3145728,
    "category": "Littérature",
    "createdAt": "2026-03-08T21:00:00Z"
  },
  "message": "Livre ajouté avec succès"
}
```

**Erreurs possibles :**

| Code HTTP | Code erreur         | Cause                              |
| --------- | ------------------- | ---------------------------------- |
| `400`     | `VALIDATION_ERROR`  | Champs manquants ou invalides      |
| `400`     | `INVALID_FILE_TYPE` | Type de fichier non supporté       |
| `400`     | `FILE_TOO_LARGE`    | Fichier dépasse la taille maximale |
| `401`     | `UNAUTHORIZED`      | Token manquant ou invalide         |
| `403`     | `FORBIDDEN`         | Rôle insuffisant (non-admin)       |

---

### `PUT /admin/books/:id`

**Accès :** 🔑 Admin

Met à jour les métadonnées d'un livre existant.

**Format de requête :** `multipart/form-data`

| Champ         | Type   | Obligatoire | Description                  |
| ------------- | ------ | ----------- | ---------------------------- |
| `title`       | string | Non         | Nouveau titre                |
| `author`      | string | Non         | Nouvel auteur                |
| `description` | string | Non         | Nouvelle description         |
| `category`    | string | Non         | Nouvelle catégorie           |
| `cover`       | file   | Non         | Nouvelle image de couverture |
| `file`        | file   | Non         | Nouveau fichier du livre     |

> **Note :** Seuls les champs envoyés seront mis à jour. Les champs absents restent inchangés.

**Réponse succès — `200 OK` :**

```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "title": "Titre Mis à Jour",
    "author": "Auteur Exemple",
    "description": "Description mise à jour...",
    "coverUrl": "https://storage.example.com/covers/uuid.jpg",
    "fileFormat": "pdf",
    "fileSize": 3145728,
    "category": "Littérature",
    "createdAt": "2026-03-01T10:00:00Z",
    "updatedAt": "2026-03-08T21:30:00Z"
  },
  "message": "Livre mis à jour avec succès"
}
```

**Erreurs possibles :**

| Code HTTP | Code erreur         | Cause                        |
| --------- | ------------------- | ---------------------------- |
| `400`     | `VALIDATION_ERROR`  | Données invalides            |
| `400`     | `INVALID_FILE_TYPE` | Type de fichier non supporté |
| `401`     | `UNAUTHORIZED`      | Token manquant ou invalide   |
| `403`     | `FORBIDDEN`         | Rôle insuffisant             |
| `404`     | `BOOK_NOT_FOUND`    | Livre introuvable            |

---

### `DELETE /admin/books/:id`

**Accès :** 🔑 Admin

Supprime un livre et son fichier associé du stockage.

**Paramètres de chemin :**

| Paramètre | Type          | Description                 |
| --------- | ------------- | --------------------------- |
| `id`      | string (UUID) | Identifiant unique du livre |

**Réponse succès — `200 OK` :**

```json
{
  "success": true,
  "data": null,
  "message": "Livre supprimé avec succès"
}
```

**Erreurs possibles :**

| Code HTTP | Code erreur      | Cause                      |
| --------- | ---------------- | -------------------------- |
| `401`     | `UNAUTHORIZED`   | Token manquant ou invalide |
| `403`     | `FORBIDDEN`      | Rôle insuffisant           |
| `404`     | `BOOK_NOT_FOUND` | Livre introuvable          |

**Règle contractuelle :** La suppression retire les métadonnées de la base de données **ET** le fichier du stockage. Aucun orphelin ne doit subsister.

---

## 7. Endpoints — Gestion des utilisateurs (Admin)

---

### `GET /admin/users`

**Accès :** 🔑 Admin

Retourne la liste paginée de tous les utilisateurs inscrits.

**Query parameters :**

| Paramètre | Type    | Défaut | Description                |
| --------- | ------- | ------ | -------------------------- |
| `page`    | integer | `1`    | Numéro de la page          |
| `limit`   | integer | `20`   | Éléments par page          |
| `search`  | string  | —      | Recherche par nom ou email |

**Réponse succès — `200 OK` :**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-v4",
      "name": "Amadou Ouédraogo",
      "email": "amadou@example.com",
      "role": "user",
      "createdAt": "2026-03-01T10:00:00Z",
      "downloadCount": 12
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 85,
    "totalPages": 5
  }
}
```

**Erreurs possibles :**

| Code HTTP | Code erreur    | Cause                      |
| --------- | -------------- | -------------------------- |
| `401`     | `UNAUTHORIZED` | Token manquant ou invalide |
| `403`     | `FORBIDDEN`    | Rôle insuffisant           |

---

### `GET /admin/users/:id/downloads`

**Accès :** 🔑 Admin

Retourne l'historique des téléchargements d'un utilisateur spécifique.

**Paramètres de chemin :**

| Paramètre | Type          | Description                         |
| --------- | ------------- | ----------------------------------- |
| `id`      | string (UUID) | Identifiant unique de l'utilisateur |

**Query parameters :**

| Paramètre | Type    | Défaut | Description       |
| --------- | ------- | ------ | ----------------- |
| `page`    | integer | `1`    | Numéro de la page |
| `limit`   | integer | `20`   | Éléments par page |

**Réponse succès — `200 OK` :**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-v4",
      "book": {
        "id": "uuid-v4",
        "title": "Histoire du Burkina Faso",
        "author": "Joseph Ki-Zerbo"
      },
      "downloadedAt": "2026-03-07T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

**Erreurs possibles :**

| Code HTTP | Code erreur      | Cause                      |
| --------- | ---------------- | -------------------------- |
| `401`     | `UNAUTHORIZED`   | Token manquant ou invalide |
| `403`     | `FORBIDDEN`      | Rôle insuffisant           |
| `404`     | `USER_NOT_FOUND` | Utilisateur introuvable    |

---

## 8. Endpoints — Tableau de bord (Admin)

---

### `GET /admin/dashboard/stats`

**Accès :** 🔑 Admin

Retourne les statistiques agrégées de la plateforme.

**Réponse succès — `200 OK` :**

```json
{
  "success": true,
  "data": {
    "totalBooks": 45,
    "totalUsers": 320,
    "totalDownloads": 1580,
    "recentDownloads": [
      {
        "id": "uuid-v4",
        "user": {
          "id": "uuid-v4",
          "name": "Amadou Ouédraogo"
        },
        "book": {
          "id": "uuid-v4",
          "title": "Histoire du Burkina Faso"
        },
        "downloadedAt": "2026-03-08T20:45:00Z"
      }
    ]
  },
  "message": "Statistiques récupérées avec succès"
}
```

**Erreurs possibles :**

| Code HTTP | Code erreur    | Cause                      |
| --------- | -------------- | -------------------------- |
| `401`     | `UNAUTHORIZED` | Token manquant ou invalide |
| `403`     | `FORBIDDEN`    | Rôle insuffisant           |

---

## 9. Endpoints — Profil

---

### `GET /profile`

**Accès :** 🔒 Auth

Retourne le profil de l'utilisateur authentifié.

**Réponse succès — `200 OK` :**

```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "name": "Amadou Ouédraogo",
    "email": "amadou@example.com",
    "role": "user",
    "createdAt": "2026-03-01T10:00:00Z"
  },
  "message": "Profil récupéré avec succès"
}
```

**Erreurs possibles :**

| Code HTTP | Code erreur    | Cause                      |
| --------- | -------------- | -------------------------- |
| `401`     | `UNAUTHORIZED` | Token manquant ou invalide |

---

### `PUT /profile`

**Accès :** 🔒 Auth

Met à jour le profil de l'utilisateur authentifié.

**Corps de la requête :**

```json
{
  "name": "Nouveau Nom",
  "email": "nouvel.email@example.com"
}
```

| Champ   | Type   | Obligatoire | Contraintes                 |
| ------- | ------ | ----------- | --------------------------- |
| `name`  | string | Non         | 2–100 caractères            |
| `email` | string | Non         | Format email valide, unique |

> **Note :** Seuls les champs envoyés seront mis à jour.

**Réponse succès — `200 OK` :**

```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "name": "Nouveau Nom",
    "email": "nouvel.email@example.com",
    "role": "user",
    "createdAt": "2026-03-01T10:00:00Z"
  },
  "message": "Profil mis à jour avec succès"
}
```

**Erreurs possibles :**

| Code HTTP | Code erreur            | Cause                                  |
| --------- | ---------------------- | -------------------------------------- |
| `400`     | `VALIDATION_ERROR`     | Données invalides                      |
| `401`     | `UNAUTHORIZED`         | Token manquant ou invalide             |
| `409`     | `EMAIL_ALREADY_EXISTS` | Email déjà utilisé par un autre compte |

---

### `PUT /profile/password`

**Accès :** 🔒 Auth

Met à jour le mot de passe de l'utilisateur authentifié.

**Corps de la requête :**

```json
{
  "currentPassword": "AncienMotDePasse123!",
  "newPassword": "NouveauMotDePasse456!"
}
```

| Champ             | Type   | Obligatoire | Contraintes          |
| ----------------- | ------ | ----------- | -------------------- |
| `currentPassword` | string | Oui         | Mot de passe actuel  |
| `newPassword`     | string | Oui         | 8 caractères minimum |

**Réponse succès — `200 OK` :**

```json
{
  "success": true,
  "data": null,
  "message": "Mot de passe mis à jour avec succès"
}
```

**Erreurs possibles :**

| Code HTTP | Code erreur                | Cause                         |
| --------- | -------------------------- | ----------------------------- |
| `400`     | `VALIDATION_ERROR`         | Nouveau mot de passe invalide |
| `401`     | `UNAUTHORIZED`             | Token manquant ou invalide    |
| `401`     | `INVALID_CURRENT_PASSWORD` | Mot de passe actuel incorrect |

---

## 10. Codes d'erreur

### Codes HTTP utilisés

| Code  | Signification         | Usage                                    |
| ----- | --------------------- | ---------------------------------------- |
| `200` | OK                    | Requête traitée avec succès              |
| `201` | Created               | Ressource créée avec succès              |
| `400` | Bad Request           | Données invalides ou manquantes          |
| `401` | Unauthorized          | Authentification requise ou échouée      |
| `403` | Forbidden             | Permissions insuffisantes                |
| `404` | Not Found             | Ressource introuvable                    |
| `409` | Conflict              | Conflit de données (ex : email dupliqué) |
| `413` | Payload Too Large     | Fichier trop volumineux                  |
| `500` | Internal Server Error | Erreur interne du serveur                |

### Référence des codes d'erreur applicatifs

| Code erreur                | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `VALIDATION_ERROR`         | Un ou plusieurs champs sont manquants ou invalides     |
| `UNAUTHORIZED`             | Token JWT manquant, expiré ou invalide                 |
| `FORBIDDEN`                | L'utilisateur n'a pas les permissions requises         |
| `INVALID_CREDENTIALS`      | Email ou mot de passe incorrect                        |
| `INVALID_CURRENT_PASSWORD` | Le mot de passe actuel fourni est incorrect            |
| `EMAIL_ALREADY_EXISTS`     | L'adresse email est déjà associée à un compte          |
| `BOOK_NOT_FOUND`           | Aucun livre correspondant à l'identifiant fourni       |
| `USER_NOT_FOUND`           | Aucun utilisateur correspondant à l'identifiant fourni |
| `INVALID_FILE_TYPE`        | Le type de fichier uploadé n'est pas supporté          |
| `FILE_TOO_LARGE`           | Le fichier dépasse la taille maximale autorisée        |

---

## 11. Modèles de données

### User

```typescript
{
  id: string; // UUID v4
  name: string; // 2–100 caractères
  email: string; // Unique, format email valide
  role: "user" | "admin";
  createdAt: string; // ISO 8601
}
```

> **Note :** Le mot de passe n'est **JAMAIS** retourné dans aucune réponse API.

### Book

```typescript
{
  id: string; // UUID v4
  title: string; // 2–255 caractères
  author: string; // 2–255 caractères
  description: string;
  coverUrl: string; // URL de l'image de couverture (nullable)
  fileFormat: "pdf" | "epub";
  fileSize: number; // Taille en octets
  category: string; // Catégorie (nullable)
  downloadCount: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Download

```typescript
{
  id: string; // UUID v4
  user: {
    id: string;
    name: string;
  }
  book: {
    id: string;
    title: string;
    author: string;
  }
  downloadedAt: string; // ISO 8601
}
```

---

## 12. Historique des modifications

| Date       | Version | Auteur                    | Description                     |
| ---------- | ------- | ------------------------- | ------------------------------- |
| 2026-03-08 | 1.0     | Équipe Digital Library BF | Version initiale du contrat API |

---

> **Rappel :** Toute modification de ce document doit être validée par l'équipe avant implémentation. Aucun endpoint ne doit être ajouté, modifié ou supprimé sans mise à jour préalable de ce contrat.

---

_Digital Library BF — Contrat API — Version 1.0 — Mars 2026_
