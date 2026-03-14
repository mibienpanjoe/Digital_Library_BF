# Digital Library BF — Application Mobile

Application mobile Flutter de la Bibliothèque Numérique du Burkina Faso.

## Stack Technique

- **Framework** : Flutter
- **État (State Management)** : Riverpod
- **Navigation** : GoRouter
- **Client HTTP** : Dio
- **Stockage local** : Flutter Secure Storage
- **Polices** : Google Fonts (Inter / Roboto)
- **UI** : Material Design 3

## Démarrage rapide

```bash
# 1. Installer les dépendances
flutter pub get

# 2. Configurer les assets (si nécessaire)
# Les images doivent être dans assets/images/

# 3. Lancer l'application
flutter run
```

L'application communique avec l'API backend située dans `/backend`.

## Écrans de l'application

| Écran          | Description                                    | État d'implémentation |
| -------------- | ---------------------------------------------- | ---------------------- |
| Splash         | Écran de chargement initial                    | ✅                     |
| Authentification| Connexion et Inscription                       | ✅                     |
| Catalogue      | Liste des livres avec recherche et filtres     | ✅                     |
| Détails Livre  | Informations complètes et bouton téléchargement| ✅                     |
| Téléchargements| Historique des livres téléchargés localement   | ✅                     |
| Profil         | Gestion des informations utilisateur           | ✅                     |

## Scripts utiles

```bash
flutter pub get          # Télécharger les dépendances
flutter clean            # Nettoyer le build
flutter test             # Lancer les tests unitaires
flutter build apk        # Générer l'APK pour Android
```

## Architecture

L'application suit une architecture en couches pour favoriser la maintenabilité :

```
lib/
├── app/             # Configuration globale (thème, routeur)
├── config/          # Constantes et variables d'environnement
├── models/          # Modèles de données (Data classes)
├── providers/       # État applicatif (Riverpod providers)
├── repositories/    # Abstraction de la source de données (API)
├── screens/         # Interfaces utilisateur (écrans)
├── services/        # Services techniques (API, Storage, File)
├── utils/           # Helpers et utilitaires
└── widgets/         # Composants UI réutilisables
```

---

Digital Library BF — Application Mobile — Mars 2026
