# Prompt — Issue #50

**Titre** : [FONDATIONS] Bootstrap Next.js + tokens Medijob + atoms UI  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/50  
**Parent** : #19  
**Blocked by** : aucun · **Débloque** : #51, #52

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `SPEC_V2.md` §2 + §12, issue #50. Pas le repo entier.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. Créer le worktree (travailler **exclusivement** dedans) :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-50 -b feat/issue-50-bootstrap-nextjs-tokens-atoms origin/dev
cd ../crm-medijob-issue-50
```

---

## Périmètre

Bootstrap **greenfield** : app Next.js 15 exécutable, tokens Medijob, atoms UI, shell dashboard, scaffold tRPC + CI. **Pas** de schéma métier (#52), auth (#53), ni `/design-system` complet (#51).

**Livrer** : structure `apps/web/src/` (SPEC_V2 §2), Tailwind v4 + tokens §12, Inter, atoms (Button, Input, Badge, Card, Avatar, Spinner, EmptyState), sidebar 6 sections + Admin placeholder, routes placeholder, `health.check` tRPC, stub Prisma, Vitest + lint + typecheck CI.

**US** : #3 (tokens/atoms), #4 (scaffold RSC/tRPC).

**ADRs** : aucun (issue technique). Vocabulaire nav : Candidats, Pharmacies, Contacts, Missions, Offres, Assistant IA, Admin — voir `CONTEXT.md`.

### Critères d'acceptation

- [ ] `pnpm dev` démarre sans erreur
- [ ] Tailwind v4 + tokens `--color-*` globaux ; dark scaffoldé
- [ ] Sidebar 6 sections + Admin gated placeholder
- [ ] Atoms : Button, Input, Badge, Card, Avatar, Spinner, EmptyState
- [ ] tRPC + React Query ; `health.check` → OK
- [ ] Vitest + ESLint + typecheck passent
- [ ] Fichiers < 100 lignes

---

## Fichiers impactés

Suivre l'arborescence `SPEC_V2.md` §2. Créations principales :

- Racine : `package.json`, `pnpm-workspace.yaml`, `.github/workflows/ci.yml`
- App : `apps/web/` (config, `globals.css`, layout, `(dashboard)/*` placeholders)
- Composants : `components/atoms/*`, `components/organisms/AppSidebar.tsx`, `DashboardShell.tsx`
- Serveur : `server/trpc.ts`, `server/routers/health.ts`, `app/api/trpc/[trpc]/route.ts`
- Client : `lib/trpc/client.ts`, `lib/trpc/server.ts`, `components/providers/TrpcProvider.tsx`
- UI state : `stores/sidebar-store.ts`
- Tests : `health.test.ts`, `Button.test.tsx`
- Prisma stub : `prisma/schema.prisma` (generator seul — métier en #52)

Palette et icônes nav : `SPEC_V2.md` §12 — ne pas recopier ici.

---

## Contraintes

Voir `CLAUDE.md` — rappel : Prisma hors repositories interdit, RSC + `createCaller`, mutations via `trpc.useMutation()`, atomic design, fichiers < 100 lignes, zéro `any`, tokens `--color-*` uniquement, pas de `tailwind.config.ts`, lucide-react pour la nav.

---

## Fin de session

**Uniquement quand l'utilisateur le demande** :

1. Push : `git push -u origin feat/issue-50-bootstrap-nextjs-tokens-atoms`
2. PR vers `dev` avec `Closes #50` dans le body
3. **Pas de handoff** sauf instruction explicite de l'utilisateur (`/handoff`)

Ne pas merger sans validation.

---

## Tests manuels

- [ ] `pnpm install && pnpm dev` → app démarre, accent teal + Inter visibles
- [ ] Sidebar : 7 entrées (6 sections + Admin), icônes Lucide correctes
- [ ] Clic sur chaque entrée nav → route placeholder charge
- [ ] Viewport < 768px → sidebar se replie
- [ ] `pnpm test && pnpm lint && pnpm typecheck` → vert
