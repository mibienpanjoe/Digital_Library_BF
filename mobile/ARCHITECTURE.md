# Architecture Mobile — Digital Library BF

### Flutter (Dart)

**Version 1.0 — Mars 2026**

---

> Ce document définit l'architecture détaillée de l'application mobile Flutter de Digital Library BF.
> Il constitue la référence pour le développement et respecte les contrats définis dans :
>
> - [`docs/API.md`](../docs/API.md) — Contrat API (source de vérité des endpoints)
> - [`docs/SRS.md`](../docs/SRS.md) — Exigences fonctionnelles (§3.9 Mobile Application)
> - [`docs/visual_identity.md`](../docs/visual_identity.md) — Identité visuelle et lignes directrices UI/UX

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Périmètre fonctionnel](#2-périmètre-fonctionnel)
3. [Structure des dossiers](#3-structure-des-dossiers)
4. [Architecture en couches](#4-architecture-en-couches)
5. [Navigation et écrans](#5-navigation-et-écrans)
6. [Gestion d'état](#6-gestion-détat)
7. [Couche données (Repositories & Services)](#7-couche-données-repositories--services)
8. [Modèles de données](#8-modèles-de-données)
9. [Authentification](#9-authentification)
10. [Thème et Design System](#10-thème-et-design-system)
11. [Composants UI réutilisables](#11-composants-ui-réutilisables)
12. [Téléchargement de fichiers](#12-téléchargement-de-fichiers)
13. [Gestion des erreurs](#13-gestion-des-erreurs)
14. [Configuration et environnement](#14-configuration-et-environnement)
15. [Conformité aux contrats](#15-conformité-aux-contrats)

---

## 1. Vue d'ensemble

L'application mobile est une application **Flutter** destinée aux **utilisateurs réguliers uniquement**. Elle communique avec la même API REST que le frontend web (INV-SYS-01).

### Principes architecturaux

| Principe                               | Description                                                                         |
| -------------------------------------- | ----------------------------------------------------------------------------------- |
| **Aucune fonctionnalité admin**        | L'application mobile ne contient AUCUN écran d'administration (FR-MOB-05, X-ACC-03) |
| **API.md comme source de vérité**      | Chaque appel réseau correspond exactement à un endpoint documenté                   |
| **visual_identity.md comme référence** | Palette de couleurs, typographie (Inter), et conventions UI respectées              |
| **Séparation des responsabilités**     | Architecture en couches : UI → State → Repository → API                             |
| **Parité API**                         | Utilise exactement la même API que le frontend web (INV-SYS-01)                     |

---

## 2. Périmètre fonctionnel

### Fonctionnalités incluses

| Ref SRS    | Fonctionnalité | Description                                             |
| ---------- | -------------- | ------------------------------------------------------- |
| FR-MOB-01  | Catalogue      | Navigation et affichage de la liste des livres          |
| FR-MOB-02  | Recherche      | Recherche de livres par mot-clé                         |
| FR-MOB-03  | Détail livre   | Affichage des métadonnées complètes d'un livre          |
| FR-MOB-04  | Téléchargement | Téléchargement de livres pour utilisateurs authentifiés |
| FR-AUTH-01 | Inscription    | Formulaire d'inscription (nom, email, mot de passe)     |
| FR-AUTH-04 | Connexion      | Formulaire de connexion                                 |
| FR-PROF-01 | Profil         | Consultation et mise à jour du profil                   |

### Fonctionnalités explicitement exclues (FR-MOB-05)

| Fonctionnalité                  | Statut      |
| ------------------------------- | ----------- |
| Upload de livres                | ❌ INTERDIT |
| Édition / Suppression de livres | ❌ INTERDIT |
| Gestion des utilisateurs        | ❌ INTERDIT |
| Tableau de bord / Statistiques  | ❌ INTERDIT |
| Toute route `/admin/*`          | ❌ INTERDIT |

> **Conformité X-ACC-03** : L'application mobile NE DOIT JAMAIS exposer de fonctionnalité administrative.

---

## 3. Structure des dossiers

```
mobile/
├── lib/
│   ├── main.dart                       # Point d'entrée de l'application
│   │
│   ├── app/
│   │   ├── app.dart                    # MaterialApp, thème, routage
│   │   └── router.dart                 # Configuration GoRouter
│   │
│   ├── config/
│   │   ├── env.dart                    # Variables d'environnement
│   │   ├── theme.dart                  # ThemeData Light / Dark
│   │   ├── colors.dart                 # Palette de couleurs
│   │   └── typography.dart             # Styles de texte (Inter)
│   │
│   ├── models/
│   │   ├── user.dart                   # Modèle User
│   │   ├── book.dart                   # Modèle Book
│   │   ├── download.dart               # Modèle Download
│   │   └── api_response.dart           # Modèles ApiResponse, PaginatedResponse
│   │
│   ├── services/
│   │   ├── api_client.dart             # Client HTTP (Dio) — headers, intercepteurs
│   │   ├── auth_service.dart           # Appels API : register, login
│   │   ├── book_service.dart           # Appels API : getAll, getById, download
│   │   └── profile_service.dart        # Appels API : get/update profil, password
│   │
│   ├── repositories/
│   │   ├── auth_repository.dart        # Logique métier auth + stockage token
│   │   ├── book_repository.dart        # Logique métier livres + cache
│   │   └── profile_repository.dart     # Logique métier profil
│   │
│   ├── providers/
│   │   ├── auth_provider.dart          # État d'authentification (Riverpod/Provider)
│   │   ├── book_provider.dart          # État du catalogue et de la recherche
│   │   └── theme_provider.dart         # État du thème Light/Dark
│   │
│   ├── screens/
│   │   ├── splash/
│   │   │   └── splash_screen.dart      # Écran de démarrage (vérification token)
│   │   ├── auth/
│   │   │   ├── login_screen.dart       # Écran de connexion
│   │   │   └── register_screen.dart    # Écran d'inscription
│   │   ├── catalog/
│   │   │   └── catalog_screen.dart     # Écran catalogue (grille + recherche)
│   │   ├── book/
│   │   │   └── book_detail_screen.dart # Écran détail d'un livre
│   │   ├── profile/
│   │   │   ├── profile_screen.dart     # Écran profil utilisateur
│   │   │   └── edit_profile_screen.dart# Écran modification profil
│   │   └── downloads/
│   │       └── downloads_screen.dart   # Écran livres téléchargés (local)
│   │
│   ├── widgets/
│   │   ├── book_card.dart              # Widget carte de livre
│   │   ├── book_grid.dart              # Grille de cartes (catalogue)
│   │   ├── search_bar.dart             # Barre de recherche
│   │   ├── download_button.dart        # Bouton de téléchargement (conditionnel)
│   │   ├── skeleton_loader.dart        # Widget squelette de chargement
│   │   ├── empty_state.dart            # Widget état vide
│   │   ├── error_state.dart            # Widget état d'erreur
│   │   └── pagination_controls.dart    # Contrôles de pagination
│   │
│   └── utils/
│       ├── constants.dart              # Constantes (URL API, tailles, durées)
│       ├── validators.dart             # Fonctions de validation de formulaire
│       └── file_helper.dart            # Utilitaires pour la gestion de fichiers
│
├── assets/
│   ├── images/                         # Images statiques (logo, illustrations)
│   └── fonts/                          # Police Inter (fallback si Google Fonts indisponible)
│
├── .env.example
├── pubspec.yaml
├── analysis_options.yaml
└── ARCHITECTURE.md                     # Ce fichier
```

---

## 4. Architecture en couches

L'application suit une architecture en **4 couches** avec un flux de données unidirectionnel :

```
┌─────────────────────────────────────────────────┐
│  SCREENS (UI)                                   │
│  Widgets Flutter — affichent les données        │
│  Écoutent les changements d'état via Providers  │
│  Déclenchent des actions utilisateur            │
└─────────────────┬───────────────────────────────┘
                  │ observe / déclenche
                  ▼
┌─────────────────────────────────────────────────┐
│  PROVIDERS (État)                               │
│  Gestion d'état réactive                        │
│  Exposent les données aux Screens               │
│  Appellent les Repositories pour les opérations │
└─────────────────┬───────────────────────────────┘
                  │ appelle
                  ▼
┌─────────────────────────────────────────────────┐
│  REPOSITORIES (Logique métier)                  │
│  Coordonnent les sources de données             │
│  Gèrent le cache, le stockage local du token    │
│  Transforment les données brutes en modèles     │
└─────────────────┬───────────────────────────────┘
                  │ appelle
                  ▼
┌─────────────────────────────────────────────────┐
│  SERVICES (Réseau)                              │
│  Appels HTTP via Dio                            │
│  Sérialisation / désérialisation JSON           │
│  Aucune logique métier                          │
└─────────────────────────────────────────────────┘
                  │
                  ▼
           Backend API REST
         (docs/API.md §1–§9)
```

### Responsabilités par couche

| Couche           | Responsabilité                                    | Ne fait PAS                     |
| ---------------- | ------------------------------------------------- | ------------------------------- |
| **Screens**      | Rendu UI, réception des actions utilisateur       | Appels réseau, logique métier   |
| **Providers**    | État réactif, notification des changements        | Appels HTTP directs, rendu UI   |
| **Repositories** | Cache, stockage local, orchestration des services | Rendu UI, gestion d'état global |
| **Services**     | Appels HTTP bruts, parsing JSON                   | Logique métier, cache, stockage |

---

## 5. Navigation et écrans

### Configuration de la navigation (GoRouter)

```dart
// app/router.dart — Routes de l'application
// Pas de routes admin (FR-MOB-05)

final router = GoRouter(
  initialLocation: '/splash',
  redirect: _guardRedirect,     // Logique de protection des routes
  routes: [
    GoRoute(path: '/splash',    builder: (_, __) => const SplashScreen()),
    GoRoute(path: '/login',     builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/register',  builder: (_, __) => const RegisterScreen()),

    // Routes avec BottomNavigationBar (Shell Route)
    ShellRoute(
      builder: (_, __, child) => MainShell(child: child),
      routes: [
        GoRoute(path: '/',          builder: (_, __) => const CatalogScreen()),
        GoRoute(path: '/book/:id',  builder: (_, state) => BookDetailScreen(id: state.pathParameters['id']!)),
        GoRoute(path: '/downloads', builder: (_, __) => const DownloadsScreen()),
        GoRoute(path: '/profile',   builder: (_, __) => const ProfileScreen()),
      ],
    ),
  ],
);
```

### Table des écrans

| Écran           | Route           | Accès     | Données (API)            | Ref SRS    |
| --------------- | --------------- | --------- | ------------------------ | ---------- |
| Splash          | `/splash`       | Tous      | Vérification token local | —          |
| Connexion       | `/login`        | 🌐 Public | `POST /auth/login`       | FR-AUTH-04 |
| Inscription     | `/register`     | 🌐 Public | `POST /auth/register`    | FR-AUTH-01 |
| Catalogue       | `/`             | 🌐 Public | `GET /books`             | FR-MOB-01  |
| Détail livre    | `/book/:id`     | 🌐 Public | `GET /books/:id`         | FR-MOB-03  |
| Téléchargements | `/downloads`    | 🔒 Auth   | Fichiers locaux          | FR-MOB-04  |
| Profil          | `/profile`      | 🔒 Auth   | `GET /profile`           | FR-PROF-01 |
| Modifier profil | `/profile/edit` | 🔒 Auth   | `PUT /profile`           | FR-PROF-01 |

### Shell principal (BottomNavigationBar)

```
┌─────────────────────────────────┐
│                                 │
│       Contenu de l'écran        │
│            courant              │
│                                 │
│                                 │
├─────────────────────────────────┤
│  📚 Catalogue  │ 📥 Mes livres │ 👤 Profil  │
└─────────────────────────────────┘
```

- **3 onglets** : Catalogue, Mes Livres (téléchargements locaux), Profil
- La BottomNavigationBar applique le glassmorphism sur iOS (visual_identity.md §4.3)
- Icônes : Material Symbols (Rounded) sur Android, Cupertino Icons sur iOS

---

## 6. Gestion d'état

### Solution : Riverpod (recommandé) ou Provider

La gestion d'état repose sur **Riverpod** pour sa concision et son support natif des états asynchrones :

| Provider                   | Type                                              | Responsabilité                                    |
| -------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `authProvider`             | `StateNotifierProvider<AuthNotifier, AuthState>`  | User courant, token, état de connexion            |
| `booksProvider`            | `FutureProvider.family`                           | Liste de livres paginée (paramètres de recherche) |
| `bookDetailProvider`       | `FutureProvider.family<Book, String>`             | Détails d'un livre par ID                         |
| `profileProvider`          | `StateNotifierProvider`                           | Données du profil utilisateur                     |
| `themeProvider`            | `StateNotifierProvider<ThemeNotifier, ThemeMode>` | Mode clair / sombre                               |
| `downloadProgressProvider` | `StateProvider<Map<String, double>>`              | Progression des téléchargements en cours          |

### États d'authentification

```dart
sealed class AuthState {}
class AuthInitial extends AuthState {}       // Vérification en cours (splash)
class AuthAuthenticated extends AuthState {  // Utilisateur connecté
  final User user;
  final String token;
}
class AuthUnauthenticated extends AuthState {} // Non connecté
class AuthError extends AuthState {           // Erreur d'authentification
  final String message;
}
```

---

## 7. Couche données (Repositories & Services)

### Client HTTP (`services/api_client.dart`)

Le client HTTP utilise **Dio** et centralise :

```dart
class ApiClient {
  late final Dio _dio;

  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: Env.apiBaseUrl,          // Depuis la config
      headers: {'Content-Type': 'application/json'},
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ));

    _dio.interceptors.addAll([
      AuthInterceptor(),                // Injecte le Bearer token
      ErrorInterceptor(),               // Transforme les erreurs API
      LogInterceptor(),                 // Logs en mode debug
    ]);
  }
}
```

**`AuthInterceptor`** :

- Lit le JWT depuis le stockage sécurisé (`flutter_secure_storage`)
- Injecte `Authorization: Bearer <token>` sur chaque requête
- Si le serveur renvoie `401 UNAUTHORIZED`, déconnecte l'utilisateur et redirige vers `/login`

### Services API

Chaque service mappe exactement un groupe d'endpoints de `docs/API.md` :

#### `auth_service.dart` → §3 API.md

```dart
Future<AuthResponse> register(RegisterInput data);   // POST /auth/register
Future<AuthResponse> login(LoginInput data);          // POST /auth/login
```

#### `book_service.dart` → §4–§5 API.md

```dart
Future<PaginatedResponse<Book>> getAll(BookFilters filters);  // GET /books
Future<Book> getById(String id);                              // GET /books/:id
Future<void> download(String id, String savePath,             // GET /books/:id/download
    {Function(int, int)? onProgress});
```

#### `profile_service.dart` → §9 API.md

```dart
Future<User> getProfile();                                    // GET /profile
Future<User> updateProfile(ProfileUpdateInput data);          // PUT /profile
Future<void> updatePassword(PasswordUpdateInput data);        // PUT /profile/password
```

### Repositories

Les repositories ajoutent la **logique métier** au-dessus des services :

#### `auth_repository.dart`

```dart
// - Appelle AuthService pour l'inscription/connexion
// - Stocke le JWT dans flutter_secure_storage
// - Met à jour l'AuthProvider
// - Supprime le token lors de la déconnexion
```

#### `book_repository.dart`

```dart
// - Appelle BookService pour les requêtes réseau
// - Gère le téléchargement vers le stockage local de l'appareil
// - Suit la progression du téléchargement
// - Maintient une liste des livres téléchargés localement
```

---

## 8. Modèles de données

Les modèles sont conformes à la section 11 de `docs/API.md` :

```dart
// models/user.dart
class User {
  final String id;
  final String name;
  final String email;
  final String role;        // Toujours 'user' sur mobile
  final DateTime createdAt;

  factory User.fromJson(Map<String, dynamic> json);
  Map<String, dynamic> toJson();
}
```

```dart
// models/book.dart
class Book {
  final String id;
  final String title;
  final String author;
  final String description;
  final String? coverUrl;
  final String fileFormat;   // 'pdf' | 'epub'
  final int fileSize;
  final String? category;
  final int downloadCount;
  final DateTime createdAt;
  final DateTime updatedAt;

  factory Book.fromJson(Map<String, dynamic> json);
}
```

```dart
// models/api_response.dart
class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? message;
  final ApiError? error;

  factory ApiResponse.fromJson(Map<String, dynamic> json, T Function(dynamic) fromData);
}

class PaginatedResponse<T> {
  final List<T> data;
  final Pagination pagination;
}

class Pagination {
  final int page;
  final int limit;
  final int total;
  final int totalPages;
}
```

---

## 9. Authentification

### Flux d'authentification

```
Démarrage de l'app
     │
     ▼
SplashScreen
     │
     ├── Token trouvé dans SecureStorage ?
     │   ├── Oui → Valider le token (GET /profile)
     │   │         ├── Valide → CatalogScreen
     │   │         └── Expiré/Invalide → LoginScreen
     │   └── Non → CatalogScreen (mode guest)
     │
LoginScreen / RegisterScreen
     │
     ├── Saisie credentials ──► AuthService
     │                             │
     │                  POST /auth/login ou /register
     │                             │
     │                  ◄── { user, token }
     │                             │
     │           Token → flutter_secure_storage
     │           User  → AuthProvider
     │                             │
     │           Redirect → CatalogScreen
```

### Stockage sécurisé

- **Package** : `flutter_secure_storage`
- Le JWT est stocké dans le Keychain (iOS) / EncryptedSharedPreferences (Android)
- Le token n'est **jamais** stocké en clair dans SharedPreferences ou dans le code

### Comportement conditionnel par état d'auth

| État                     | Catalogue     | Détail livre  | Téléchargement           | Profil                   |
| ------------------------ | ------------- | ------------- | ------------------------ | ------------------------ |
| **Guest** (non connecté) | ✅ Accessible | ✅ Accessible | ❌ → Redirige vers login | ❌ → Redirige vers login |
| **User** (connecté)      | ✅ Accessible | ✅ Accessible | ✅ Accessible            | ✅ Accessible            |

---

## 10. Thème et Design System

### Configuration du thème (`config/theme.dart`)

Conforme à `visual_identity.md` sections 2, 3, et 4 :

```dart
class AppTheme {
  // --- Mode Clair ---
  static ThemeData light = ThemeData(
    useMaterial3: true,
    fontFamily: GoogleFonts.inter().fontFamily,
    colorScheme: const ColorScheme.light(
      primary: Color(0xFF2563EB),       // Primary Blue
      onPrimary: Colors.white,
      secondary: Color(0xFFD97706),     // Sahel Gold
      surface: Color(0xFFF8FAFC),       // Slate 50
      onSurface: Color(0xFF0F172A),     // Slate 900
      outline: Color(0xFFE2E8F0),       // Slate 200
    ),
    scaffoldBackgroundColor: Colors.white,
    // ...
  );

  // --- Mode Sombre ---
  static ThemeData dark = ThemeData(
    useMaterial3: true,
    fontFamily: GoogleFonts.inter().fontFamily,
    colorScheme: const ColorScheme.dark(
      primary: Color(0xFF2563EB),       // Primary Blue
      onPrimary: Colors.white,
      secondary: Color(0xFFD97706),     // Sahel Gold
      surface: Color(0xFF1E293B),       // Slate 800
      onSurface: Color(0xFFF8FAFC),     // Slate 50
      outline: Color(0xFF334155),       // Slate 700
    ),
    scaffoldBackgroundColor: const Color(0xFF0F172A), // Slate 900
    // ...
  );
}
```

### Palette (`config/colors.dart`)

```dart
class AppColors {
  // Accentuation
  static const primaryBlue   = Color(0xFF2563EB);
  static const primaryHover  = Color(0xFF1D4ED8);
  static const sahelGold     = Color(0xFFD97706);

  // Light Mode
  static const lightBg         = Color(0xFFFFFFFF);
  static const lightSurface    = Color(0xFFF8FAFC);  // Slate 50
  static const lightSurfaceHov = Color(0xFFF1F5F9);  // Slate 100
  static const lightBorder     = Color(0xFFE2E8F0);  // Slate 200
  static const lightTextPri    = Color(0xFF0F172A);   // Slate 900
  static const lightTextSec    = Color(0xFF64748B);   // Slate 500

  // Dark Mode
  static const darkBg          = Color(0xFF0F172A);   // Slate 900
  static const darkSurface     = Color(0xFF1E293B);   // Slate 800
  static const darkSurfaceHov  = Color(0xFF334155);   // Slate 700
  static const darkBorder      = Color(0xFF334155);   // Slate 700
  static const darkTextPri     = Color(0xFFF8FAFC);   // Slate 50
  static const darkTextSec     = Color(0xFF94A3B8);   // Slate 400
}
```

### Typographie (`config/typography.dart`)

```dart
class AppTypography {
  static TextStyle h1 = GoogleFonts.inter(fontSize: 30, fontWeight: FontWeight.w800, letterSpacing: -0.5);
  static TextStyle h2 = GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.w700, letterSpacing: -0.5);
  static TextStyle h3 = GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600, height: 1.0);
  static TextStyle body = GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w400, height: 1.75);
  static TextStyle small = GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500);
}
```

### Formes et rayons

```dart
// Cards / Modales / Images de couverture : 12px
// Boutons / Inputs / Badges : 8px
class AppShapes {
  static const cardRadius = BorderRadius.all(Radius.circular(12));
  static const buttonRadius = BorderRadius.all(Radius.circular(8));
}
```

---

## 11. Composants UI réutilisables

### `BookCard` — Carte de livre

```
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │   Couverture      │  │  ← ClipRRect(borderRadius: 12)
│  │   (CachedNetwork) │  │  ← aspect ratio 3:4
│  └───────────────────┘  │
│                         │
│  Titre du Livre         │  ← AppTypography.h3
│  Auteur                 │  ← AppTypography.small, Slate 500/400
│                         │
│  ┌─────┐ ┌──────────┐  │
│  │ PDF │ │ Histoire │  │  ← Badges : format + catégorie
│  └─────┘ └──────────┘  │
└─────────────────────────┘
```

- Fond : `AppColors.lightSurface` / `darkSurface`
- Bordure : `1px solid AppColors.lightBorder` / `darkBorder`
- Radius : `12px` (AppShapes.cardRadius)
- Images : `cached_network_image` avec placeholder squelette
- Tap → navigation vers `BookDetailScreen` avec animation **Hero**

### `DownloadButton` — Bouton de téléchargement

- Si **authentifié** : bouton `Primary Blue` avec icône de téléchargement
- Si **non authentifié** : bouton outline "Se connecter" → navigation vers `/login`
- Pendant le téléchargement : `CircularProgressIndicator` avec pourcentage
- Après téléchargement : bouton "Ouvrir" avec icône de lecture

### `SkeletonLoader` — Squelettes de chargement

Conformément à `visual_identity.md` §5, utilisation de squelettes au lieu de spinners :

- Le squelette reproduit la forme exacte de `BookCard`
- Animation de pulsation (shimmer effect) via le package `shimmer`

---

## 12. Téléchargement de fichiers

### Flux de téléchargement

```
BookDetailScreen
     │
     ├── User tape "Télécharger"
     │
     ├── Vérifier authentification
     │   └── Non connecté → Redirect /login
     │
     ├── BookRepository.download(bookId)
     │   │
     │   ├── BookService.download(id, savePath, onProgress)
     │   │   └── GET /books/:id/download (§5 API.md)
     │   │       └── Stream binaire → fichier local
     │   │
     │   ├── Progression mise à jour via downloadProgressProvider
     │   │
     │   └── Fichier sauvegardé dans le répertoire Documents de l'app
     │
     └── Notification de succès + possibilité d'ouvrir le fichier
```

### Stockage local

- **Répertoire** : `getApplicationDocumentsDirectory()` (package `path_provider`)
- **Nommage** : `{bookId}_{title}.{format}` (ex : `uuid_histoire-bf.pdf`)
- L'écran "Mes Livres" affiche les fichiers téléchargés localement
- Possibilité de supprimer un fichier téléchargé (suppression locale uniquement)

### Packages utilisés

| Package              | Usage                                                       |
| -------------------- | ----------------------------------------------------------- |
| `dio`                | Téléchargement avec suivi de progression                    |
| `path_provider`      | Accès au répertoire local                                   |
| `open_filex`         | Ouverture du fichier avec l'app système (lecteur PDF, etc.) |
| `permission_handler` | Demande de permissions de stockage (Android)                |

---

## 13. Gestion des erreurs

### Structure des erreurs

```dart
class AppException implements Exception {
  final String code;       // Code d'erreur API (ex : BOOK_NOT_FOUND)
  final String message;    // Message lisible
  final int? statusCode;   // Code HTTP

  factory AppException.fromApiResponse(Map<String, dynamic> json);
}
```

### Stratégie par couche

| Couche           | Comportement                                                     |
| ---------------- | ---------------------------------------------------------------- |
| **Services**     | Capturent les `DioException`, les transforment en `AppException` |
| **Repositories** | Propagent les `AppException` vers les Providers                  |
| **Providers**    | Mettent à jour l'état (état erreur) → UI réagit                  |
| **Screens**      | Affichent un `ErrorState` widget ou un SnackBar selon la gravité |

### Correspondance avec les codes d'erreur API (`docs/API.md` §10)

| Code API                   | Comportement mobile                                       |
| -------------------------- | --------------------------------------------------------- |
| `UNAUTHORIZED`             | Déconnexion automatique, redirection vers `/login`        |
| `INVALID_CREDENTIALS`      | SnackBar "Email ou mot de passe incorrect"                |
| `VALIDATION_ERROR`         | Affichage sous les champs de formulaire concernés         |
| `BOOK_NOT_FOUND`           | Écran d'état vide "Livre introuvable"                     |
| `EMAIL_ALREADY_EXISTS`     | SnackBar "Cette adresse email est déjà utilisée"          |
| `INVALID_CURRENT_PASSWORD` | SnackBar "Mot de passe actuel incorrect"                  |
| Erreur réseau              | Écran "Pas de connexion internet" avec bouton "Réessayer" |

---

## 14. Configuration et environnement

### Variables d'environnement (`config/env.dart`)

```dart
class Env {
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3000/api/v1', // Émulateur Android → localhost
  );
}
```

- Valeur injectée au build : `flutter run --dart-define=API_BASE_URL=https://api.example.com/api/v1`
- Aucun secret n'est stocké dans le code source (conformité G-SEC-05)

### Packages principaux (`pubspec.yaml`)

| Package                  | Version | Usage                             |
| ------------------------ | ------- | --------------------------------- |
| `dio`                    | ^5.x    | Client HTTP                       |
| `flutter_riverpod`       | ^2.x    | Gestion d'état                    |
| `go_router`              | ^14.x   | Navigation déclarative            |
| `flutter_secure_storage` | ^9.x    | Stockage sécurisé du JWT          |
| `google_fonts`           | ^6.x    | Police Inter                      |
| `cached_network_image`   | ^3.x    | Cache des images de couverture    |
| `shimmer`                | ^3.x    | Animation squelette de chargement |
| `path_provider`          | ^2.x    | Répertoires locaux                |
| `open_filex`             | ^4.x    | Ouvrir les fichiers téléchargés   |
| `permission_handler`     | ^11.x   | Permissions de stockage           |

---

## 15. Conformité aux contrats

### Conformité SRS (`docs/SRS.md` §3.9)

| Exigence                    | ID        | Implémentation mobile                                       |
| --------------------------- | --------- | ----------------------------------------------------------- |
| Catalogue                   | FR-MOB-01 | `CatalogScreen` + `BookGrid` + `GET /books`                 |
| Recherche                   | FR-MOB-02 | `SearchBar` widget + query param `search` dans `GET /books` |
| Détail livre                | FR-MOB-03 | `BookDetailScreen` + `GET /books/:id`                       |
| Téléchargement              | FR-MOB-04 | `DownloadButton` + `GET /books/:id/download`                |
| Aucune fonctionnalité admin | FR-MOB-05 | Aucun écran admin, aucune route admin, aucun service admin  |

### Conformité API (`docs/API.md`)

| Endpoint utilisé          | Section API.md | Service mobile         |
| ------------------------- | -------------- | ---------------------- |
| `POST /auth/register`     | §3             | `auth_service.dart`    |
| `POST /auth/login`        | §3             | `auth_service.dart`    |
| `GET /books`              | §4             | `book_service.dart`    |
| `GET /books/:id`          | §4             | `book_service.dart`    |
| `GET /books/:id/download` | §5             | `book_service.dart`    |
| `GET /profile`            | §9             | `profile_service.dart` |
| `PUT /profile`            | §9             | `profile_service.dart` |
| `PUT /profile/password`   | §9             | `profile_service.dart` |

> **Endpoints admin NON utilisés** : `POST /admin/books`, `PUT /admin/books/:id`, `DELETE /admin/books/:id`, `GET /admin/users`, `GET /admin/users/:id/downloads`, `GET /admin/dashboard/stats` — conformément à FR-MOB-05 et X-ACC-03.

### Conformité identité visuelle (`docs/visual_identity.md`)

| Règle design                               | Implémentation mobile                                         |
| ------------------------------------------ | ------------------------------------------------------------- |
| Police **Inter**                           | `google_fonts` → `GoogleFonts.inter()`                        |
| Palette Slate + Blue 600 + Amber 600       | `AppColors` dans `config/colors.dart`                         |
| Mode Light / Dark                          | `ThemeData.light` / `ThemeData.dark` dans `config/theme.dart` |
| Glassmorphism BottomNav (iOS)              | `BackdropFilter` ou `CupertinoTabBar`                         |
| Cards `borderRadius: 12px`                 | `AppShapes.cardRadius`                                        |
| Boutons `borderRadius: 8px`                | `AppShapes.buttonRadius`                                      |
| Skeleton screens                           | `shimmer` package, forme identique à `BookCard`               |
| Animations de transition                   | Hero animation catalogue → détail                             |
| Material Symbols Rounded + Cupertino Icons | Icônes adaptatives par plateforme                             |
| Jamais `#000000` ou `#FFFFFF` pur          | Slate 900 / Slate 50 dans `AppColors`                         |

---

Digital Library BF — Architecture Mobile — Version 1.0 — Mars 2026
