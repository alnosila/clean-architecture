# Development Code Style

## Formatting

- TypeScript code uses 2-space indentation, semicolons, and double-quoted imports consistently across `src` and `tests`.
- No formatter configuration (`prettier`, `eslint`, etc.) is present; style consistency is currently convention-based.

## Naming and Structure

- Layered directories are explicit: `domain`, `application`, `infrastructure`.
- Domain interfaces use noun-style contracts (`UserRepository`, `PasswordHasher`) and infrastructure implementations are technology-specific (`PostgresUserRepository`, `Sha256PasswordHasher`).
- Use-cases follow `*UseCase` class naming and expose an `execute(...)` method.
- Test fakes are colocated in `tests/fakes` and mirror production contracts.

## Testing Expectations

- Tests use `node:test` + `node:assert/strict` via `tsx --test`.
- Application layer logic is tested with fake implementations instead of real DB/network dependencies.
- Existing coverage explicitly validates successful user creation and duplicate-email rejection.
- TODO: No documented minimum coverage threshold is defined.

## Review Checklist

- Preserve clean dependency direction: `domain` must not import `application` or `infrastructure`.
- Keep framework/SQL concerns inside `infrastructure`; use abstractions in use-cases.
- Ensure user-facing HTTP responses do not expose `passwordHash`.
- Add or update tests when changing use-case behavior.

## Exceptions

- Duplicate `.js` test/fake files exist alongside `.ts` sources in `tests`; treat `.ts` files as the active source of truth for development.
- TODO: Clarify whether generated `.js` test artifacts should be committed or ignored.
