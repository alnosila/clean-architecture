# Architecture Overview

## System Shape

- Single deployable HTTP service (Express app) with layered Clean Architecture.
- Composition root in `src/main.ts` wires infrastructure implementations into application use-cases.

## Major Components

- `src/domain`: `User` entity and `UserRepository` contract.
- `src/application`: `CreateUserUseCase`, `GetUserByIdUseCase`, and `PasswordHasher` abstraction.
- `src/infrastructure`: PostgreSQL client/repository, HTTP controller/router, SHA-256 hasher.
- `tests`: unit tests for application layer with in-memory fakes.

## Runtime Boundaries

- `domain` contains business invariants (email validation) and no framework/DB concerns.
- `application` orchestrates use-case logic against interfaces from `domain` and `application/services`.
- `infrastructure` owns framework bindings (Express), SQL persistence (`pg`), and crypto implementation.
- `main.ts` is the only place where concrete classes are instantiated and composed.

## External Integrations

- PostgreSQL through `pg` and `DATABASE_URL`.
- Node runtime crypto module for hashing.

## Key Constraints

- Service fails at startup when `DATABASE_URL` is missing.
- Persistence schema is a single `users` table with unique `email`.
- Route-level error handling maps known domain/application errors to HTTP status codes.
