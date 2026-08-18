# Handoff — Issue #301 (Interview close)

## État

**Validé user · mergé / à merger sur `dev`.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/301
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/309
- Prompt : `docs/prompts/done/PROMPT_ISSUE_301.md`
- Spec : `docs/PRD_ENTRETIENS_V1.md` · ADR `docs/adr/0014-interview-as-entity.md`
- Parent : PRD #226 · bloqué par #300 (mergé)
- Branche : `feat/issue-301-interview-close` (repo principal, pas de worktree)

## Livré

Voir diff PR #309 (commit initial + commit UX clôture). Ne pas relire tout le slice.

Slice fonctionnel : close DRAFT → CLOSED, scores B/C, décision, mapping confirm, status confirm, ActivityLog, multi CLOSED / 1 DRAFT. Sans IA.

Slice UX : écran clôture glass, sliders score, mapping éditable, chips CDD/qualité.

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Chips qualité CDD/CDI | Labels courts Flou / Générique / Solide / Remarquable ; valeur persistée = phrase complète (virgules cassaient `splitChoiceLabels`) |
| Chips CDD concrètes | Même pattern INTERIM via `interview-cdi-chips.ts` → `pertinentInterviewChips` |
| Mapping overwrite | Prefill = valeur **actuelle** fiche, pas l’extrait |
| Mapping fill | Prefill = `next` ; champ déjà dans `overwriteFields` |
| Action mapping | Chip **Enregistrer** (toggle), pas « Écraser » |
| Logiciels / contrats | `CheckboxGroup` (logiciels + CDI/CDD/Intérim) |
| Statut | Qualifié **coché par défaut** si `proposedStatus != null` ; chip Blacklisté seulement si Non éligible |
| Hint statut | Pas de « Rien ne change… » |
| Scores | Une piste slider (`Slider` fill overlay), pas double barre |

## Pièges

- Exclusive chips : **ne pas** splitter les labels sur `, ` — `selectedChoiceValues` / `persistChoiceValues` dans `interview-question-kind.ts`.
- Close API : `mappingEdits: Record<string, string>` + `applyMappingEdits` (`close-side-effects.ts`).
- Pas de nouvelle branche : rester sur `feat/issue-301-interview-close` jusqu’au merge.

## Suite

- **#302** PDF compte-rendu — `docs/prompts/pending/PROMPT_ISSUE_302.md` (blocked by #301)
- **#303** IA optionnelle close — `docs/prompts/pending/PROMPT_ISSUE_303.md` (blocked by #301)
- Phase 5 : pas de worktree ; supprimer branche locale après merge

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` pour #302 (PDF auto à la clôture vs bouton)
