# Handoff — Issue #312 (Interview template pin)

## État

**Code livré · merge `dev` demandé.** Tests manuels user non confirmés (checklist postée, pas de retour OK/KO).

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/312
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/317
- Prompt : `docs/prompts/done/PROMPT_ISSUE_312.md`
- ADR : `docs/adr/0015-interview-template-admin.md`
- Parent : PRD #226 · bloque #313 (éditeur admin)
- Branche : `feat/issue-312-interview-template-pin` (repo principal, pas de worktree)

## Livré

Voir diff PR #317. Ne pas relire tout le slice.

`Interview.templateId` → version **publiée** (latest `version` du couple) au **start**. `load-run` / close / PDF / suggest cvSummary lisent la trame pinnée. DRAFT sans pin (pré-#312) → fallback latest. Seed fill-only : couple `profileKey × mode` déjà là → no-op ; absent → insert **version 1**. Pas d’UI admin. Pas de hard-delete des versions.

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Pin | **id** `InterviewTemplate`, pas copie JSON dans Interview |
| Seed | aucune ligne pour le couple → insert v1 ; sinon no-op |
| « Publié » sans éditeur | latest `version` = publié (#313 ajoutera working copy) |
| Brouillons existants | pas de backfill ; fallback latest |

Vocabulaire : **brouillon** = Interview DRAFT, pas copie travail admin.

## Pièges

- Résoudre trame : `resolveInterviewTemplate` + live `loadLiveInterviewTemplate`. Close/preview/PDF/suggest passent **la row** (avec `templateId`), plus `(candidateId, mode)`.
- Start : `pinPublishedTemplateId` via `findCandidateProfileKey` + `findPublishedTemplate` (`findByProfileMode` = max version, select `id`).
- Seed : plus d’`upsert`. JSON seed ignore `version` fichier → create force `version: 1`.
- FK `onDelete: Restrict`. Migration `apps/web/prisma/migrations/20260818120000_interview_template_pin/`.
- Fichiers < 100 lignes (`pnpm lint:lines` depuis la racine repo).

## Tests manuels

Non testés user. Auto : unitaires pin/seed verts. CI `quality` SUCCESS sur le commit feature. Intégration testcontainers = Docker (skip/fail hors daemon).

Checklist PR #317 : lancer entretien → reload grille inchangée ; close + PDF OK ; re-seed n’écrase pas.

## Suite

- **#313** éditeur admin `/admin/trames` — blocked by #312. Lire ce handoff + ADR 0015 + pattern `/admin/metiers`.
- #314 créer/archiver · #315 dupliquer questions.
- Phase 5 : pas de worktree ; supprimer branche locale après merge.

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` si working copy vs version 0 encore flou au briefing #313
