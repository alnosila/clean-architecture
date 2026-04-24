# Project Context

## Purpose

- `clean-architecture-user-service` is a Node.js + TypeScript backend for user registration and retrieval by ID.
- It demonstrates strict Clean Architecture boundaries (`domain`, `application`, `infrastructure`, composition in `main.ts`) while providing HTTP endpoints.

## Primary Users

- API consumers calling `POST /users` and `GET /users/:id`.
- Developers using this repository as a Clean Architecture reference implementation in TypeScript.

## Current Scope

- Persist users in PostgreSQL with fields `id`, `email`, `password`.
- Validate email format in the domain entity and reject duplicate emails during user creation.
- Hash passwords through an application abstraction implemented in infrastructure (`Sha256PasswordHasher`).
- Unit-test `CreateUserUseCase` behavior with fake repository/hasher implementations.

## Non-Goals

- No authentication/session/token flows are implemented.
- No user update/delete endpoints are implemented.
- No integration tests or migration tooling are present in the repo.

## Open Questions

- TODO: Confirm intended production-grade password hashing strategy (current implementation uses SHA-256).
- TODO: Confirm deployment target/environment (containerized, VM, serverless, etc.).
