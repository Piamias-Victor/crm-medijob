# Handoff — Issue #300 (Interview answers + autosave)

## État

**Validé user · à merger sur `dev`.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/300
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/308
- Prompt : `docs/prompts/done/PROMPT_ISSUE_300.md`
- Spec : `docs/PRD_ENTRETIENS_V1.md` · ADR `docs/adr/0014-interview-as-entity.md`
- Parent : PRD #226 · bloqué par #298 (mergé)
- Branche : `feat/issue-300-interview-answers` (repo principal, pas de worktree)

## Livré

Voir diff PR #308. Entrées :

- `interview.saveDraft` / `interview.getRun` — JSON `Interview.answers` (`questions` + `checklist`)
- UI : `InterviewDraftPanel` → `InterviewRunForm` (page longue + nav sections)
- Chips `CheckboxChip` / `CheckboxGroup` : **multi** logiciels + 4 questions (intérim, type, attentes, équipe) ; **mono** le reste (Ordre, Maintenant…)
- Dossier : CV / pièce / Vitale / diplôme + `document.upload` (entité CANDIDATE)
- Valider : persist + toast + redirect `interviewCandidateFichePath`
- Trame `generique` si métier Autre (`resolveInterviewProfileKey(null)`)

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Nav | Page longue + ancres, pas wizard |
| Autosave | Immédiat au choix · notes debounce 800 ms |
| Checklist | Liste CRM fixe (CV, pièce, Vitale, diplôme) INTERIM et CDD/CDI |
| Métier Autre | Trame `generique`, pas de changement `JobTitle.profileKey` |
| Multi | Logiciels + 4 questions listées ; le reste exclusive |
| Valider | Retour fiche candidat |

## Piège local

`document.upload` 500 si `BLOB_READ_WRITE_TOKEN` rejeté par Vercel (`Access denied`). Toast : jeton invalide/expiré. Régénérer via dashboard Blob ou `vercel env pull` dans `apps/web`. Ne pas logger le token.

## Tests

- Unitaires : verts localement (hors Testcontainers)
- Manuels : UX chips validée (« super ») ; Valider → fiche à retester après ce commit

## Suite

- **#301** clôture / score — hors slice, `docs/prompts/pending/PROMPT_ISSUE_301.md`
- Hors slice : PDF, IA, éditeur admin trames
- Phase 5 : pas de worktree ; supprimer branche locale après merge

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` pour #301 (close vs score, barème, décision)
