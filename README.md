# User Service (Clean Architecture)

Backend service for user management with strict layer isolation:

- user registration;
- fetching a user by `id`;
- searching by `email` at repository level (already implemented in infrastructure and use-case dependencies).

---

## 1) What Is Implemented

### Functionality

- `POST /users` - register a user.
- `GET /users/:id` - fetch a user by ID.

### Tech Stack

- Node.js + TypeScript;
- Express (HTTP layer);
- PostgreSQL + `pg` (infrastructure persistence);
- `node:test` + in-memory fake repository (unit tests for use-cases without DB).

---

## 2) Project Architecture

The project follows Clean Architecture principles:

```text
src/
  domain/
    entities/
    repositories/

  application/
    services/
    use-cases/

  infrastructure/
    db/
    http/
    repositories/
    security/

  main.ts
```

### Layer Dependencies

- `domain` **depends on nothing**;
- `application` depends **only on domain**;
- `infrastructure` depends on `application` and `domain`;
- `main.ts` is the composition root (dependency wiring).

### DDD-Oriented Domain Modeling

- `User` is treated as an aggregate root.
- `Email` is a value object that normalizes and validates email semantics.
- Typed domain errors are used for business failures (`InvalidEmailError`, `DuplicateEmailError`, `UserNotFoundError`).
- `UserRegistered` domain events are emitted and handled synchronously in-process in this phase.

---

## 3) Layer-by-Layer Explanation

## Domain Layer

Files:

- `src/domain/entities/User.ts`
- `src/domain/repositories/UserRepository.ts`

### `User` entity

Contains:

- `id: string`
- `email: string`
- `passwordHash: string`

Behavior:

- `changeEmail(email)`:
  - validates that email contains `@`;
  - updates `email` if valid;
  - throws `Error("Invalid email")` if invalid.

Important: the entity contains only business rules and knows nothing about HTTP, SQL, or PostgreSQL.

### `UserRepository` interface

Data access contract:

- `save(user): Promise<void>`
- `findById(id): Promise<User | null>`
- `findByEmail(email): Promise<User | null>`

The interface is in `domain` so use-cases depend on abstractions, not infrastructure details.

---

## Application Layer

Files:

- `src/application/use-cases/CreateUserUseCase.ts`
- `src/application/use-cases/GetUserByIdUseCase.ts`
- `src/application/services/PasswordHasher.ts`

### `CreateUserUseCase`

Input:

```ts
{
  email: string;
  password: string;
}
```

Logic:

1. Checks whether a user with the same email exists (`findByEmail`);
2. If found, throws `User with this email already exists`;
3. Hashes password through `PasswordHasher` abstraction;
4. Creates a `User` (with `uuid`);
5. Saves it through `UserRepository`;
6. Returns the created user.

Why this design:

- user creation business logic stays in `application`;
- the use-case does not know where/how user data is stored;
- the use-case does not know the concrete hashing implementation.

### `GetUserByIdUseCase`

Input: `id: string`

Logic:

1. Searches user via `findById`;
2. If not found, throws `User not found`;
3. Returns the user.

---

## Infrastructure Layer

Files:

- `src/infrastructure/repositories/PostgresUserRepository.ts`
- `src/infrastructure/db/PostgresClient.ts`
- `src/infrastructure/db/schema.sql`
- `src/infrastructure/http/UserController.ts`
- `src/infrastructure/security/Sha256PasswordHasher.ts`

### PostgreSQL repository

`PostgresUserRepository` implements `UserRepository` and contains SQL.

Implemented methods:

- `save()`
- `findById()`
- `findByEmail()`

Only this layer knows table structure and SQL queries.

### DB schema

`src/infrastructure/db/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

### HTTP controller

`UserController`:

- validates required request fields;
- calls use-cases;
- maps business errors to HTTP status codes.

Routes:

- `POST /users`
- `GET /users/:id`

### Password hasher

`Sha256PasswordHasher` is the infrastructure implementation of `PasswordHasher`.

Important: use-cases only see the interface and receive concrete implementation via DI.

---

## 4) Composition Root (DI)

File: `src/main.ts`.

It does:

1. Creates PostgreSQL `Pool`;
2. Creates `PostgresUserRepository`;
3. Creates `Sha256PasswordHasher`;
4. Creates use-cases (`CreateUserUseCase`, `GetUserByIdUseCase`);
5. Creates and registers HTTP controller.

This guarantees:

- no `new PostgresUserRepository()` inside use-cases;
- infrastructure can be replaced without rewriting business logic.

---

## 5) How To Run

## Requirements

- Node.js 20+;
- PostgreSQL 14+ (or compatible).

## Install dependencies

```bash
npm install
```

## Prepare database

1. Create a database.
2. Set environment variable:

```bash
export DATABASE_URL="postgres://user:password@localhost:5432/dbname"
```

3. Apply `users` schema from `src/infrastructure/db/schema.sql`.

Example:

```bash
psql "$DATABASE_URL" -f src/infrastructure/db/schema.sql
```

## Run in dev mode

```bash
npm run dev
```

## Build and run in production mode

```bash
npm run build
npm start
```

---

## 6) API: Request/Response Examples

## `POST /users`

Create user.

Request body:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Success `201`:

```json
{
  "id": "7c2f8d4e-5b10-4f1b-a061-56ed9a4a6a37",
  "email": "john@example.com"
}
```

Errors:

- `400` - missing `email` or `password`, or invalid email;
- `409` - user with this email already exists;
- `500` - unexpected error.

## `GET /users/:id`

Fetch user by ID.

Success `200`:

```json
{
  "id": "7c2f8d4e-5b10-4f1b-a061-56ed9a4a6a37",
  "email": "john@example.com"
}
```

Errors:

- `404` - user not found;
- `500` - unexpected error.

---

## 7) Tests

Covered by unit tests:

- `CreateUserUseCase` - successful creation;
- `CreateUserUseCase` - duplicate email error.

Files:

- `tests/application/CreateUserUseCase.spec.ts`
- `tests/fakes/FakeUserRepository.ts`
- `tests/fakes/FakePasswordHasher.ts`

Run:

```bash
npm test
```

Tests do not use DB and do not depend on infrastructure.

---

## 8) Why This Matches Clean Architecture

- business rules (`User`, use-cases) are independent of transport and storage;
- infrastructure implements abstractions defined in higher-level layers;
- SQL exists only in infrastructure;
- use-cases are tested in-memory, without PostgreSQL;
- composition root centralizes dependency creation.

---

## 9) Suggested Next Improvements

- add `FindUserByEmailUseCase` + `GET /users?email=...`;
- add `UserCreated` event publishing and mock subscriber for welcome email;
- replace current hasher with `bcrypt` for stronger production security;
- add integration tests for HTTP + PostgreSQL.
