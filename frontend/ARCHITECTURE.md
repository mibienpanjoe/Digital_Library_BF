# Architecture Frontend — Digital Library BF

### Next.js + shadcn/ui (TypeScript)

**Version 1.0 — Mars 2026**

---

> Ce document définit l'architecture détaillée du frontend web de Digital Library BF.
> Il constitue la référence pour le développement et respecte les contrats définis dans :
>
> - [`docs/API.md`](../docs/API.md) — Contrat API (source de vérité des endpoints)
> - [`docs/visual_identity.md`](../docs/visual_identity.md) — Identité visuelle et lignes directrices UI/UX

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Structure des dossiers](#2-structure-des-dossiers)
3. [Architecture en couches](#3-architecture-en-couches)
4. [Routage et pages](#4-routage-et-pages)
5. [Layouts](#5-layouts)
6. [Composants UI](#6-composants-ui)
7. [Service API (couche données)](#7-service-api-couche-données)
8. [Authentification et protection des routes](#8-authentification-et-protection-des-routes)
9. [Gestion d'état](#9-gestion-détat)
10. [Thème et Design System](#10-thème-et-design-system)
11. [Chargement et UX](#11-chargement-et-ux)
12. [SEO et performance](#12-seo-et-performance)
13. [Variables d'environnement](#13-variables-denvironnement)
14. [Conformité aux contrats](#14-conformité-aux-contrats)

---

## 1. Vue d'ensemble

Le frontend est une application **Next.js (App Router)** avec **TypeScript**, utilisant **shadcn/ui** comme bibliothèque de composants et **Tailwind CSS** pour le styling. L'application couvre deux espaces :

1. **Portail public** — Catalogue de livres, recherche, détails, téléchargement
2. **Dashboard admin** — Gestion des livres, utilisateurs, statistiques

Les deux espaces coexistent dans la même application grâce au routage basé sur les fichiers de Next.js.

### Principes architecturaux

| Principe                                      | Description                                                                                                          |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Server Components par défaut**              | Utiliser les React Server Components (RSC) pour le rendu côté serveur, sauf quand l'interactivité client est requise |
| **API.md comme source de vérité**             | Chaque appel API correspond exactement à un endpoint documenté dans `docs/API.md`                                    |
| **visual_identity.md comme référence design** | Chaque composant respecte la palette, la typographie, et les conventions UI définies                                 |
| **Composants atomiques**                      | Petits composants réutilisables, composés pour former des pages                                                      |
| **Séparation données/UI**                     | La logique d'appel API est isolée dans une couche de services dédiée                                                 |

---

## 2. Structure des dossiers

```
frontend/
├── public/
│   ├── favicon.ico
│   └── images/                     # Assets statiques (logo, illustrations)
│
├── src/
│   ├── app/                        # App Router (pages et layouts)
│   │   ├── layout.tsx              # Layout racine (html, body, providers, police Inter)
│   │   ├── page.tsx                # Route / — Catalogue public
│   │   ├── loading.tsx             # Skeleton global
│   │   ├── not-found.tsx           # Page 404 personnalisée
│   │   │
│   │   ├── book/
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Route /book/[id] — Détail d'un livre
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx            # Route /login — Connexion
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx            # Route /register — Inscription
│   │   │
│   │   └── admin/
│   │       ├── layout.tsx          # Layout admin (sidebar + guard rôle)
│   │       ├── dashboard/
│   │       │   └── page.tsx        # Route /admin/dashboard — Statistiques
│   │       ├── upload/
│   │       │   └── page.tsx        # Route /admin/upload — Upload de livre
│   │       ├── books/
│   │       │   └── page.tsx        # Route /admin/books — Liste et gestion
│   │       └── users/
│   │           └── page.tsx        # Route /admin/users — Liste utilisateurs
│   │
│   ├── components/
│   │   ├── ui/                     # Composants shadcn/ui (Button, Card, Input, etc.)
│   │   │
│   │   ├── layout/                 # Composants structurels
│   │   │   ├── Navbar.tsx          # Barre de navigation publique (glassmorphism)
│   │   │   ├── Footer.tsx          # Pied de page
│   │   │   ├── AdminSidebar.tsx    # Barre latérale admin
│   │   │   └── ThemeToggle.tsx     # Bouton de basculement Light/Dark
│   │   │
│   │   ├── book/                   # Composants liés aux livres
│   │   │   ├── BookCard.tsx        # Carte de livre (catalogue)
│   │   │   ├── BookGrid.tsx        # Grille de cartes de livres
│   │   │   ├── BookDetail.tsx      # Vue détaillée d'un livre
│   │   │   ├── BookSearch.tsx      # Barre de recherche + filtres
│   │   │   └── DownloadButton.tsx  # Bouton de téléchargement (conditionnel auth)
│   │   │
│   │   ├── admin/                  # Composants admin
│   │   │   ├── StatsCard.tsx       # Carte statistique (dashboard)
│   │   │   ├── BookTable.tsx       # Tableau de gestion des livres
│   │   │   ├── BookForm.tsx        # Formulaire d'upload/édition
│   │   │   ├── UserTable.tsx       # Tableau des utilisateurs
│   │   │   ├── DownloadHistory.tsx # Historique de téléchargements
│   │   │   └── DeleteBookDialog.tsx# Dialogue de confirmation suppression
│   │   │
│   │   ├── auth/                   # Composants d'authentification
│   │   │   ├── LoginForm.tsx       # Formulaire de connexion
│   │   │   └── RegisterForm.tsx    # Formulaire d'inscription
│   │   │
│   │   └── shared/                 # Composants utilitaires réutilisables
│   │       ├── Skeleton.tsx        # Squelettes de chargement personnalisés
│   │       ├── Pagination.tsx      # Contrôle de pagination
│   │       ├── EmptyState.tsx      # État vide (aucun résultat)
│   │       └── ErrorState.tsx      # État d'erreur
│   │
│   ├── services/                   # Couche d'accès aux données (API calls)
│   │   ├── api.ts                  # Client HTTP (fetch wrapper + intercepteurs)
│   │   ├── auth.service.ts         # Appels API : register, login
│   │   ├── book.service.ts         # Appels API : getAll, getById, download
│   │   ├── admin.service.ts        # Appels API : CRUD livres, users, stats
│   │   └── profile.service.ts     # Appels API : get/update profil, password
│   │
│   ├── hooks/                      # Hooks React personnalisés
│   │   ├── useAuth.ts              # Hook d'authentification (login, logout, user courant)
│   │   ├── useBooks.ts             # Hook pour le catalogue avec pagination/recherche
│   │   └── useTheme.ts             # Hook pour le Light/Dark mode
│   │
│   ├── lib/                        # Utilitaires et configuration
│   │   ├── utils.ts                # Fonctions helper (cn(), formatDate, etc.)
│   │   └── constants.ts            # Constantes (URL API, limites de pagination, etc.)
│   │
│   ├── types/                      # Types TypeScript partagés
│   │   ├── user.ts                 # User, UserRole, AuthResponse
│   │   ├── book.ts                 # Book, BookCreate, BookUpdate
│   │   ├── api.ts                  # ApiResponse, PaginatedResponse, ApiError
│   │   └── download.ts             # Download
│   │
│   └── providers/                  # Context Providers React
│       ├── AuthProvider.tsx        # Contexte d'authentification global
│       └── ThemeProvider.tsx       # Contexte du thème (next-themes)
│
├── .env.example
├── .env.local                      # JAMAIS commité
├── components.json                 # Configuration shadcn/ui
├── tailwind.config.ts              # Configuration Tailwind (thème personnalisé)
├── next.config.ts
├── tsconfig.json
├── package.json
└── ARCHITECTURE.md                 # Ce fichier
```

---

## 3. Architecture en couches

```
Utilisateur (navigateur)
     │
     ▼
┌─────────────────────────────────────────────────┐
│  PAGES (app/)                                   │
│  Server Components par défaut                   │
│  Responsables du data fetching côté serveur     │
│  Assemblent les composants pour former une vue   │
└─────────────────┬───────────────────────────────┘
                  │
     ┌────────────┴────────────┐
     ▼                         ▼
┌──────────────────┐   ┌──────────────────┐
│  COMPOSANTS UI   │   │  CLIENT          │
│  (components/)   │   │  COMPONENTS      │
│  Présentation    │   │  (interactivité) │
│  pure, sans état │   │  "use client"    │
│  métier          │   │  Formulaires,    │
│                  │   │  modales, hover  │
└──────────────────┘   └────────┬─────────┘
                                │
                                ▼
                  ┌──────────────────────┐
                  │  SERVICES (services/)│
                  │  Appels API fetch    │
                  │  Gestion du token    │
                  │  Formatage données   │
                  └──────────────────────┘
                                │
                                ▼
                       Backend API REST
                    (docs/API.md §1–§11)
```

### Responsabilités par couche

| Couche                | Responsabilité                                                | Ne fait PAS                            |
| --------------------- | ------------------------------------------------------------- | -------------------------------------- |
| **Pages**             | Data fetching SSR, assemblage de composants, métadonnées SEO  | Logique d'interaction utilisateur      |
| **Composants UI**     | Présentation, rendu visuel, props typées                      | Appels API directs                     |
| **Client Components** | Gestion des états locaux, formulaires, événements utilisateur | Data fetching initial (sauf mutations) |
| **Services**          | Appels HTTP, gestion du token JWT, typage des réponses        | Rendu UI, gestion d'état global        |

---

## 4. Routage et pages

Table complète des routes, alignée sur le contrat API et la section 5 du SRS :

| Route              | Type   | Accès     | Page                                      | Données (source API)           |
| ------------------ | ------ | --------- | ----------------------------------------- | ------------------------------ |
| `/`                | RSC    | 🌐 Public | Catalogue avec recherche et filtres       | `GET /books`                   |
| `/book/[id]`       | RSC    | 🌐 Public | Détail d'un livre + bouton téléchargement | `GET /books/:id`               |
| `/login`           | Client | 🌐 Public | Formulaire de connexion                   | `POST /auth/login`             |
| `/register`        | Client | 🌐 Public | Formulaire d'inscription                  | `POST /auth/register`          |
| `/admin/dashboard` | RSC    | 🔑 Admin  | Statistiques agrégées                     | `GET /admin/dashboard/stats`   |
| `/admin/upload`    | Client | 🔑 Admin  | Formulaire d'upload de livre              | `POST /admin/books`            |
| `/admin/books`     | RSC    | 🔑 Admin  | Liste des livres avec actions edit/delete | `GET /books` + admin mutations |
| `/admin/users`     | RSC    | 🔑 Admin  | Liste des utilisateurs + historique       | `GET /admin/users`             |

**RSC** = React Server Component (données chargées côté serveur)
**Client** = Client Component (interactivité nécessaire)

---

## 5. Layouts

### Layout racine (`app/layout.tsx`)

```
┌──────────────────────────────────────────┐
│ <html>                                   │
│   <body className="font-inter">          │
│     <ThemeProvider>                       │
│       <AuthProvider>                      │
│         {children}                        │
│       </AuthProvider>                     │
│     </ThemeProvider>                      │
│   </body>                                │
│ </html>                                  │
└──────────────────────────────────────────┘
```

- Police **Inter** chargée via `next/font/google`
- `ThemeProvider` de `next-themes` pour Light/Dark mode
- `AuthProvider` injecte le contexte utilisateur (JWT, rôle)

### Layout public (implicite via les pages racine)

```
┌──────────────────────────────────────────┐
│ Navbar (glassmorphism, sticky top)       │
│   Logo | Recherche | Login/Profile       │
├──────────────────────────────────────────┤
│                                          │
│           {children}                     │
│     (contenu de la page courante)        │
│                                          │
├──────────────────────────────────────────┤
│ Footer                                   │
└──────────────────────────────────────────┘
```

- La **Navbar** applique le glassmorphism : `bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700`
- Affiche conditionnellement le bouton "Connexion" ou le menu profil selon l'état d'authentification

### Layout admin (`app/admin/layout.tsx`)

```
┌────────────────┬─────────────────────────┐
│                │ Header Admin            │
│  AdminSidebar  │ (breadcrumb + profil)   │
│                ├─────────────────────────┤
│  - Dashboard   │                         │
│  - Upload      │      {children}         │
│  - Livres      │  (page admin courante)  │
│  - Utilisateurs│                         │
│                │                         │
└────────────────┴─────────────────────────┘
```

- Le layout admin **vérifie le rôle** de l'utilisateur avant le rendu
- Si non authentifié → redirection vers `/login`
- Si rôle `user` → redirection vers `/` (accès refusé)
- La sidebar utilise **Lucide Icons** avec le style actif en `Primary Blue`

---

## 6. Composants UI

### 6.1. Composants shadcn/ui utilisés

Les composants de base sont installés depuis shadcn/ui et configurés selon l'identité visuelle :

| Composant            | Usage                          | Configuration visuelle                           |
| -------------------- | ------------------------------ | ------------------------------------------------ |
| `Button`             | Tous les boutons               | `rounded-lg`, variantes primary/outline/ghost    |
| `Card`               | Cartes de livres, cartes stats | `rounded-xl`, border 1px, hover `shadow-md`      |
| `Input`              | Champs de formulaire           | `rounded-lg`, focus ring `Primary Blue`          |
| `Dialog`             | Modales de confirmation        | `rounded-xl`, animation `slide-in-from-bottom`   |
| `Table`              | Tableaux admin                 | Lignes hover `Slate 100/700`                     |
| `Badge`              | Catégories, rôles              | `rounded-lg`, variante `Sahel Gold` pour premium |
| `Skeleton`           | Chargement                     | Forme des cartes de livres                       |
| `DropdownMenu`       | Menu profil, actions           | `rounded-xl`, `shadow-xl`                        |
| `Pagination`         | Navigation paginée             | Conforme au format `docs/API.md` §1              |
| `Toaster` / `Sonner` | Notifications (succès, erreur) | Position bottom-right                            |

### 6.2. Composants métier clés

#### `BookCard.tsx`

```
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │                   │  │
│  │   Couverture      │  │
│  │   (Image)         │  │
│  │                   │  │
│  └───────────────────┘  │
│                         │
│  Titre du Livre         │  ← text-lg font-semibold
│  Auteur                 │  ← text-sm text-slate-500
│                         │
│  ┌─────┐                │
│  │ PDF │  Histoire      │  ← Badge format + Badge catégorie
│  └─────┘                │
└─────────────────────────┘
```

- Fond : `Surface / Card` (`Slate 50` / `Slate 800`)
- Border : `1px solid border` (`Slate 200` / `Slate 700`)
- Hover : élévation `shadow-md` + transition `duration-150`
- Border radius : `rounded-xl` (12px)
- Image de couverture : `rounded-xl` en haut, ratio `aspect-[3/4]`

#### `DownloadButton.tsx`

- Si l'utilisateur est **authentifié** : bouton `Primary Blue` "Télécharger"
- Si **non authentifié** : bouton secondaire "Se connecter pour télécharger" → redirige vers `/login`
- Au clic, appelle `GET /books/:id/download` (§5 API.md)
- Affiche un état de chargement pendant le téléchargement

#### `BookForm.tsx` (Admin upload/edit)

- Formulaire `multipart/form-data` avec les champs définis dans `POST /admin/books` (§6 API.md)
- Drag & drop ou clic pour sélectionner le fichier
- Prévisualisation de la couverture
- Validation temps réel (titre min 2 car., fichier PDF/ePub uniquement, taille max affichée)

---

## 7. Service API (couche données)

### Client HTTP (`services/api.ts`)

Un wrapper autour de `fetch` qui centralise :

```typescript
// Responsabilités :
// 1. Préfixe automatique de la base URL (/api/v1)
// 2. Injection du header Authorization: Bearer <token>
// 3. Parsing JSON de la réponse
// 4. Gestion centralisée des erreurs API (format docs/API.md §10)
// 5. Redirection vers /login si 401 reçu

const api = {
  get: <T>(url: string, params?: Record<string, string>) =>
    Promise<ApiResponse<T>>,
  post: <T>(url: string, body: unknown) => Promise<ApiResponse<T>>,
  put: <T>(url: string, body: unknown) => Promise<ApiResponse<T>>,
  delete: <T>(url: string) => Promise<ApiResponse<T>>,
  upload: <T>(url: string, formData: FormData) => Promise<ApiResponse<T>>,
};
```

### Services par domaine

Chaque service mappe **exactement** un groupe d'endpoints de `docs/API.md` :

#### `auth.service.ts` → §3 API.md

```typescript
register(data: RegisterInput): Promise<AuthResponse>   // POST /auth/register
login(data: LoginInput): Promise<AuthResponse>          // POST /auth/login
```

#### `book.service.ts` → §4–§5 API.md

```typescript
getAll(params: BookFilters): Promise<PaginatedResponse<Book>>   // GET /books
getById(id: string): Promise<Book>                              // GET /books/:id
download(id: string): Promise<Blob>                             // GET /books/:id/download
```

#### `admin.service.ts` → §6–§8 API.md

```typescript
createBook(data: FormData): Promise<Book>              // POST   /admin/books
updateBook(id: string, data: FormData): Promise<Book>  // PUT    /admin/books/:id
deleteBook(id: string): Promise<void>                  // DELETE /admin/books/:id
getUsers(params: Pagination): Promise<PaginatedResponse<User>>              // GET /admin/users
getUserDownloads(id: string, params: Pagination): Promise<PaginatedResponse<Download>>  // GET /admin/users/:id/downloads
getDashboardStats(): Promise<DashboardStats>           // GET /admin/dashboard/stats
```

#### `profile.service.ts` → §9 API.md

```typescript
getProfile(): Promise<User>                            // GET /profile
updateProfile(data: ProfileUpdate): Promise<User>      // PUT /profile
updatePassword(data: PasswordUpdate): Promise<void>    // PUT /profile/password
```

---

## 8. Authentification et protection des routes

### Flux d'authentification

```
Utilisateur
     │
     ├── Saisie email/password ──► LoginForm.tsx
     │                                │
     │                   auth.service.login()
     │                                │
     │                   API: POST /auth/login
     │                                │
     │                 ◄── { user, token }
     │                                │
     │              Token stocké dans cookie HttpOnly
     │              User stocké dans AuthContext
     │                                │
     │              Rôle vérifié :
     │              ├── admin → redirect /admin/dashboard
     │              └── user  → redirect /
     │
     └── Requêtes suivantes ──► Authorization: Bearer <token>
```

### Stockage du token

- **Cookie HttpOnly** (recommandé) : sécurisé contre les attaques XSS
- Le token est lu côté serveur dans les Server Components via `cookies()` de Next.js
- Le token est transmis côté client via l'`AuthProvider` pour les mutations

### Protection des routes admin

Le fichier `app/admin/layout.tsx` agit comme **garde de route** :

```typescript
// Pseudo-code du layout admin
export default async function AdminLayout({ children }) {
  const user = await getAuthUser(); // Lit le cookie JWT

  if (!user) redirect('/login');              // Non authentifié → login
  if (user.role !== 'admin') redirect('/');   // Non-admin → accueil

  return (
    <div className="flex">
      <AdminSidebar />
      <main>{children}</main>
    </div>
  );
}
```

> **Conformité WR-01, WR-02, WR-03** (SRS §5) : Les routes `/admin/*` sont protégées côté serveur par le layout.

---

## 9. Gestion d'état

### Stratégie minimaliste

L'application évite les solutions d'état global lourdes (Redux, Zustand). La stratégie repose sur :

| Type d'état               | Solution                                    | Exemple                             |
| ------------------------- | ------------------------------------------- | ----------------------------------- |
| **Données serveur**       | React Server Components (data fetching SSR) | Liste de livres, stats dashboard    |
| **Authentification**      | React Context (`AuthProvider`)              | User courant, rôle, token           |
| **Thème**                 | `next-themes` (`ThemeProvider`)             | Light/Dark mode                     |
| **État de formulaire**    | `useState` local + React Hook Form          | Formulaires login, upload           |
| **Invalidation de cache** | `router.refresh()` après mutation           | Après création/suppression de livre |

---

## 10. Thème et Design System

### Configuration shadcn/ui (`components.json`)

```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "rsc": true,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Variables CSS (`globals.css`)

Conformes à la section 2 de `visual_identity.md` :

```css
@layer base {
  :root {
    /* Mode Clair */
    --background: 0 0% 100%; /* #FFFFFF */
    --foreground: 222 47% 11%; /* #0F172A (Slate 900) */
    --card: 210 40% 98%; /* #F8FAFC (Slate 50) */
    --card-foreground: 222 47% 11%;
    --primary: 217 91% 60%; /* #2563EB (Blue 600) */
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96%; /* #F1F5F9 (Slate 100) */
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%; /* #64748B (Slate 500) */
    --accent: 37 91% 55%; /* #D97706 (Amber 600 — Sahel Gold) */
    --accent-foreground: 0 0% 100%;
    --border: 214 32% 91%; /* #E2E8F0 (Slate 200) */
    --ring: 217 91% 60%; /* #2563EB */
    --radius: 0.5rem; /* 8px (boutons) — cards utilisent 0.75rem */
  }

  .dark {
    /* Mode Sombre */
    --background: 222 47% 11%; /* #0F172A (Slate 900) */
    --foreground: 210 40% 98%; /* #F8FAFC (Slate 50) */
    --card: 217 33% 17%; /* #1E293B (Slate 800) */
    --card-foreground: 210 40% 98%;
    --primary: 217 91% 60%; /* #2563EB */
    --primary-foreground: 0 0% 100%;
    --secondary: 217 19% 27%; /* #334155 (Slate 700) */
    --secondary-foreground: 210 40% 98%;
    --muted: 217 19% 27%;
    --muted-foreground: 215 20% 65%; /* #94A3B8 (Slate 400) */
    --accent: 37 91% 55%; /* #D97706 */
    --accent-foreground: 0 0% 100%;
    --border: 217 19% 27%; /* #334155 (Slate 700) */
    --ring: 217 91% 60%;
  }
}
```

### Configuration Tailwind (`tailwind.config.ts`)

```typescript
// Points clés :
// - Font family : Inter
// - Couleurs : mapping vers les CSS variables ci-dessus
// - Border radius : lg = 0.5rem (8px), xl = 0.75rem (12px)
// - Animations : slide-in-from-bottom, fade-in pour modales
```

---

## 11. Chargement et UX

### Skeleton Screens

Conformément à la section 5 de `visual_identity.md`, l'application utilise des **squelettes de chargement** au lieu de spinners :

- **Catalogue** (`loading.tsx`) : Grille de cartes squelettes reprenant la forme exacte de `BookCard` (rectangle pour l'image, lignes pour le titre et l'auteur)
- **Détail livre** : Squelette du layout complet (image + texte + bouton)
- **Tableau admin** : Lignes de tableau squelettes

### Pagination

Tous les composants de liste implémentent la pagination tels que définie dans `docs/API.md` §1 :

- Paramètres : `page` et `limit` via query parameters dans l'URL
- Navigation : composant `Pagination` de shadcn/ui
- Les changements de page se font via la mise à jour des `searchParams` de l'URL (mode RSC)

### Notifications (Toasts)

- **Succès** : toast vert discret après une action réussie (upload, suppression, modification)
- **Erreur** : toast rouge avec le `message` de l'erreur API (format `docs/API.md` §10)
- Position : `bottom-right`
- Durée : `4 secondes`

---

## 12. SEO et performance

### Métadonnées

Chaque page définit ses métadonnées via l'API `metadata` de Next.js :

```typescript
// app/page.tsx
export const metadata: Metadata = {
  title: "Digital Library BF — Bibliothèque Numérique du Burkina Faso",
  description:
    "Découvrez et téléchargez des livres et documents du Burkina Faso.",
};

// app/book/[id]/page.tsx — métadonnées dynamiques
export async function generateMetadata({ params }): Promise<Metadata> {
  const book = await bookService.getById(params.id);
  return {
    title: `${book.title} — Digital Library BF`,
    description: book.description,
  };
}
```

### Optimisations

| Technique             | Implémentation                                          |
| --------------------- | ------------------------------------------------------- |
| **SSR**               | Pages catalogue et détail rendues côté serveur          |
| **Images optimisées** | `next/image` pour les couvertures de livres             |
| **Code splitting**    | Automatique via App Router (lazy loading par route)     |
| **Fonts**             | `next/font/google` pour charger Inter sans layout shift |

---

## 13. Variables d'environnement

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Optionnel — Analytics, etc.
NEXT_PUBLIC_APP_NAME=Digital Library BF
```

- Les variables préfixées `NEXT_PUBLIC_` sont accessibles côté client
- Le fichier `.env.local` n'est **JAMAIS** commité (conformité X-DATA-02)

---

## 14. Conformité aux contrats

### Conformité API (`docs/API.md`)

| Règle API                        | Implémentation frontend                                              |
| -------------------------------- | -------------------------------------------------------------------- |
| Format de réponse standard       | Types `ApiResponse<T>` et `PaginatedResponse<T>` dans `types/api.ts` |
| Pagination (`page`, `limit`)     | Paramètres dans l'URL, composant `Pagination`                        |
| JWT dans `Authorization: Bearer` | Injecté automatiquement par `services/api.ts`                        |
| Codes d'erreur applicatifs       | Mapping vers des messages utilisateur lisibles dans les toasts       |
| 13 endpoints documentés          | 13 fonctions correspondantes dans les services                       |

### Conformité identité visuelle (`docs/visual_identity.md`)

| Règle design                               | Implémentation frontend                            |
| ------------------------------------------ | -------------------------------------------------- |
| Police **Inter**                           | Chargée via `next/font/google`                     |
| Palette Slate + Blue 600 + Amber 600       | CSS variables dans `globals.css`                   |
| Mode Light/Dark                            | `next-themes` + CSS variables                      |
| Glassmorphism Navbar                       | `bg-white/80 backdrop-blur-md`                     |
| Cards `rounded-xl` + border 1px            | Composant `Card` shadcn configuré                  |
| Boutons `rounded-lg` Primary/Outline/Ghost | Composant `Button` shadcn configuré                |
| Transitions `150ms ease-in-out`            | Tailwind `duration-150 ease-in-out`                |
| Skeleton screens                           | `loading.tsx` + composant `Skeleton`               |
| Lucide Icons exclusivement                 | `lucide-react` installé, aucune autre lib d'icônes |
| Jamais `#000000` ou `#FFFFFF` pur          | Slate 900 / Slate 50 dans les variables            |

---

Digital Library BF — Architecture Frontend — Version 1.0 — Mars 2026
