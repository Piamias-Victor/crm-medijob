# Handoff — Issue #313 (Interview template admin)

## État

**Code livré · merge `dev` demandé.** Tests manuels user non confirmés (checklist postée, pas de retour OK/KO).

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/313
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/318
- Prompt : `docs/prompts/done/PROMPT_ISSUE_313.md`
- ADR : `docs/adr/0015-interview-template-admin.md`
- Parent : PRD #226 · blocked by #312 (mergé) · débloque #314 / #315
- Branche : `feat/issue-313-interview-template-admin` (repo principal, pas de worktree)

## Livré

Direction / RH-Admin éditent une **copie de travail** (`InterviewTemplateWorkingCopy`, unique `profileKey`+`mode`), puis **Publier** → `InterviewTemplate` version N+1. Interviews DRAFT déjà pinnées inchangées. Recruteur : pas d’accès.

UI : pas d’onglet Trames. Cartes **Métiers** → **Trames d’entretien** Intérim / CDD-CDI. Éditeur `/admin/metiers/[profileKey]/[mode]`. `/admin/trames` redirige. Autre (`profileKey` null) → `generique`.

Close / widgets : `mapping` explicite ; fallback wording si pin ancien sans mapping. Premier open working copy **stamp** les mappings depuis les heuristiques.

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Working copy | table dédiée, pas version 0 |
| Nav | **dans Métiers** (pas d’item Trames) |
| Mapping `none` | doublons OK |
| Unicité publish | availability \| software \| mobility \| salary \| contracts |
| Critères B/C | catalogue fixe `INTERVIEW_CRITERIA_LABELS` — pas de création admin |
| Libellé vs texte | chip entretien vs phrase note/PDF |

## Pièges

- Prisma uniquement dans `src/server/db/repositories/`. Router `admin.interviewTemplate` : `list`, `getWorkingCopy`, `saveWorkingCopy`, `publish` (`adminProcedure`).
- Migration `apps/web/prisma/migrations/20260818140000_interview_template_working_copy/` — **à appliquer** (table manquante → 500).
- Publish KO si 2 questions même mapping unique (`INTERVIEW_TEMPLATE_DUPLICATE_MAPPING`).
- Éditeur : 404 seulement `NOT_FOUND` (autres erreurs ne pas avaler).
- UI : `CheckboxChip` (éliminatoire), `Combobox` (mapping + critère, **sans** `onCreate`), sections/questions pliables, légende réponses.
- Fichiers < 100 lignes. Vocabulaire : **brouillon** = Interview DRAFT, pas working copy.

## Tests manuels

Non testés user. Auto : working-copy get/save/publish + mapping extract + meta options.

Checklist : Recruteur 403 admin ; sauver sans publier → DRAFT live inchangé ; publier → nouvel entretien nouvelle grille ; doublon mapping → publish KO ; mapping dispo → close préremplit fiche.

## Suite

- **#314** créer/archiver trame — lire ce handoff + ADR 0015. Prompt : `docs/prompts/pending/PROMPT_ISSUE_314.md`.
- **#315** insert depuis une autre trame.
- Phase 5 : pas de worktree ; supprimer branche locale après merge.

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` au briefing #314 (archive flag vs slug Autre)
