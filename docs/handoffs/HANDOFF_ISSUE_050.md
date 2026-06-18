# Handoff — Issue #50 (Bootstrap Next.js + tokens Medijob + atoms)

`/caveman` + `/tdd` actifs sur ce projet.

## État

Bootstrap greenfield **terminé et vert**. Branche poussée, PR vers `dev`.

- Branche : `feat/issue-50-bootstrap-nextjs-tokens-atoms`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-50` (deps déjà installées)
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/50
- Prompt source : `docs/prompts/PROMPT_ISSUE_050.md`
- Spec : `SPEC_V2.md` §2 (archi) + §12 (charte/tokens) · glossaire `CONTEXT.md`

## Livré (voir le diff de la PR, pas recopié ici)

- Monorepo pnpm (`apps/web`), Next 15.5.19, React 19, TS strict
- Tailwind v4 CSS-native + tokens `--color-*` (§12), Inter via `next/font`
- Atoms : Button, Input, Badge, Card, Avatar, Spinner, EmptyState
- Organisms : `AppSidebar` (rail icônes, **hover-expand** animé), `DashboardShell` (toggle mobile)
- Molecules : `NavLink`, `SidebarBrand`, `PagePlaceholder`
- Routes `(dashboard)` : candidats, pharmacies, contacts, missions, offres, assistant, admin · `/` → `/candidats`
- tRPC v11 + React Query : `health.check`, provider, route `/api/trpc/[trpc]`, caller RSC
- Prisma stub (generator + datasource seuls) + `server/db/client.ts`
- CI `.github/workflows/ci.yml` : `lint:lines` + `lint` + `typecheck` + `test`

## Décisions / pièges (à connaître pour la suite)

- Stack imposée = Next **15** → pinné `next@15.5.19` (Next 16 dispo mais hors spec).
- `lucide-react` pinné `0.577.0` (API stable, pas la 1.x).
- **pnpm 11.1.2** : approbation des build scripts via `allowBuilds:` dans `pnpm-workspace.yaml` (PAS `onlyBuiltDependencies`), sinon `pnpm install` exit 1 et bloque les scripts.
- `eslint.config.mjs` ignore `next-env.d.ts` (triple-slash généré par Next).
- Sidebar : labels toujours dans le DOM, masqués via `aria-hidden` + `max-width/opacity` (anim smooth). Les tests s'appuient sur `aria-hidden`, pas sur le mount/unmount.

## Vérifs (toutes vertes)

`pnpm dev` · `pnpm build` (11 routes) · `pnpm test` (8) · `pnpm typecheck` · `pnpm lint` · `pnpm lint:lines`

## Suite (hors scope #50)

- #51 page `/design-system` (12 sections §12)
- #52 schéma Prisma métier + migrations + seeds
- #53 auth NextAuth v5

## Suggested skills

- `/caveman` + `/tdd` pour toute issue (cf. `docs/prompt-rules.md`)
- `/handoff` en fin de session sur demande
