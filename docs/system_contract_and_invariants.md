# System Contract & Invariants

### Digital Library BF — Bibliothèque Numérique du Burkina Faso

**Version 1.0 — March 2026**

---

> This document defines the formal contract between **Digital Library BF** and its environment. It is **implementation-independent** and specifies what the system **promises**, what it **guarantees**, what it **forbids**, and the **invariants** that must always hold.

---

## 1. Definitions

| Term            | Meaning                                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| **System**      | The Digital Library BF platform as a whole (API, web app, mobile app, database, storage, auth)                 |
| **Environment** | All external actors and services interacting with the system: users, admins, browsers, mobile devices, network |
| **Promise**     | A behavior the system commits to providing when preconditions are met                                          |
| **Guarantee**   | A property the system ensures unconditionally, regardless of input or state                                    |
| **Prohibition** | An action the system will never perform, under any circumstances                                               |
| **Invariant**   | A property that must hold true at every observable point in the system's lifecycle                             |

---

## 2. System Promises

Promises are conditional commitments. The system promises a specific outcome **if and only if** the stated precondition is satisfied.

### 2.1 Authentication Promises

| ID            | Precondition                                                      | Promise                                                                                           |
| ------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **P-AUTH-01** | A guest submits a valid registration form (name, email, password) | The system will create an account with the `user` role and return a success response              |
| **P-AUTH-02** | A registered user submits valid login credentials                 | The system will authenticate the user and issue a valid JWT                                       |
| **P-AUTH-03** | A registered admin submits valid login credentials                | The system will authenticate the admin, issue a valid JWT, and direct them to the admin dashboard |
| **P-AUTH-04** | A request carries a valid, non-expired JWT                        | The system will identify the requester and authorize actions according to their role              |
| **P-AUTH-05** | A request carries an expired or invalid JWT                       | The system will reject the request with an authentication error                                   |

### 2.2 Catalog Promises

| ID           | Precondition                                             | Promise                                                |
| ------------ | -------------------------------------------------------- | ------------------------------------------------------ |
| **P-CAT-01** | Any visitor (guest, user, or admin) requests the catalog | The system will return the list of all available books |
| **P-CAT-02** | Any visitor submits a search query                       | The system will return all books matching the query    |
| **P-CAT-03** | Any visitor requests a book's detail page                | The system will return the book's full metadata        |

### 2.3 Download Promises

| ID          | Precondition                                                  | Promise                                                           |
| ----------- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| **P-DL-01** | An authenticated user requests to download a book that exists | The system will serve the book file and record the download event |
| **P-DL-02** | An unauthenticated guest requests to download a book          | The system will deny the request                                  |

### 2.4 Book Management Promises

| ID          | Precondition                                                         | Promise                                                                   |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **P-BM-01** | An authenticated admin submits a valid book upload (metadata + file) | The system will store the book and make it available in the catalog       |
| **P-BM-02** | An authenticated admin requests to edit a book's metadata            | The system will apply the changes and persist them                        |
| **P-BM-03** | An authenticated admin requests to delete a book                     | The system will remove the book and its associated file from the platform |
| **P-BM-04** | A non-admin user attempts a book management operation                | The system will deny the request                                          |

### 2.5 User Management Promises

| ID          | Precondition                                              | Promise                                                            |
| ----------- | --------------------------------------------------------- | ------------------------------------------------------------------ |
| **P-UM-01** | An authenticated admin requests the user list             | The system will return the list of all registered users            |
| **P-UM-02** | An authenticated admin requests a user's download history | The system will return the complete download history for that user |

### 2.6 Profile Promises

| ID            | Precondition                                               | Promise                                       |
| ------------- | ---------------------------------------------------------- | --------------------------------------------- |
| **P-PROF-01** | An authenticated user submits a profile update             | The system will apply and persist the changes |
| **P-PROF-02** | An authenticated admin submits an email or password update | The system will apply and persist the changes |

---

## 3. System Guarantees

Guarantees are **unconditional**. They hold regardless of user input, system state, or failure mode.

### 3.1 Security Guarantees

| ID           | Guarantee                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **G-SEC-01** | Passwords are **never** stored in plain text. Every password is hashed before persistence.                                |
| **G-SEC-02** | All client-server communication occurs over HTTPS. The system never transmits sensitive data over an unencrypted channel. |
| **G-SEC-03** | Every JWT issued by the system has a finite expiration time. No token is valid indefinitely.                              |
| **G-SEC-04** | All user-supplied inputs are validated and sanitized on the server side before processing.                                |
| **G-SEC-05** | Sensitive secrets (API keys, database credentials, signing keys) are never hardcoded in source code.                      |

### 3.2 Data Integrity Guarantees

| ID            | Guarantee                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **G-DATA-01** | Every download event is atomically recorded. A book file is never served without the corresponding download record being persisted.                                |
| **G-DATA-02** | A book deletion removes both its metadata from the database and its associated file from storage. No orphaned files or orphaned records will exist after deletion. |
| **G-DATA-03** | Email addresses are unique across all user accounts. The system never allows duplicate emails.                                                                     |

### 3.3 Authorization Guarantees

| ID             | Guarantee                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **G-AUTHZ-01** | Role verification occurs on the **server side** for every protected request. Client-side guards alone are never considered sufficient. |
| **G-AUTHZ-02** | An unauthenticated request will never succeed against a protected endpoint.                                                            |
| **G-AUTHZ-03** | A request from a `user`-role account will never succeed against an admin-only endpoint.                                                |

### 3.4 API Guarantees

| ID           | Guarantee                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| **G-API-01** | Every API error response includes an appropriate HTTP status code and a meaningful error message.          |
| **G-API-02** | The REST API documentation (OpenAPI/Swagger) is available and reflects the current state of all endpoints. |

---

## 4. System Prohibitions

Prohibitions are **absolute**. The system will **never** perform these actions under any circumstance.

### 4.1 Authentication Prohibitions

| ID            | Prohibition                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **X-AUTH-01** | The system SHALL NEVER create an account with the `admin` role through the public registration form.                                    |
| **X-AUTH-02** | The system SHALL NEVER accept or honor a `role` field submitted through the registration process. Any such field is silently discarded. |
| **X-AUTH-03** | The system SHALL NEVER return a plain-text password in any API response, log, or error message.                                         |

### 4.2 Access Prohibitions

| ID           | Prohibition                                                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **X-ACC-01** | The system SHALL NEVER grant an unauthenticated guest access to download a book.                                                       |
| **X-ACC-02** | The system SHALL NEVER grant a `user`-role account access to any admin endpoint (book management, user management, dashboard).         |
| **X-ACC-03** | The mobile application SHALL NEVER expose admin functionality (book upload, editing, deletion, user management, statistics dashboard). |

### 4.3 Data Prohibitions

| ID            | Prohibition                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| **X-DATA-01** | The system SHALL NEVER serve a book file to an authenticated user without recording the download event.  |
| **X-DATA-02** | The system SHALL NEVER commit environment variable files (`.env`) to the version control repository.     |
| **X-DATA-03** | The system SHALL NEVER store sensitive credentials (API keys, DB passwords, JWT secrets) in source code. |

---

## 5. System Invariants

Invariants are properties that **must hold true at every observable point** in the system's lifecycle — before, during, and after any operation.

### 5.1 Identity Invariants

| ID            | Invariant                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **INV-ID-01** | **Role Completeness**: Every user account in the system has exactly one role: either `user` or `admin`. No account exists without a role. No account holds more than one role. |
| **INV-ID-02** | **Email Uniqueness**: No two accounts in the system share the same email address.                                                                                              |
| **INV-ID-03** | **Password Opacity**: No password exists in the system in a recoverable plain-text form. All stored passwords are one-way hashed.                                              |
| **INV-ID-04** | **Admin Scarcity**: The number of admin accounts is determined solely by the seed script. The set of admin accounts cannot grow through public-facing operations.              |

### 5.2 Data Invariants

| ID              | Invariant                                                                                                                                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **INV-DATA-01** | **Download Traceability**: For every download record in the system, there exists (or existed) a corresponding user and a corresponding book. No download record references a nonexistent entity at time of creation.          |
| **INV-DATA-02** | **Book Completeness**: Every book record in the catalog has both valid metadata and an associated file in storage. No book record exists without a file. No file exists in storage without a book record.                     |
| **INV-DATA-03** | **Catalog Consistency**: The catalog presented to visitors is a faithful representation of all non-deleted book records in the database. No deleted book appears in the catalog. No existing book is hidden from the catalog. |

### 5.3 Authorization Invariants

| ID               | Invariant                                                                                                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **INV-AUTHZ-01** | **Role Enforcement**: At no point can a request bypass role-based access control. Every protected endpoint verifies the requester's role on every invocation.                                                  |
| **INV-AUTHZ-02** | **Token Validity**: No expired or malformed JWT is ever accepted as valid authentication.                                                                                                                      |
| **INV-AUTHZ-03** | **Privilege Isolation**: The set of operations available to the `user` role is a strict subset of the operations available to the `admin` role. Admin-only operations are never accessible to the `user` role. |

### 5.4 System Invariants

| ID             | Invariant                                                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **INV-SYS-01** | **API Parity**: Both the web application and the mobile application communicate through the same API. No client has access to a separate, privileged API surface. |
| **INV-SYS-02** | **Transport Security**: All data in transit between clients and the API is encrypted via HTTPS. No unencrypted channel is ever used.                              |
| **INV-SYS-03** | **Stateless Requests**: Each API request is independently authenticated via its JWT. The server does not rely on session state stored between requests.           |

---

## 6. Contract Verification Matrix

The following matrix maps each contract element to its verification method:

| Category     | ID Range                     | Verification Method                                                 |
| ------------ | ---------------------------- | ------------------------------------------------------------------- |
| Promises     | P-AUTH-01 through P-PROF-02  | Integration tests: given precondition, assert promised outcome      |
| Guarantees   | G-SEC-01 through G-API-02    | Unit tests + security audits + code review                          |
| Prohibitions | X-AUTH-01 through X-DATA-03  | Negative tests: attempt forbidden action, assert rejection          |
| Invariants   | INV-ID-01 through INV-SYS-03 | Database constraints + property-based tests + continuous monitoring |

---

## 7. Contract Boundary

This contract applies **exclusively** to the Digital Library BF system boundary. It does **not** cover:

- Third-party service availability (database hosting, file storage hosting, authentication provider uptime)
- Network reliability between clients and the API
- Client device behavior (browser bugs, mobile OS behavior)
- App store publication or distribution logistics
- Content legality or licensing of uploaded documents

The system assumes these concerns are managed by the environment or by separate operational agreements.

---

_Digital Library BF — System Contract & Invariants — Version 1.0 — March 2026_
