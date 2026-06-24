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

Voir le détail complet : `docs/prompt-rules.md` (5 phases).

Avant tout travail sur une issue :

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. Créer la branche : `feat/issue-{N}-{slug}` ou `fix/issue-{N}-{slug}` (worktree seulement si parallèle)
3. Lancer `/caveman` puis `/tdd`

Quand le code est prêt (phase 3) :

1. Pusher + ouvrir PR vers `dev` (`Closes #N`)
2. **Poster obligatoirement** commande de test + checklist tests manuels dans le chat

Sur `/handoff` (phase 4) :

1. Déposer `docs/handoffs/HANDOFF_ISSUE_{N}.md` dans la PR
2. Cleanup worktree (phase 5) si applicable
