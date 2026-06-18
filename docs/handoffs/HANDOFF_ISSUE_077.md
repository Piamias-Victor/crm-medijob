# Handoff — Issue #77 (ADMIN Référentiels — Pipeline, Software, Groupement, JobTitle + matrice)

`/caveman` + `/tdd` actifs.

## État

**Terminé et vert** (local). Prêt merge après CI.

- Branche : `feat/issue-77-admin-referentiels`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-77`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/77
- Prompt : `docs/prompts/PROMPT_ISSUE_077.md` · ADR `0005`, `0009` · Spec `SPEC_V2.md` §6.690–695 + §10
- Dépend de #53 (gate ADMIN) · Débloque #78

## Livré

### CRUD admin (4 pages RSC + mutations tRPC)

| Route | Contenu |
|-------|---------|
| `/admin/pipeline` | PipelineStage CRUD + drag reorder (framer-motion) |
| `/admin/logiciels` | Software CRUD |
| `/admin/groupements` | Groupement CRUD |
| `/admin/metiers` | JobTitle CRUD + matrice compatibilité **scores 0–100 %** |

- `adminProcedure` + routers `admin/{pipeline,software,groupement,jobTitle}`
- Repos étendus (#52) : update/delete/reorder/usageCount ; `setCompatibilityScore` (0 % = delete ligne)
- `createServerCaller` pour lectures RSC ; `router.refresh()` post-mutation
- Guard suppression PipelineStage/JobTitle en usage → `CONFLICT`

### Matrice compatibilité (évolution post-review)

- Schéma : `JobTitleCompatibility.score Int @default(100)` — migration `20260618132000_add_compatibility_score`
- UI : sliders 0–100 %, heatmap couleur, légende explicative, commit au `mouseup`
- Seeds existants → 100 %

### Polish UI admin

- `AdminSectionCard` (header dégradé), layout admin avec icône
- Nav onglets : `adminNavLinkClass` — contraste corrigé (bordure + fond blanc inactif)

### Fixes auth (hors scope strict #77, livrés même session)

- **Bug `/admin` → `/candidats`** : `authConfig` sans callback `session` en middleware → `role` undefined. Fix : `applyTokenToSession` dans `config.ts` + `session-from-token.ts`
- **Login** : état `redirecting` + Spinner « Redirection… » après `signIn` OK

### Tests TDD

~77 tests verts · `lint` · `typecheck` · `lint:lines` · `next build` OK

## Migration DB obligatoire

Après merge / en local :

```bash
cd apps/web && pnpm prisma migrate deploy && pnpm db:seed
```

Sans migration → erreur Prisma sur `score`.

## Pièges / dette

- **`.env` worktree** : symlink vers `medijob/apps/web/.env` (Neon + AUTH_SECRET)
- **Matching #73** : consommer `JobTitleCompatibility.score` (seuil à définir) — pas branché ici
- **Kanban #54** : pipeline stages admin visibles kanban quand #54 mergé
- `compatibilitySchema` (booléen) deprecated au profit de `compatibilityScoreSchema`

## Tests manuels effectués (agent)

- [x] ADMIN CRUD pipeline + reorder
- [x] Matrice scores + légende
- [x] `/admin` accessible ADMIN (post fix session middleware)
- [x] Login loading state
- [x] Nav admin contrast

## Hors scope

- CRUD utilisateurs (#78), kanban candidats (#54)

## Suggested skills

- `/caveman` + `/tdd`
- `/handoff` en fin de #78
- Plugin Prisma migrate si schéma évolue encore
