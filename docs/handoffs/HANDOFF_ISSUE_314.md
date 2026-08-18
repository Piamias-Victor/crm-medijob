# Handoff — Issue #314 (Interview template create / archive)

## État

**Code livré · merge `dev` demandé par l’user.** Tests manuels : OK user (« sinon nickel ») après migration `archivedAt`. Fix Combobox source de copie demandé puis appliqué.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/314
- Parent : PRD #226 · blocked by #313 (mergé) · débloque #315
- ADR : `docs/adr/0015-interview-template-admin.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_314.md`
- Branche : `feat/issue-314-interview-template-create-archive` (repo principal, pas de worktree)
- Handoff amont : `docs/handoffs/HANDOFF_ISSUE_313.md`

## Livré

Direction / RH-Admin **créent** une trame (vide ou copie d’une **publiée**) pour JobTitle × mode, et **archivent** un couple. Pas de hard-delete des versions publiées. Générique non archivable.

- `admin.interviewTemplate.create` / `archive` / `listPairs`
- `archivedAt` sur `InterviewTemplateWorkingCopy` (flag couple, versions restent)
- Pin live : couple archivé → latest `generique` ; DRAFT déjà pinné inchangé
- JobTitle sans `profileKey` : slug ASCII éditable, unique, `generique` réservé
- Recréer après archive = **réactive** le même couple (clear `archivedAt`)
- UI Métiers : carte **Trame générique** + Créer / Éditer par mode ; Archiver dans l’éditeur dédié

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Archive | `archivedAt` sur WC (couple), pas « pas de latest publiée » |
| Slug Autre | ASCII du libellé, unique, éditable avant create |
| Recréer après archive | **A** — réactive le couple |
| Copie | latest publiée de n’importe quel couple ; **nouveaux ids** dès la copie |
| Source UI | Combobox custom (pas `<select>` natif) — demandé en fin de QA |

## Pièges

- Prisma uniquement repositories. Router `admin.interviewTemplate` : `list`, `listPairs`, `getWorkingCopy`, `saveWorkingCopy`, `publish`, `create`, `archive`.
- Migration `apps/web/prisma/migrations/20260818153000_interview_template_working_copy_archived/` — **appliquée sur Neon** en session (sinon 500 `archivedAt` missing sur `/admin/metiers`).
- Create 2e INTERIM actif → `CONFLICT` (`INTERVIEW_TEMPLATE_PAIR_EXISTS`). Archivé → create OK.
- Pin : `isPairArchived` dans `StartInterviewDeps` / live `interviewRouter`.
- Vocabulaire : **brouillon** = Interview DRAFT, pas working copy.
- Fichiers < 100 lignes.

## Tests manuels

User OK hors Combobox (corrigé après). Auto : create vide/copie/ids, refuse doublon + `generique` + slug, archive, pin fallback, réactivation.

Relire Combobox « Trame vide » vs copie Pharmacien Intérim si merge avant re-QA UI.

## Suite

- **#315** insert une *question* depuis une autre trame. Prompt : `docs/prompts/pending/PROMPT_ISSUE_315.md`.
- Phase 5 : pas de worktree ; supprimer branche locale après merge.

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` au briefing #315 (d’où vient la question source, ids, mapping unique)
