# CLAUDE.md — crm-medijob

## Project

CRM MediJob — a customer relationship management app for the medical staffing industry.

**Stack:** Next.js 15 (App Router) · tRPC v11 · Prisma + Neon · NextAuth v5 · Tailwind v4 · Vercel

**Repo:** [Piamias-Victor/crm-medijob](https://github.com/Piamias-Victor/crm-medijob)

## Agent skills

### Issue tracker

Issues live in GitHub Issues (Piamias-Victor/crm-medijob) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repo — one `CONTEXT.md` at the root + `docs/adr/`. See `docs/agents/domain.md`.

## Architecture & boundaries

- Prisma uniquement dans `src/server/db/repositories/` — jamais dans les routers ni les pages.
- RSC pour toutes les lectures (`createCaller`, jamais `fetch` interne vers nos propres routes).
- Mutations via `trpc.useMutation()` dans les Client Components uniquement.
- Atomic design strict : atoms → molecules → organisms. Zéro logique dans les composants.
- View-models dans `src/view-models/` — seul pont entre schéma DB et UI.
- Zustand = UI state uniquement (sidebar, modales, thème). Jamais de données serveur dedans.

## Code quality (enforced in CI)

- Fichiers strictement < 100 lignes — si dépassé, splitter immédiatement
- Zéro `any` TypeScript — strict mode activé
- React Hook Form + Zod pour tous les formulaires et toutes les entrées externes (y compris réponses IA)
- DRY absolu — si une logique existe à deux endroits, refactoriser immédiatement
- Zéro valeur hardcodée — tokens CSS via `--color-*`, constantes via fichiers dédiés
- Un fichier = une responsabilité

## Workflow agent (obligatoire)

Avant tout travail sur une issue :

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. Créer la branche : `feat/issue-{N}-{slug}` ou `fix/issue-{N}-{slug}`
3. Créer le worktree Git
4. Lancer `/caveman` puis `/tdd`

En fin de session :

1. Pusher sur sa branche
2. Ouvrir une PR vers `dev` avec `Closes #N` dans le body
3. Déposer son `HANDOFF_ISSUE_{N}.md` dans `docs/handoffs/`
