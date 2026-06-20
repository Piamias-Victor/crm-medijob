# Handoff — Issue #73 ([IA] Matching Mission → Candidates)

`/caveman` + `/tdd` actifs.

## État

**Prêt pour review.** Implémentation complète matching IA + polish UI + ajout pipeline depuis résultats.

- Branche : `feat/issue-73-mission-matching-ia`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-73`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/73
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_073.md`
- Spec : `SPEC_V2.md` §7.5 · ADR 0009, 0010
- Dépend de #66, #52 · Débloque #74, #75

## Livré

### Backend
- **Phase 1** `server/matching/prefilter.ts` — métier (matrice score 0), géo, distance (haversine + geo.api.gouv.fr cache), contrat, dispo
- **Phase 2** `matching-score.ts` + `matching-prompt.ts` + Zod `matching.schema.ts` — Gemini via OpenRouter (kind `matching` sur provider)
- Router `matching.scoreMissionCandidates` — pré-filtre puis IA (max 20), pas de persistance DB
- Repos : `listForMatching`, `findForMatching`, réutilise `listCompatibleCandidateTitles`

### UI
- Onglet **Matching IA** sur `/missions/[id]` — hero gradient, stats, classement animé, exclus compacts
- **Ajouter au pipeline** (stage Nouveau) sur chaque candidat scoré — `missionCandidate.position`
- Liens fiche candidat → **nouvel onglet** (`CandidateDetailLink`)
- Seed démo geo : `seed-demo-matching.ts` (Pharmacien éligible, Préparateur exclu métier, sans CP)

### Tests
- prefilter (6), distance (2), matching schema (3), router mock (3), pipeline action (2), CandidateDetailLink (1)
- `lint:lines` · `typecheck` verts (intégration Docker optionnelle)

## Config env

Worktree `.env` = **symlink** vers `medijob/apps/web/.env` (Neon + OpenRouter). Pas de `.env` dupliqué dans worktree.

Gemini réel si `EXTRACTION_PROVIDER=openrouter` + `OPENROUTER_API_KEY` (déjà dans base `.env`).

## Décisions session

- Mock provider uniquement si pas de clé / `EXTRACTION_PROVIDER=mock` — **0 scorés ≠ mock**, c’est le pré-filtre
- Position pipeline depuis matching livré ici (prompt disait hors scope #66 — PO a demandé le bouton)
- UI refactor post-review : bouton accent séparé du lien candidat (évite navigation involontaire)

## Tests manuels (agent + PO)

- [x] Matching lancé → exclus avec raisons lisibles
- [x] Candidat éligible scoré (Gemini réel via base `.env`)
- [x] Ajouter au pipeline → colonne Nouveau
- [x] Lien nom candidat → nouvel onglet
- [ ] CI GitHub Actions

## Suite (#74, #75)

- #74 matching inversé candidat → missions (même moteur)
- #75 contact depuis matching

## Points d’attention

- OpenRouter `response_format: json_object` — prompt demande array JSON ; surveiller parsing prod
- Pharmacie mission sans CP → tous exclus geo (compléter fiche pharmacie)
- Après merge : `git mv docs/prompts/pending/PROMPT_ISSUE_073.md → done/`

## Suggested skills

- `/caveman` + `/tdd`
- `/handoff` pour #74
- Plugin Prisma si évolution schéma
