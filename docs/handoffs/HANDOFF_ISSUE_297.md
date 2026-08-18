# Handoff — Issue #297 (Interview fondations)

## État

**Validé user · à merger sur `dev`.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/297
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/305
- Prompt : `docs/prompts/done/PROMPT_ISSUE_297.md`
- Spec : `docs/PRD_ENTRETIENS_V1.md`
- ADR : `docs/adr/0014-interview-as-entity.md`
- Glossaire : `CONTEXT.md` § Interview
- Branche : `feat/issue-297-interview-foundations` (repo principal, pas de worktree)

## Livré

Voir diff PR #305. Points d’entrée :

- Prisma `Interview` + `InterviewTemplate` + `JobTitle.profileKey`
- Repo `interview.repository` · tRPC `interview.listByCandidate` / `getById` (lecture, y compris Communication)
- Seed métiers + 10 trames notées (`apps/web/prisma/data/interview-templates.json`)
- Onglet **Entretiens** fiche candidat (après Missions, liste vide OK)

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Métiers | A — rename Étudiant en pharmacie / Rayonniste, ajouter Conseiller parapharmacie, **garder Autre** |
| Admin mapping/critères | Pas cette slice — `profileKey` nullable pose la structure |
| Trames V1 | A — grilles notées seulement (intérim + CDD/CDI) × 5 profils = **10** ; pas le script d’appel |
| Lien profil ↔ métier | A — `JobTitle.profileKey` (pas de table mapping) |
| Onglet | A — après Missions, avant Documents |

## Tests

- Unitaires : verts (CI `quality` + Vercel preview OK)
- Intégration Testcontainers : pas lancés localement (pas de Docker)
- Manuels : **OK** (user « ça a l’air good »)
- Premier run : `JobTitle.profileKey` manquant → `prisma migrate deploy` + `db:seed` appliqués sur Neon

## Suite

- Prochaine slice : `#298` (`docs/prompts/pending/PROMPT_ISSUE_298.md`) — démarrer entretien
- Hors slice #297 : dédup, UI réponses, clôture, PDF, IA, éditeur admin trames
- Phase 5 : pas de worktree ; supprimer branche locale après merge

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` si la slice #298 a des choix trame encore flous
