# Handoff — Issue #214 (Recherche globale 4 entités)

## État

**Prêt à merger / merge demandé sur `dev`.** Branche `feat/issue-214-global-search`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/214
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/239
- Parent : Epic #210 · CSV V1-003 · `docs/grill/CSV_V1_DECISIONS.md`
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_214.md` → `done/` après merge
- Graphe : `docs/ISSUE_DEPENDENCIES_V1.md` (slice 5)

## Livré

- Service `globalSearch` : `apps/web/src/server/search/global-search.ts` (+ mappers)
- Router tRPC `search.global` : `apps/web/src/server/routers/search.ts` (wired in `_app.ts`)
- Réutilise repos search existants (pharmacy/contact/candidate/mission) + `search-pool` côté contact/candidat
- UI : sidebar trigger + palette ⌘K/Ctrl+K (`GlobalSearchPalette`, store Zustand)
- Constantes : min 2 chars, limit 8/entité, debounce 300ms
- Tests service/router (empty term, mapping 4 groupes, auth)

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Placement | Sidebar + ⌘K |
| API | Nouveau router `search.global` (pas étendre assistant) |
| Min chars | 2 |
| Limit | 8 par entité |
| Matchers | Existants (pas élargir) |
| Debounce | 300ms |
| Empty UI | Idle scopes si &lt; 2 ; « Aucun résultat » sinon |
| Design | Panneau composé (idle + icon rows + footer) après feedback UX |

## Hors scope / notes

- Blob CV `403 Forbidden` en local = token/store Vercel Blob, **pas** lié à #214
- Offres / Applications exclus V1 (CSV V1-003)

## Suite

Prochaine slice V1 selon graphe : vérifier `docs/ISSUE_DEPENDENCIES_V1.md` après merge (souvent #215+ / vue rapide / référent selon ordre AFK).

## Suggested skills

- `/caveman`
- `/tdd`
- Lire ce handoff + `CONTEXT.md` si suite transverse shell
