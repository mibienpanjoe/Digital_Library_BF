# Identité Visuelle — Digital Library BF

### Bibliothèque Numérique du Burkina Faso

**Version 1.0 — Mars 2026**

---

> Ce document définit l'identité visuelle et les lignes directrices UX/UI pour **Digital Library BF**. Inspirée par des plateformes modernes comme **Telegram**, **Notion**, et **Twitter (X)**, cette identité vise à offrir une expérience utilisateur premium, épurée, rapide, et hautement lisible. Ce guide sert de référence stricte pour le développement du frontend web (Next.js + shadcn/ui) et de l'application mobile (Flutter).

---

## 1. Philosophie du Design

L'interface utilisateur de Digital Library BF repose sur **trois piliers fondamentaux** :

1. **Clarté Absolue (Inspiration Notion)** : L'espace blanc n'est pas vide, il structure la pensée. L'interface s'efface au profit du contenu (les livres). Pas de fioritures inutiles, une typographie hiérarchisée et une mise en page d'une lisibilité irréprochable.
2. **Fluidité et Réactivité (Inspiration Telegram)** : Les interactions doivent paraître instantanées. Utilisation stratégique du **glassmorphism** (effet verre dépoli) pour les barres de navigation, et d'animations subtiles et rapides (micro-interactions) lors des clics, des survols, et des transitions d'écrans.
3. **Contraste Précis (Inspiration Twitter/X)** : Des modes clair et sombre maitrisés. Les bordures sont fines (1px) et subtiles, les couleurs d'accentuation sont vibrantes mais utilisées avec parcimonie pour guider l'œil sans le fatiguer.

---

## 2. Palette de Couleurs

La palette utilise peu de couleurs saturées. Elle privilégie des tons neutres sophistiqués avec une couleur d'accentuation forte pour les appels à l'action (CTA).

### Couleurs d'Accentuation (Primary)

L'identité s'éloigne des couleurs ternes. Nous optons pour un **Bleu Indigo Vibrant**, reflétant la technologie et le savoir, avec un **Doré Sahel** en secondaire chaud.

- **Primary Blue** : `#2563EB` (Tailwind Blue 600) — _Utilisé pour les boutons primaires, les liens actifs, et les éléments interactifs majeurs._
- **Primary Hover** : `#1D4ED8` (Tailwind Blue 700) — _État de survol pour les boutons._
- **Sahel Gold** : `#D97706` (Tailwind Amber 600) — _Couleur d'accentuation secondaire (badges, alertes subtiles, icônes premium)._

### Mode Clair (Light Mode)

Inspiré de Notion : blanc pur avec de très légères nuances de gris.

- **Background Base** : `#FFFFFF` (Blanc pur) — _Fond principal de l'application._
- **Surface / Card** : `#F8FAFC` (Slate 50) — _Fond des cartes de livres, menus déroulants._
- **Surface Hover** : `#F1F5F9` (Slate 100) — _Survol sur les cartes ou les lignes de tableaux._
- **Border** : `#E2E8F0` (Slate 200) — _Bordures très fines et discrètes (1px)._
- **Text Primary** : `#0F172A` (Slate 900) — _Titres et texte principal._
- **Text Secondary** : `#64748B` (Slate 500) — _Texte secondaire, métadonnées, dates._

### Mode Sombre (Dark Mode)

Inspiré de Twitter (Dim) et Telegram (Night) : un gris très foncé (presque bleu nuit) pour réduire la fatigue oculaire, avec des surfaces légèrement surélevées.

- **Background Base** : `#0F172A` (Slate 900) — _Fond principal._
- **Surface / Card** : `#1E293B` (Slate 800) — _Fond des cartes de livres, modales._
- **Surface Hover** : `#334155` (Slate 700) — _Survol sur les éléments cliquables._
- **Border** : `#334155` (Slate 700) — _Séparateurs subtils._
- **Text Primary** : `#F8FAFC` (Slate 50) — _Titres et texte principal._
- **Text Secondary** : `#94A3B8` (Slate 400) — _Texte secondaire._

---

## 3. Typographie

La hiérarchie visuelle est dictée par la taille et la graisse du texte, jamais par un excès de couleurs.

- **Font Family (Web & Mobile)** : **Inter** (ou SF Pro Display sur iOS / Roboto sur Android natif via Flutter). C'est une police sans-serif géométrique, avec une excellente lisibilité à petite taille (x-height élevé).

### Hiérarchie Web (Tailwind / shadcn)

- **H1 (Titre page)** : `text-3xl font-extrabold tracking-tight` (ex. "Découvrir")
- **H2 (Section)** : `text-2xl font-bold tracking-tight` (ex. "Nouveautés")
- **H3 (Titre carte livre)** : `text-lg font-semibold leading-none tracking-tight`
- **Body / Paragraphe** : `text-base text-slate-700 (ou slate-300 en sombre) leading-7`
- **Small / Meta** : `text-sm text-slate-500 font-medium` (ex. Auteur, Catégorie)

> **Règle d'or** : Le texte ne doit jamais être affiché en `#000000` pur ou `#FFFFFF` pur. Utilisez toujours des nuances de _Slate_ (Slate 900 / Slate 50) pour adoucir le contraste et donner un aspect premium.

---

## 4. Éléments d'Interface (UI)

### 4.1. Formes et Rayons (Border Radius)

Courbes douces inspirées de l'écosystème iOS / Telegram. Pas de coins parfaitement carrés, ni de boutons en forme de pilule (sauf exceptions).

- **Cards / Modales / Images de couverture** : `borderRadius: 12px` (Tailwind `rounded-xl`).
- **Boutons / Inputs / Badges** : `borderRadius: 8px` (Tailwind `rounded-lg`).

### 4.2. Ombres et Élévation (Shadows)

Les ombres doivent imiter une lumière très douce et globale, pas un spot directionnel dur.

- **Cartes (Défaut)** : Contour fin (border 1px) sans ombre (style Notion/Twitter récent).
- **Cartes (Hover)** : Élévation subtile : `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)` (Tailwind `shadow-md`).
- **Modales / Menus flottants** : Ombre forte mais diffuse : (Tailwind `shadow-xl`).

### 4.3. Glassmorphism (Effet translucide)

Utilisé exclusivement pour les éléments fixes qui flottent au-dessus du contenu :

- **Web (Navigation Bar / Sticky Header)** : Fond translucide avec flou d'arrière-plan.
  - CSS/Tailwind : `bg-white/80 backdrop-blur-md border-b` (en mode sombre : `bg-slate-900/80`).
- **Mobile (AppBar Flutter / BottomNavigationBar)** : Effet standard iOS (`CupertinoNavigationBar`) ou container avec `BackdropFilter` en Flutter.

### 4.4. Boutons

Minimalistes et évidents.

- **Primary** : Fond `Primary Blue`, texte blanc, pas de bordure, radius 8px. Au survol, la couleur s'assombrit légèrement, pas de changement de taille.
- **Secondary / Outline** : Fond transparent, bordure 1px `Slate 200`, texte `Slate 900`. Au survol, fond `Slate 100`.
- **Ghost (Boutons d'icônes ou textes discrets)** : Fond transparent, pas de bordure. Au survol, fond `Slate 100`.

---

## 5. Micro-interactions et Animations

L'interface doit paraître "vivante" mais ne jamais ralentir l'utilisateur.

- **Durée standard** : Les transitions d'état CSS (hover, focus) durent **150ms** (`duration-150 ease-in-out`).
- **Chargement (Squelettes)** : Au lieu des spinners traditionnels, utiliser des **Skeleton screens** (inspirés de Notion/Facebook) pour indiquer qu'un contenu arrive, en reprenant la forme exacte des cartes de livres.
- **Feedback cliquable (Mobile)** :
  - Sur **Android** : Effet d'ondulation (Ripple effect) classique (Material).
  - Sur **iOS** : Réduction subtile de l'opacité au tap (Cupertino).
- **Modales/Dialogues** : Doivent apparaître avec un léger mouvement du bas vers le haut (`slide-in-from-bottom`) combiné à un fade-in, à la manière des Sheets iOS ou de Twitter.

---

## 6. Iconographie

Les icônes doivent être cohérentes, avec un espacement de ligne constant et des courbes douces.

- **Web** : Utilisation exclusive de la bibliothèque **Lucide Icons** (parfaite intégration avec shadcn/ui). Traits de `2px` d'épaisseur par défaut.
- **Mobile (Flutter)** : Utiliser Cupertino Icons pour iOS et Material Symbols (Rounded) pour Android, afin de respecter les conventions des plateformes tout en gardant un aspect moderne.

---

## 7. Mise en œuvre technologique

### 7.1. Côté Web (Next.js)

L'implémentation de ce design sera réalisée en utilisant les outils suivants :

1. **Tailwind CSS** : Pour l'application des couleurs, de la typographie et des espacements via des classes utilitaires.
2. **shadcn/ui** : Comme bibliothèque de composants de base. Ces composants devront être configurés (`components.json` et `tailwind.config.ts`) de base pour utiliser la palette définie ci-dessus (`radius: 0.5rem`, `slate` comme couleur neutre, `blue` comme accent).
3. **Framer Motion** (Optionnel) : Pour les transitions de page ou l'apparition de modales complexes.
4. **CSS Variables** : La gestion du Light/Dark mode se fera en utilisant les variables CSS injectées à la racine pour basculer facilement les thèmes (convention de shadcn/ui).

### 7.2. Côté Mobile (Flutter)

1. **Material 3 / Cupertino** : Flutter sera configuré pour utiliser `ThemeData(useMaterial3: true)`. La `colorScheme` sera générée à partir du `Primary Blue` (`#2563EB`).
2. **Thème Global** : Le fichier `theme.dart` définira explicitement les `TextThemes`, `CardThemes`, et `ButtonThemes` pour correspondre à la hiérarchie visuelle décrite dans la section 3, en utilisant le package `google_fonts` (`GoogleFonts.inter()`).
3. **Adaptive UI** : L'interface devra s'adapter fluidement (animations héroïques lors de l'ouverture d'un livre depuis le catalogue vers la page de détail, similaires à l'animation de l'App Store ou de Telegram).

---

_Digital Library BF — Design Guidelines — Version 1.0 — Mars 2026_
