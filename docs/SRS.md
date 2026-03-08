# Software Requirements Specification (SRS)

### Digital Library BF — Bibliothèque Numérique du Burkina Faso

**Version 1.0 — March 2026**

---

## 1. Introduction

### 1.1 Purpose

This document defines the formal, verifiable, and implementation-independent requirements for the **Digital Library BF** platform. It specifies _what_ the system **MUST** do and **MUST NOT** do, without prescribing _how_ it is implemented.

### 1.2 Scope

Digital Library BF is a digital library platform dedicated to Burkina Faso. The platform enables the management, distribution, and downloading of documentary resources (books, PDF files) through:

- A **web application** (public catalog + administrative dashboard)
- A **mobile application** (catalog browsing and downloading only)
- A **backend REST API** serving both client applications

### 1.3 Definitions, Acronyms, and Abbreviations

| Term      | Definition                                                                     |
| --------- | ------------------------------------------------------------------------------ |
| **User**  | A registered individual who browses, searches, and downloads books             |
| **Admin** | A privileged individual who manages books, views statistics, and manages users |
| **Guest** | An unauthenticated visitor who can view the public catalog                     |
| **Book**  | A digital document resource (PDF or ePub) with associated metadata             |
| **RBAC**  | Role-Based Access Control                                                      |
| **JWT**   | JSON Web Token                                                                 |
| **API**   | Application Programming Interface                                              |
| **SRS**   | Software Requirements Specification                                            |

### 1.4 References

- [Project Overview](./project_overview.md) — Internal technical overview document

---

## 2. Overall Description

### 2.1 Product Perspective

The system is a self-contained platform composed of three subsystems (backend API, web application, mobile application) that share a single database, authentication service, and file storage service. The web and mobile applications are independent clients that communicate exclusively through the backend REST API.

### 2.2 User Classes and Characteristics

| User Class | Description                             | Access Level                                                                      |
| ---------- | --------------------------------------- | --------------------------------------------------------------------------------- |
| **Guest**  | Unauthenticated visitor                 | Can browse and search the public catalog only                                     |
| **User**   | Registered and authenticated individual | Can browse, search, download books, and manage their profile                      |
| **Admin**  | System administrator                    | Full access: book management, user management, statistics, and profile management |

### 2.3 Operating Environment

- The web application SHALL be accessible via modern web browsers (Chrome, Firefox, Safari, Edge).
- The mobile application SHALL run on Android and iOS devices.
- The backend API SHALL be accessible over HTTPS.

### 2.4 Constraints

- The Admin account MUST NOT be created through the public registration form.
- The mobile application MUST NOT include any administrative features.
- Environment variable files (`.env`) MUST NOT be committed to the version control repository.

### 2.5 Assumptions and Dependencies

- Users have access to the internet.
- The backend API is available and reachable from both client applications.
- A persistent database service is available for data storage.
- A file storage service is available for document uploads and downloads.
- An authentication service is available for identity management.

---

## 3. Functional Requirements

### 3.1 Authentication and Authorization

#### FR-AUTH-01: User Registration

The system SHALL allow guests to register by providing a name, email address, and password.

#### FR-AUTH-02: Automatic Role Assignment

Upon successful registration, the system SHALL automatically assign the `user` role to the new account.

#### FR-AUTH-03: Role Field Rejection

The registration process MUST NOT accept a role field from the client. If a role field is submitted, the system SHALL ignore it.

#### FR-AUTH-04: User Login

The system SHALL allow registered users and admins to log in using their email and password through a shared login interface.

#### FR-AUTH-05: Session Management

The system SHALL issue a JWT upon successful authentication and use it to authorize subsequent requests.

#### FR-AUTH-06: Admin Account Provisioning

The admin account SHALL be created exclusively via a seed script executed at deployment time. The system MUST NOT allow admin account creation through the public registration form.

#### FR-AUTH-07: Role-Based Redirection

Upon successful admin login, the system SHALL redirect the authenticated admin to the administrative dashboard.

#### FR-AUTH-08: Role-Based Access Control

The system SHALL enforce RBAC such that:

- Admin-only endpoints and routes are inaccessible to users with the `user` role.
- Admin-only endpoints and routes are inaccessible to unauthenticated guests.

---

### 3.2 Book Catalog (Public)

#### FR-CAT-01: Catalog Browsing

The system SHALL display a catalog of all available books to all visitors (guests, users, and admins).

#### FR-CAT-02: Book Search

The system SHALL allow visitors to search books by keyword.

#### FR-CAT-03: Book Filtering

The system SHALL allow visitors to filter books within the catalog.

#### FR-CAT-04: Book Detail View

The system SHALL provide a detail page for each book, displaying its metadata (e.g., title, author, description, cover image).

#### FR-CAT-05: Download Button

The book detail page SHALL include a download button for authenticated users.

---

### 3.3 Book Download

#### FR-DL-01: Authenticated Download

The system SHALL allow authenticated users to download books.

#### FR-DL-02: Download Tracking

The system SHALL record every book download, capturing at minimum: the user who downloaded, the book downloaded, and the timestamp of the download.

#### FR-DL-03: Guest Download Restriction

The system MUST NOT allow unauthenticated guests to download books.

---

### 3.4 Book Management (Admin)

#### FR-BM-01: Book Upload

The system SHALL allow admins to upload a new book by providing:

- Book metadata (title, author, description, and any other relevant fields)
- A book file (PDF or ePub)

#### FR-BM-02: Book Listing (Admin)

The system SHALL provide admins with a list of all books in the system, with the ability to manage them.

#### FR-BM-03: Book Editing

The system SHALL allow admins to edit the metadata of an existing book.

#### FR-BM-04: Book Deletion

The system SHALL allow admins to delete a book and its associated file from the platform.

#### FR-BM-05: Admin-Only Restriction

Book upload, editing, and deletion MUST NOT be accessible to users with the `user` role or to unauthenticated guests.

---

### 3.5 User Management (Admin)

#### FR-UM-01: User Listing

The system SHALL provide admins with a list of all registered users.

#### FR-UM-02: Download History per User

The system SHALL allow admins to view the download history for any registered user.

---

### 3.6 Dashboard and Statistics (Admin)

#### FR-DASH-01: Admin Dashboard

The system SHALL provide an administrative dashboard displaying aggregate statistics.

#### FR-DASH-02: Statistics Content

The dashboard SHALL display at minimum:

- Total number of books on the platform
- Total number of registered users
- Total number of downloads

---

### 3.7 Profile Management

#### FR-PROF-01: Profile Update (User)

The system SHALL allow authenticated users to update their profile information.

#### FR-PROF-02: Profile Update (Admin)

The system SHALL allow the admin to update their email address and password.

---

### 3.8 API

#### FR-API-01: REST API

The system SHALL expose a REST API through which the web and mobile applications interact with the backend.

#### FR-API-02: API Documentation

The REST API SHALL be documented using the OpenAPI (Swagger) specification.

#### FR-API-03: Shared API

Both the web and mobile applications SHALL communicate with the same backend API.

---

### 3.9 Mobile Application

#### FR-MOB-01: Catalog Browsing

The mobile application SHALL allow users to browse the book catalog.

#### FR-MOB-02: Book Search

The mobile application SHALL allow users to search for books.

#### FR-MOB-03: Book Detail

The mobile application SHALL display a detail page for each book.

#### FR-MOB-04: Book Download

The mobile application SHALL allow authenticated users to download books.

#### FR-MOB-05: No Admin Features

The mobile application MUST NOT include any administrative features (book management, user management, dashboard).

---

## 4. Non-Functional Requirements

### 4.1 Performance

#### NFR-PERF-01: Catalog Load Time

The public book catalog page SHALL load within 3 seconds under normal network conditions.

#### NFR-PERF-02: Search Response Time

Search results SHALL be returned within 2 seconds of query submission.

---

### 4.2 Security

#### NFR-SEC-01: Password Storage

User passwords MUST NOT be stored in plain text. They SHALL be hashed before storage.

#### NFR-SEC-02: HTTPS

All communication between clients and the backend API SHALL occur over HTTPS.

#### NFR-SEC-03: JWT Expiration

JWTs issued by the system SHALL have an expiration time.

#### NFR-SEC-04: Input Validation

All user inputs SHALL be validated and sanitized on the server side to prevent injection attacks.

#### NFR-SEC-05: Environment Secrets

Sensitive configuration values (API keys, database credentials, secrets) MUST NOT be hardcoded in source code. They SHALL be managed through environment variables.

#### NFR-SEC-06: Environment File Exclusion

Environment variable files (`.env`) MUST NOT be committed to the version control repository.

---

### 4.3 Usability

#### NFR-USE-01: Responsive Web Design

The web application SHALL be responsive and usable on desktop and mobile screen sizes.

#### NFR-USE-02: SEO

The public-facing pages of the web application SHALL be rendered in a manner that supports search engine indexing.

---

### 4.4 Reliability

#### NFR-REL-01: Data Integrity

The system SHALL ensure the integrity of stored data (users, books, download records) against corruption.

#### NFR-REL-02: Error Handling

The API SHALL return meaningful and consistent error responses (including appropriate HTTP status codes and error messages) for all failure scenarios.

---

### 4.5 Maintainability

#### NFR-MAIN-01: Monorepo Structure

All source code (backend, frontend, mobile) SHALL reside in a single repository organized into clearly separated directories.

#### NFR-MAIN-02: Code Separation

Each subsystem (backend, frontend, mobile) SHALL be independently buildable and deployable from its respective directory.

---

### 4.6 Deployment

#### NFR-DEP-01: Automated Deployment

The web application and backend API SHALL support automated deployment from the version control repository.

#### NFR-DEP-02: Mobile Non-Deployment

The mobile application is NOT required to be published to any application store. It SHALL be demonstrable on a local device or emulator connected to the deployed backend.

---

## 5. Web Application Route Requirements

The web application SHALL expose the following routes with the specified access controls:

| Route              | Access     | Requirement                                        |
| ------------------ | ---------- | -------------------------------------------------- |
| `/`                | Public     | Display the book catalog with search and filtering |
| `/book/[id]`       | Public     | Display book detail page with a download button    |
| `/login`           | Public     | Login form for users and admins                    |
| `/register`        | Public     | Registration form for users only                   |
| `/admin/dashboard` | Admin only | Display aggregate platform statistics              |
| `/admin/upload`    | Admin only | Form to upload a new book                          |
| `/admin/books`     | Admin only | Book list with edit and delete actions             |
| `/admin/users`     | Admin only | User list and download history                     |

**WR-01**: All `/admin/*` routes SHALL be protected by a role guard that verifies the authenticated user has the `admin` role.

**WR-02**: Unauthenticated users attempting to access `/admin/*` routes SHALL be redirected to the login page.

**WR-03**: Authenticated users with the `user` role attempting to access `/admin/*` routes SHALL be denied access.

---

## 6. Data Requirements

### 6.1 User Data

The system SHALL store for each user at minimum:

- Unique identifier
- Name
- Email address (unique)
- Hashed password
- Role (`user` or `admin`)
- Account creation timestamp

### 6.2 Book Data

The system SHALL store for each book at minimum:

- Unique identifier
- Title
- Author
- Description
- Associated file reference (PDF or ePub)
- Upload timestamp

### 6.3 Download Record Data

The system SHALL store for each download event at minimum:

- Unique identifier
- Reference to the user who performed the download
- Reference to the book that was downloaded
- Download timestamp

---

## 7. Acceptance Criteria Summary

| ID    | Criterion                                                                                 |
| ----- | ----------------------------------------------------------------------------------------- |
| AC-01 | A guest can browse and search the book catalog without logging in                         |
| AC-02 | A guest cannot download a book                                                            |
| AC-03 | A user can register with name, email, and password                                        |
| AC-04 | A newly registered user is automatically assigned the `user` role                         |
| AC-05 | A user can log in and download a book                                                     |
| AC-06 | Every download is recorded in the system                                                  |
| AC-07 | An admin can log in and is redirected to the admin dashboard                              |
| AC-08 | An admin can upload, edit, and delete books                                               |
| AC-09 | An admin can view all users and their download histories                                  |
| AC-10 | The admin dashboard displays book, user, and download statistics                          |
| AC-11 | No user (regardless of role) can be created as admin through the registration form        |
| AC-12 | All admin routes are inaccessible to non-admin users                                      |
| AC-13 | The mobile application provides catalog, search, detail, and download — no admin features |
| AC-14 | The REST API is documented via OpenAPI / Swagger                                          |

---

_Digital Library BF — Software Requirements Specification — Version 1.0 — March 2026_
