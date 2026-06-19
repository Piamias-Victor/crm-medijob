# Tests — crm-medijob

## Suite unitaire (par défaut)

```bash
pnpm test
pnpm typecheck
pnpm lint
```

## Tests d'intégration (Testcontainers)

Les fichiers `**/*.integration.test.ts` démarrent PostgreSQL via Docker (`@testcontainers/postgresql`).

**Docker requis** — daemon actif avant `pnpm test`.

Sans Docker :

```bash
pnpm exec vitest run --exclude "**/*.integration.test.ts"
```
