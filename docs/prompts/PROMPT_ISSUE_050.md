# Prompt — Issue #50

**Titre** : [FONDATIONS] Bootstrap Next.js + tokens Medijob + atoms UI  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/50  
**Parent** : Epic #19 — PRD CRM MediJob V2  
**Blocked by** : Aucun — peut démarrer immédiatement  
**Débloque** : #51 (design-system), #52 (Prisma)

---

## Skills obligatoires

Exécuter **en tout début de session**, avant toute implémentation :

```
/caveman
```

Lire uniquement les fichiers nécessaires à cette issue — pas le repo entier.

```
/tdd
```

Boucle Red → Green → Refactor : écrire le test qui échoue, implémenter le minimum pour le faire passer, refactoriser.

---

## Setup Git (avant tout travail)

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. S'assurer que `dev` est à jour : `git fetch origin && git checkout dev && git pull origin dev`
3. Créer la branche :

```bash
git checkout -b feat/issue-50-bootstrap-nextjs-tokens-atoms origin/dev
```

4. Créer le worktree (un seul worktree par issue) :

```bash
git worktree add ../crm-medijob-issue-50 -b feat/issue-50-bootstrap-nextjs-tokens-atoms origin/dev
```

5. Travailler **exclusivement** dans `../crm-medijob-issue-50`

---

## Contexte & périmètre

### Vertical slice

Bootstrap **greenfield** du mono-app Next.js 15 (App Router). Aucune donnée métier — rendre l'app exécutable, on-brand Medijob, avec l'ossature architecturale imposée pour toutes les issues suivantes.

Livrer :

- Structure projet `apps/web/src/` selon `SPEC_V2.md` §2
- Tailwind v4 CSS-native (zéro `tailwind.config.ts`) + tokens Medijob (`--color-*` depuis charte §12)
- Police Inter via `next/font/google`
- Atoms UI : Button, Input, Badge, Card, Avatar, Spinner, EmptyState
- Dashboard shell : sidebar 6 sections (Candidats · Pharmacies · Contacts · Missions · Offres · Assistant IA) + Admin (placeholder gated)
- Pages placeholder pour chaque route nav (contenu minimal, titre de section)
- Scaffold tRPC v11 + React Query provider + procédure `health.check` retournant `{ ok: true }`
- Stub Prisma client (pas de schéma métier — issue #52)
- Vitest + ESLint + typecheck + CI baseline (fichiers < 100 lignes)

**Hors périmètre** : auth (#53), schéma Prisma (#52), page `/design-system` complète (#51), données domaine, formulaires métier.

### Critères d'acceptation (issue #50)

- [ ] `pnpm dev` démarre Next.js 15 App Router sans erreur
- [ ] Tailwind v4 + tokens Medijob (`--color-*`) appliqués globalement ; variante dark scaffoldée
- [ ] Dashboard layout avec sidebar nav (6 sections + Admin gated placeholder)
- [ ] Atoms exportés et utilisables : Button, Input, Badge, Card, Avatar, Spinner, EmptyState
- [ ] tRPC + React Query provider câblés ; procédure health check retourne OK
- [ ] Vitest tourne ; ESLint + typecheck passent en CI
- [ ] Tous les nouveaux fichiers < 100 lignes

### User stories couvertes

- **US #3** — design system foundation (tokens + atoms)
- **US #4** — pattern RSC lectures / mutations tRPC (scaffold uniquement)

### ADRs applicables

Aucun ADR domaine directement — issue purement technique. Respecter les conventions `SPEC_V2.md` §2 comme contrat architectural.

### Vocabulaire domaine (`CONTEXT.md`)

Utiliser les libellés nav officiels (pas de synonymes) :

| Section nav | Route placeholder |
|-------------|-------------------|
| Candidats | `/candidats` |
| Pharmacies | `/pharmacies` |
| Contacts | `/contacts` |
| Missions | `/missions` |
| Offres d'emploi | `/offres` |
| Assistant IA | `/assistant` |
| Admin | `/admin/*` |

---

## Fichiers impactés

> Repo greenfield — liste initiale depuis `SPEC_V2.md` §2 + §12. Mettre à jour si la structure évolue en session.

### Racine monorepo

- `package.json` — workspace pnpm, scripts `dev`, `build`, `test`, `lint`, `typecheck`
- `pnpm-workspace.yaml` — workspace `apps/*`
- `turbo.json` (si monorepo turbo) — pipeline build/test
- `.github/workflows/ci.yml` — lint + typecheck + vitest

### App Next.js

- `apps/web/package.json` — dépendances Next 15, tRPC v11, Tailwind v4, lucide-react, framer-motion
- `apps/web/tsconfig.json` — strict mode, zéro `any`
- `apps/web/next.config.ts` — config minimale
- `apps/web/vitest.config.ts` — config tests

### Styles & tokens

- `apps/web/src/app/globals.css` — `@import "tailwindcss"`, `@theme inline` avec palette Medijob (SPEC_V2 §12.904–934)
- `apps/web/src/app/layout.tsx` — Inter font, providers

### Routes & layout

- `apps/web/src/app/(dashboard)/layout.tsx` — shell sidebar + header
- `apps/web/src/app/(dashboard)/page.tsx` — redirect ou dashboard home
- `apps/web/src/app/(dashboard)/candidats/page.tsx` — placeholder
- `apps/web/src/app/(dashboard)/pharmacies/page.tsx` — placeholder
- `apps/web/src/app/(dashboard)/contacts/page.tsx` — placeholder
- `apps/web/src/app/(dashboard)/missions/page.tsx` — placeholder
- `apps/web/src/app/(dashboard)/offres/page.tsx` — placeholder
- `apps/web/src/app/(dashboard)/assistant/page.tsx` — placeholder
- `apps/web/src/app/(dashboard)/admin/pipeline/page.tsx` — placeholder gated

### Composants (atomic design)

- `apps/web/src/components/atoms/Button.tsx`
- `apps/web/src/components/atoms/Input.tsx`
- `apps/web/src/components/atoms/Badge.tsx`
- `apps/web/src/components/atoms/Card.tsx`
- `apps/web/src/components/atoms/Avatar.tsx`
- `apps/web/src/components/atoms/Spinner.tsx`
- `apps/web/src/components/atoms/EmptyState.tsx`
- `apps/web/src/components/atoms/index.ts` — barrel export
- `apps/web/src/components/organisms/AppSidebar.tsx` — nav 6 sections + Admin
- `apps/web/src/components/organisms/DashboardShell.tsx` — layout wrapper

### tRPC

- `apps/web/src/server/routers/health.ts` — `health.check`
- `apps/web/src/server/routers/index.ts` — app router
- `apps/web/src/server/trpc.ts` — init tRPC + context
- `apps/web/src/app/api/trpc/[trpc]/route.ts` — handler HTTP
- `apps/web/src/lib/trpc/client.ts` — client React
- `apps/web/src/lib/trpc/server.ts` — `createCaller` pour RSC
- `apps/web/src/components/providers/TrpcProvider.tsx` — React Query + tRPC

### Stores (UI state)

- `apps/web/src/stores/sidebar-store.ts` — collapsed state Zustand (sidebar uniquement)

### Tests

- `apps/web/src/server/routers/health.test.ts` — health.check retourne ok
- `apps/web/src/components/atoms/Button.test.tsx` — render + variant primary

### Prisma stub

- `apps/web/prisma/schema.prisma` — datasource vide ou generator seul (schéma métier = #52)
- `apps/web/src/server/db/client.ts` — export PrismaClient stub

---

## Contraintes techniques

Rappel non négociable (ne pas dupliquer tout `CLAUDE.md`) :

- **Prisma** uniquement dans `server/db/repositories/` — pas de queries métier ici
- **RSC** pour lectures futures via `createCaller` ; pas de `fetch` interne vers nos routes
- **Mutations** via `trpc.useMutation()` dans Client Components uniquement
- **Fichiers < 100 lignes** — splitter immédiatement si dépassé
- **Zéro `any`** — TypeScript strict
- **Atomic design** : atoms → molecules → organisms ; zéro logique métier dans les composants
- **Zustand** = UI state uniquement (sidebar collapse, modales, thème)
- **Tailwind v4** CSS-native — pas de `tailwind.config.ts`
- **Icons** : `lucide-react` (mapping nav SPEC_V2 §12.939–954)
- **Tokens** : couleurs via `--color-*` uniquement, pas de hex hardcodé dans les composants
- **tRPC v11** : wrappers tRPC uniquement, zéro import direct `@tanstack/react-query` hors provider

### Tokens Medijob (référence)

```css
--color-primary:        oklch(0.26 0.10 255);   /* navy #003366 */
--color-accent:         oklch(0.64 0.10 185);   /* teal #00a89d */
--color-surface:        oklch(0.974 0.005 255);
--color-border:         oklch(0.880 0.010 255);
--color-fg:             oklch(0.13 0.00 0);
--color-fg-muted:       oklch(0.44 0.00 0);
--color-success:        oklch(0.57 0.17 145);
--color-warning:        oklch(0.64 0.16 72);
--color-error:          oklch(0.52 0.22 25);
```

Palette complète : `SPEC_V2.md` §12.904–934.

### Sidebar — icônes Lucide

| Section | Icône |
|---------|-------|
| Candidats | `Users` |
| Pharmacies | `Building2` |
| Contacts | `User` |
| Missions | `Briefcase` |
| Offres | `Megaphone` |
| Assistant IA | `Sparkles` |
| Admin | `Settings` |

---

## Ordre d'implémentation suggéré

1. Scaffold monorepo pnpm + Next.js 15 + TypeScript strict
2. `globals.css` tokens Tailwind v4 + Inter font
3. tRPC health router + tests (TDD)
4. Atoms UI (Button en premier, puis les autres)
5. DashboardShell + AppSidebar + routes placeholder
6. TrpcProvider + layout racine
7. CI workflow (lint, typecheck, vitest)
8. Vérifier tous fichiers < 100 lignes

---

## Fin de session (obligatoire)

1. Vérifier critères d'acceptation + tests manuels ci-dessous
2. Pusher sur la branche de feature :

```bash
git push -u origin feat/issue-50-bootstrap-nextjs-tokens-atoms
```

3. Ouvrir une PR vers `dev` avec body contenant `Closes #50` :

```bash
gh pr create --base dev --title "feat: bootstrap Next.js + tokens Medijob + atoms UI" --body "$(cat <<'EOF'
## Summary

- Bootstrap greenfield Next.js 15 mono-app avec tokens Medijob et atoms UI
- Dashboard shell + sidebar 6 sections + Admin placeholder
- Scaffold tRPC health check + Vitest + CI baseline

## Test plan

- [ ] `pnpm dev` démarre sans erreur
- [ ] Sidebar nav + routes placeholder accessibles
- [ ] Tokens Medijob visibles (teal accent, Inter font)
- [ ] `pnpm test` + lint + typecheck passent

Closes #50
EOF
)"
```

4. Déposer le handoff : `docs/handoffs/HANDOFF_ISSUE_050.md`

Contenu minimal handoff :

- Ce qui a été livré
- Dette technique / points pour #51 et #52
- Tests manuels effectués (résultat)
- Structure fichiers créée (si différente de la liste ci-dessus)

5. **Ne pas merger** — attendre review + CI verte

---

## Tests manuels

- [ ] **Démarrage** : depuis le worktree, `pnpm install` puis `pnpm dev` → serveur démarre sans erreur console
- [ ] **Landing** : ouvrir `http://localhost:3000` → page dashboard ou redirect vers dashboard avec accent teal Medijob (`--color-accent`) et police Inter
- [ ] **Sidebar** : vérifier les 7 entrées visibles (6 sections + Admin) avec icônes Lucide correctes
- [ ] **Navigation** : cliquer Candidats → `/candidats` charge (placeholder OK) ; répéter pour Pharmacies, Contacts, Missions, Offres, Assistant IA
- [ ] **Admin** : cliquer Admin → route `/admin/pipeline` ou équivalent accessible (gate placeholder acceptable — pas d'auth encore)
- [ ] **Responsive** : réduire viewport < 768px → sidebar se replie ou passe en mode mobile (collapse Zustand)
- [ ] **Atoms** : sur une page placeholder, vérifier Button primary (teal), Badge, Card, EmptyState rendus correctement
- [ ] **Health tRPC** : appeler `health.check` (via page debug ou test intégration) → retourne `{ ok: true }`
- [ ] **CI locale** : `pnpm test && pnpm lint && pnpm typecheck` → tout passe

---

## Références

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/50
- Epic : https://github.com/Piamias-Victor/crm-medijob/issues/19
- Spec : `SPEC_V2.md` §2, §12
- PRD : `docs/PRD.md` — Implementation Decisions, US #3–4
- Dépendances : `docs/ISSUE_DEPENDENCIES.md` — V2-01 / #50
- Règles Git : `docs/github-rules.md`
- Workflow agent : `CLAUDE.md`
