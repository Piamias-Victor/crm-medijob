# Testing — agent reference

Integration tests use Testcontainers (`**/*.integration.test.ts`) and require **Docker** running locally and in CI.

Default CI command:

```bash
pnpm typecheck && pnpm lint && pnpm lint:lines && pnpm test
```

Without Docker, run unit tests only:

```bash
pnpm exec vitest run --exclude "**/*.integration.test.ts"
```

Full guide: [`docs/testing.md`](../testing.md)
