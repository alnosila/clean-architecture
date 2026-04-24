# Architecture Tech Stack

## Languages and Runtimes

- TypeScript (source) and JavaScript (compiled output under `dist` at runtime).
- Node.js runtime (`node`, `crypto`, `node:test` APIs used).
- SQL for schema definition in `src/infrastructure/db/schema.sql`.
- TODO: Minimum supported Node.js version is documented as `20+` in `README.md` but not enforced in `package.json` engines.

## Frameworks and Libraries

- `express` for HTTP routing and JSON middleware.
- `pg` for PostgreSQL connection pooling and queries.
- `tsx` for TypeScript execution in dev/test scripts.

## Tooling

- TypeScript compiler via `tsc -p tsconfig.build.json` (`npm run build`).
- Dev server/watch mode via `tsx watch src/main.ts` (`npm run dev`).
- Test runner via `tsx --test tests/**/*.spec.ts` (`npm test`), built on `node:test`.
- Type definitions: `@types/express`, `@types/node`, `@types/pg`.
- TODO: No linter/formatter command is defined in `package.json`.

## Infrastructure and Delivery

- Runtime data store: PostgreSQL configured through `DATABASE_URL`.
- Build artifact entrypoint: `dist/main.js` launched by `npm start`.
- TODO: CI/CD pipeline configuration is not present in the repository.

## Notes

- `.specify` and `.cursor` directories indicate local planning/agent workflows but are not runtime dependencies.
