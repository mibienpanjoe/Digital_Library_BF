# Digital Library BF
### Bibliothèque Numérique du Burkina Faso
**Technical Overview — Development Team — March 2026**

---

## 1. Project Description

Digital Library BF is a fullstack digital library platform dedicated to Burkina Faso. It enables the management, distribution, and downloading of documentary resources (books, PDFs) through a web application and a mobile application.

### Functional Objectives

- Administrators can upload and manage books available on the platform.
- Users can register, log in, search, and download books.
- A Role-Based Access Control (RBAC) system secures sensitive actions.
- Every download is tracked for statistics and monitoring purposes.

### Project Constraints

| Criteria | Detail |
|---|---|
| Duration | 10 days of intensive development |
| Type | Fullstack — Web + Mobile + Backend API |
| Backend | Node.js (Express.js)/TypeScript |
| Frontend Web | Next.js/TypeScript + shadcn/ui |
| Mobile | Flutter |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth + JWT |
| Deployment | Required (Web + Backend) |

---

## 2. Tech Stack

The stack was chosen based on one priority criterion: speed of implementation and deployment within the 10-day timeframe.

### Backend — Express.js

Express.js is a lightweight Node.js framework with minimal boilerplate, making it faster to scaffold than NestJS. It handles authentication middleware, book upload endpoints, search, and download tracking. The REST API is documented via Swagger / OpenAPI as required. It is deployed on Railway or Render using the free tier with automatic deployment from GitHub.

### Database, Storage & Auth — Supabase 

Supabase is the central choice that saves the most time. It provides three things in a single managed platform:

- **PostgreSQL** — structured relational database, ideal for tracking downloads, users, and roles.
- **Supabase Storage** — upload and serve PDF/ePub files directly without any S3 configuration.
- **Supabase Auth** — handles JWT sessions and role assignment out of the box.

This eliminates the need to separately configure MongoDB + GridFS for file storage + manual JWT.

### Frontend Web — Next.js + shadcn/ui

Next.js uses file-based routing, allowing the public library and the admin dashboard to coexist in a single application. The admin dashboard lives under `/admin/*` routes, protected by a role guard — no separate admin application needed. Server-Side Rendering (SSR) makes the book catalog fast and SEO-friendly. It is deployed on Vercel with a single click from GitHub.

### Mobile — Flutter

The Flutter app is intended for regular users only — no admin features on mobile. It covers catalog browsing, search, book detail pages, and downloads, all communicating with the same Express API used by the web app.

The app is **not published to the Play Store or App Store** within the scope of this project. It is demonstrated locally on a physical device or emulator connected to the deployed backend and Supabase instance. This avoids spending days on app store logistics.

---

## 3. Authentication Strategy

### Regular Users — Open Registration

Users register freely through a form (name, email, password). Upon account creation, a Supabase database trigger automatically assigns the `user` role. The registration form never accepts a role field — even if someone attempts to send one, it is ignored server-side.

### Admin — Seeded Account

The admin account is not created through the registration form. It is created once via a seed script at deployment time with default credentials. The admin logs in through the same login page as regular users — after login, the application checks the role and redirects to `/admin/dashboard`. The admin can update their email and password later from a settings page.

| | Users | Admin |
|---|---|---|
| Account creation | Self-registration (form) | Seed script at deploy |
| Login page | Shared | Shared |
| Role assigned | `user` (automatic via trigger) | `admin` (manual in DB) |
| Can register via form | ✅ | ❌ |
| Can update profile | ✅ | ✅ |

---

## 4. Web Application Structure

The Next.js application covers both the public portal and the admin dashboard.

| Route | Access | Description |
|---|---|---|
| `/` | Public | Book catalog — search and filtering |
| `/book/[id]` | Public | Book detail page + download button |
| `/login` | Public | Login page (users + admin) |
| `/register` | Public | Registration form (users only) |
| `/admin/dashboard` | Admin | Stats: books, downloads, users |
| `/admin/upload` | Admin | Upload a new book |
| `/admin/books` | Admin | Book list — edit and delete |
| `/admin/users` | Admin | User list and download history |

---

## 5. Repository & Team Organization

### Monorepo — One Single GitHub Repository

All code (backend, frontend, mobile) lives in one GitHub repository organized into folders. This is the right choice for a small team on a tight deadline: one repo to clone, one place to review pull requests, and no overhead from managing multiple repositories.

| Folder | Technology | Ownership |
|---|---|---|
| `backend/` | Express.js + Supabase | Backend dev(s) |
| `frontend/` | Next.js | Web dev(s) |
| `mobile/` | Flutter | Mobile dev(s) |

Each person works within their folder. Environment variable files (`.env`) are never committed to Git and are shared privately within the team.

### Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable, deployed code only — no direct pushes |
| `dev` | Integration branch — everyone merges here first |
| `feature/task-name` | Individual working branch per feature |

The flow is always: `feature/xxx` → `dev` → `main`.

---

## 6. Deployment

| Service | What it hosts | Cost |
|---|---|---|
| Vercel | Next.js web application | Free |
| Railway / Render | Express.js API | Free (free tier) |
| Supabase | Database + Storage + Auth | Free (free tier) |

All three services are free, deploy directly from GitHub, and can be set up in under an hour. Flutter is not deployed — the mobile demo runs on a local device connected to the live backend.

---

*Digital Library BF — Internal team document — March 2026*
