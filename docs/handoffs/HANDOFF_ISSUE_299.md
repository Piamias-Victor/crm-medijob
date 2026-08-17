# Handoff — Issue #299 (Interview dédup à l’ouverture)

## État

**Validé user · à merger sur `dev`.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/299
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/307
- Prompt : `docs/prompts/done/PROMPT_ISSUE_299.md`
- Spec : `docs/PRD_ENTRETIENS_V1.md` · ADR `docs/adr/0014-interview-as-entity.md`
- Parent : PRD #226 · bloqué par #298 (mergé)
- Branche : `feat/issue-299-interview-dedup` (repo principal, pas de worktree)

## Livré

Voir diff PR #307. Points d’entrée :

- Probe `candidate.detectDuplicate` au submit / saisie du form start (skip si `candidateId` = depuis fiche)
- Draft session `mode: 'interview'` → même `/candidats/duplicate-review` que création manuelle
- **Fusionner** → `candidate.merge` puis `interview.start({ candidateId })` (DRAFT sur fiche gardée)
- **Ignorer** → `interview.start` sans `candidateId` (nouvelle fiche + DRAFT, comme #170)
- Mapping : `apps/web/src/view-models/interview-duplicate-incoming.ts`

Hors slice mais dans la PR : idle JWT aussi dans le middleware Edge. Accueil + page brouillon redirigent vers `/login` si pas de session (évite overlay `UNAUTHORIZED` RSC). Voir `apps/web/src/server/auth/auth-jwt.ts`.

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| UX doublon | **Exactement la fusion actuelle** (alerte + review champ à champ) |
| Ignorer | Comme #170 — créer quand même (2ᵉ fiche + DRAFT) |
| Filet serveur | Non — probe client only, comme `candidate.create` |
| Depuis fiche | Skip dédup (`candidateId` déjà là) |

Pas d’action « rattacher sans fusionner » : merge = rattachement via le review existant.

## Tests

- Unitaires : verts localement (hors Testcontainers / Docker)
- CI `quality` : vert sur le commit dédup ; re-run après ce handoff
- Manuels : **OK** (user « super » après fix auth idle)

## Suite

- Prochaine slice : **#300** (`docs/prompts/pending/PROMPT_ISSUE_300.md`) — questionnaire (page DRAFT encore un shell)
- Lire ce handoff **et** #298 (start / un DRAFT / abandon)
- Hors slice : clôture #301, PDF, IA, éditeur admin trames
- Phase 5 : pas de worktree ; supprimer branche locale après merge

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` si #300 (nav sections vs page unique, autosave) a des choix encore flous
