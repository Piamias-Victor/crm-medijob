# Handoff — Issue #59 (Portefeuille Pharmacy — liste, CRUD, lookup SIRET + TVA)

`/caveman` + `/tdd` actifs.

## État

**Terminé et vert.** `/pharmacies` : liste portefeuille + CRUD Pharmacy (modale RHF + Zod), lookup SIRET (API gouv) avec pré-remplissage + TVA intracommunautaire calculée, selects custom (Combobox) avec création inline Groupement/Logiciel, soft delete.

- Branche : `feat/issue-59-pharmacies-portefeuille-siret`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-59`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/59
- Prompt : `docs/prompts/PROMPT_ISSUE_059.md` · Spec : `SPEC_V2.md` §6 + §8 · ADR 0002
- Dépend de #53 (auth, `protectedProcedure`) et #52 (schéma, repos Pharmacy/Groupement/Software)

## Livré (voir diff PR)

### Domain / services (testés, mock — pas de réseau réel)
- `src/lib/tva.ts` — `computeNumeroTVA` (SPEC §8 : `clé = (12 + 3×(SIREN%97))%97`, SIRET→SIREN)
- `src/server/services/siret.ts` — `searchSiret(query, fetcher=fetch)` API `recherche-entreprises.api.gouv.fr`, parse Zod, **fetch injectable** (mock en test)
- `src/view-models/pharmacy-list.ts` — `toPharmacyListRow` (colonnes §6.649)
- `src/view-models/pharmacy-form.ts` — entité Pharmacy → valeurs défaut form (edit)

### Backend
- `src/server/db/repositories/pharmacy.repository.ts` — `list` (include groupement/contacts/`_count.missions` filtré soft-delete), `update`, `findById`, `softDelete` ; create/update typés **Unchecked** (FK scalaires)
- `src/server/routers/pharmacy.schema.ts` — Zod create/update/searchSiret/name (`optionalText` `'' → undefined`)
- `src/server/routers/pharmacy.ts` — **`makePharmacyRouter(deps)` injectable** : `list`, `getById`, `referentials`, `create`, `update`, `softDelete`, `searchSiret`, `createGroupement`, `createSoftware`. TVA calculée serveur sur create/update.
- `_app.ts` — branché `pharmacy`

### UI (atomic ; RSC lecture, mutations client)
- atoms : `Modal`
- molecules : `Combobox` (select custom + création inline, pas de `<select>` natif), `FormField`, `PharmacyStatusBadge`, `PharmacyFormFields`, `PharmacySelects`, `PharmacyForm` (RHF+Zod, lookup SIRET avec **spinner** `searching`), `SiretSearchButton`
- organisms : `PharmacyTable`, `PharmaciesView` (état modale, mutations tRPC, `router.refresh()`)
- `src/lib/pharmacy-options.ts` — labels/variants statut
- `app/(dashboard)/pharmacies/page.tsx` — RSC `createCaller` (list + referentials)

### Seed
- `prisma/seed-data.ts` — `GROUPEMENTS` ajouté (Giphar, Alphega, Pharmabest, …) + seed dans `seed.ts`

### Tests (TDD red→green)
- `tva.test.ts` (4), `siret.test.ts` (4, mock fetch), `pharmacy-list.test.ts` (2), `pharmacy.test.ts` (7, deps fakes + auth gate), `Combobox.test.tsx` (5), `PharmacyForm.test.tsx` (2, spinner pending + query vide)
- `pharmacy.repository.integration.test.ts` — +3 cas **Testcontainers** (Docker requis / CI)
- **60 tests verts** hors intégration DB ; `typecheck` · `lint` verts ; `next build` OK (`/pharmacies` dynamique)

## Décisions

- **ADR 0002 respecté** : pas de `PharmacyType.GROUPE`. Champ **Type retiré** du form + schema sur demande utilisateur (colonne DB conservée, plus exposée). Affiliation réseau = relation `Groupement` uniquement.
- **Selects custom** (`Combobox`) au lieu de `<select>` natif (demande UX). Création Groupement/Logiciel directe depuis le form via mutations dédiées.
- Reads en RSC + `router.refresh()` après mutation (pas de query client pour la liste).

## Pièges / dette

- `searchSiret` non couvert par test réseau réel — seulement mock. Vérifier en manuel avec un vrai SIRET.
- `_count.missions` utilise le filtered count Prisma (`where: NOT_DELETED`) — OK en 6.19.
- `pnpm test` inclut les tests intégration → **Docker requis**. Sans Docker : `pnpm exec vitest run --exclude "**/*.integration.test.ts"`.
- `.env` du worktree = symlink vers `medijob/apps/web/.env` (cf. handoff #53).

## Hors scope (suite)

- Fiche pharmacy `/pharmacies/[id]` (#60), contacts (#62), missions (#64).

## Suggested skills

- `/caveman` + `/tdd` pour toute issue
- Plugin Prisma (`prisma-client-api-*`) pour le travail DB
