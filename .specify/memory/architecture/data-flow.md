# Architecture Data Flow

## Inputs

- HTTP JSON payload on `POST /users` (`email`, `password`).
- HTTP path parameter on `GET /users/:id`.
- Environment variables `DATABASE_URL` (required) and optional `PORT`.

## Core Processing Flow

1. `express.json()` parses request bodies and routes are handled by `createUserController`.
2. Controller validates required fields and calls application use-cases.
3. `CreateUserUseCase` checks uniqueness via `UserRepository.findByEmail`, hashes password via `PasswordHasher`, creates a `User`, and saves it.
4. `GetUserByIdUseCase` loads a user via `UserRepository.findById` and throws when absent.
5. `PostgresUserRepository` translates repository calls into SQL queries against `users`.
6. Controller maps results/errors to HTTP responses.

## Outputs

- HTTP JSON responses:
  - `201` created user payload (`id`, `email`) for successful registration.
  - `200` user payload (`id`, `email`) for retrieval by ID.
  - Error payloads with relevant status codes (`400`, `404`, `409`, `500`).
- Side effects: inserts/updates rows in PostgreSQL `users` table.
- Startup log line announcing the listening port.

## Persistence

- PostgreSQL table `users(id UUID PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL)`.
- `save` uses `INSERT ... ON CONFLICT (id) DO UPDATE`.
- Read paths include `findById` and `findByEmail` queries with `LIMIT 1`.

## Failure and Recovery

- Missing `DATABASE_URL` throws during pool creation and prevents startup.
- Input/domain/business failures are translated to client-safe HTTP errors in controller.
- No retry, circuit breaker, or queue-based recovery mechanism is implemented.
