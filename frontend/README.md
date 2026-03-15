# Digital Library BF — Frontend Web

Interface utilisateur de la Bibliothèque Numérique du Burkina Faso.

## Stack Technique

- **Runtime** : Node.js + TypeScript
- **Framework** : Next.js (App Router)
- **Styling** : Tailwind CSS + shadcn/ui
- **Formulaires** : React Hook Form + Zod
- **Appels API** : Fetch API (Client personnalisé)

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install
# ou yarn install, pnpm install

# 2. Configurer les variables d'environnement
cp .env.example .env.local
# → configurer NEXT_PUBLIC_API_URL et NEXT_PUBLIC_APP_NAME

# 3. Lancer en développement
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.

## Configuration environnement

Le fichier `.env.local` comprend les variables suivantes :

| Variable | Description | Par défaut |
| -------- | ----------- | ---------- |
| `NEXT_PUBLIC_API_URL` | URL de base de l'API backend | `http://localhost:3000/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | Nom de l'application | `Digital Library BF` |

## Scripts utiles

```bash
npm run dev      # Serveur de développement
npm run build    # Compilation optimisée
npm run start    # Lancement de la version de production
npm run lint     # Analyse statique du code (ESLint)
```

## Architecture

```
src/
├── app/             # Layouts, pages et logique de routage (Next.js App Router)
├── components/      # Composants UI (shadcn/ui, formulaires, etc.)
├── hooks/           # Hooks React personnalisés
├── lib/             # Fonctions utilitaires et constantes
├── providers/       # Fournisseurs de contexte (Theme, etc.)
├── services/        # Fichiers de service pour les appels API
└── types/           # Interfaces et types TypeScript
```

Voir [`ARCHITECTURE.md`](./ARCHITECTURE.md) pour la documentation complète.