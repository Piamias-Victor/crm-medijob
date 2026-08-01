# Handoff — Issue #224 (Candidate status CSV + prétentions + vue rapide)

## État

**Merge demandé sur `dev`.** Branche `feat/issue-224-candidate-status-pretentions`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/224
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/249
- Parent : Epic #210 · CSV V1-029–033 / V1-039 / V1-054 · `docs/grill/CSV_V1_DECISIONS.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_224.md` (après ce handoff)
- Bloqué par : #219 · #215 (mergés) — handoffs `HANDOFF_ISSUE_219.md` · `HANDOFF_ISSUE_215.md`
- Glossaire : **Candidate status**, **Salary expectations** dans `CONTEXT.md`

## Livré

- Enum Prisma `CandidateStatus` + champs `salaryExpectations` / `salaryMin` / `salaryMax` — migration `20260801183000_candidate_status_salary`
- Dérivation « En mission » (lecture) si MissionCandidate non-terminal ; overrides Inactif/Blacklisté — `view-models/candidate-status.ts`
- Filtre statut effectif SQL — `candidate-list-status-where.ts`
- Liste CVthèque : colonnes statut + date d’ajout ; filtres ville / mobilité max km / statut
- Vue rapide candidat — `candidate.quickView` + shell #215 (`CandidateQuickView`)
- Forms create/profil : statut manuel (sans En mission) + prétentions

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Stockage | Option A — statut stocké + En mission dérivé lecture |
| Sélecteur | Manuels seulement ; En mission jamais choisi |
| Sortie override | Qualifié (ou autre manuel) puis dérivation |
| Salary | Texte + min/max (matching #232 hors scope) |
| Filtres | Ville contains ; mobilité ≤ km ; statut effectif |
| Vue rapide | Identité, statut, mobilité/dispo, prétentions, missions actives |
| Scope | Une PR |

## Suite

Slices V1 suivantes : `docs/ISSUE_DEPENDENCIES_V1.md` (missions #227, matching prétentions #232, etc.).

Local : `prisma migrate deploy` (ou `migrate dev`) avant tests manuels.

## Suggested skills

- `/caveman`
- `/tdd`
- Relire ce handoff + `HANDOFF_ISSUE_215.md` si autre vue rapide liste
