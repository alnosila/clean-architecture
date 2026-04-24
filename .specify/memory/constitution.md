# Clean Architecture User Service Constitution

## Core Principles

### I. Dependency Direction Is Enforced
- `domain` remains framework-agnostic and dependency-free.
- `application` may depend on `domain` contracts only.
- `infrastructure` implements contracts and may depend on lower-level libraries (`express`, `pg`, `crypto`).
- Composition of concrete dependencies happens in `src/main.ts` only.

### II. Business Rules Stay in Use-Cases and Entities
- Entity invariants (e.g., email validity) belong in `domain`.
- Use-cases orchestrate user registration and retrieval logic through interfaces.
- Controllers and repositories must not duplicate or bypass use-case decision logic.

### III. Abstraction-First Integrations
- Application behavior depends on interfaces (`UserRepository`, `PasswordHasher`) rather than concrete implementations.
- Infrastructure implementations must satisfy these contracts without changing use-case signatures.
- External systems (PostgreSQL, HTTP) are replaceable boundaries.

### IV. Tests Protect Application Semantics
- At minimum, use-case behavior changes must include unit tests under `tests/application`.
- Test doubles should implement the same interfaces as production dependencies.
- Regressions in duplicate-email validation or user creation flow are release blockers.

### V. API Contracts Are Stable and Minimal
- `POST /users` and `GET /users/:id` are the current public HTTP contract.
- Responses expose `id` and `email` only; `password`/`passwordHash` must never be returned.
- Known business errors map to deterministic HTTP statuses (`400`, `404`, `409`).

## Operational Constraints

- Service startup requires `DATABASE_URL`; missing value is a hard failure.
- Persistence schema currently centers on a single `users` table with unique email constraint.
- TODO: Define required non-functional targets (availability, latency, throughput).
- TODO: Define approved password hashing policy for production use.

## Delivery and Quality Gates

- Changes must compile with `npm run build`.
- Behavior changes in application logic must pass `npm test`.
- TODO: Define mandatory review/approval policy (number of reviewers, ownership).
- TODO: Define CI enforcement and branch protection rules.

## Governance

- This constitution is the default standard for architecture and delivery decisions in this repository.
- Amendments must update this file and any affected memory artifacts in `.specify/memory/`.
- When code conflicts with this constitution, align code and tests or explicitly record a superseding ADR.

**Version**: 1.0.0 | **Ratified**: 2026-04-23 | **Last Amended**: 2026-04-23
