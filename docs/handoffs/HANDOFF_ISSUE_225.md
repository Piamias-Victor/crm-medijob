# Handoff — Issue #225 (Timeline historique + import CSV + fusion)

## État

**Merge demandé sur `dev`.** Branche `feat/issue-225-candidate-history-import`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/225
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/250
- Parent : Epic #210 · CSV V1-036 / V1-040 · `docs/grill/CSV_V1_DECISIONS.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_225.md` (après ce handoff)
- Bloqué par : #216 · #224 (mergés) — handoffs `HANDOFF_ISSUE_216.md` · `HANDOFF_ISSUE_224.md`
- Patterns : timeline #221 · import #222 · fusion #170

## Livré

- Timeline mixte Historique candidat : ActivityLog + tous `MissionCandidate` — VM `candidate-history*` · UI `CandidateHistoryTab*`
- Payload `historyPositionings` + `updatedAt` sur include profil
- Import CSV `/candidats/import` : wizard upload → mapping → preview → `candidate.commitImport`
- Dédup import email OU téléphone (soft-deleted inclus) — `detect-candidate-import-duplicates` · `findIdentityByEmailAny` / `findIdentityByPhoneAny`
- File doublons sessionStorage → review existante + `candidate.merge` (#170) · draft `mode: 'import'`
- Bouton « Importer CSV » sur liste CVthèque

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Positionnements timeline | Tous (actifs + terminaux) |
| Contenu carte | Titre + stage + date + lien mission |
| Date tri | `MissionCandidate.updatedAt` |
| Filtres logs | Positionnements toujours visibles |
| UX import | Clone pharmacies #222 |
| Champs CSV | prénom/nom/métier* + email/tél/adresse/ville/CP/statut/mobilité/prétentions/notes |
| Métier inconnu | Erreur bloquante preview |
| Soft-deleted | Traité comme doublon |
| Post-commit | Clean créés ; doublons en file fusion |
| Limites | 5 Mo / 2000 lignes |
| Scope | Une PR |

## Hors scope

- Softwares / préférences contrat dans CSV
- Création JobTitle à la volée
- Fusion auto silencieuse

## Suite

Slices V1 suivantes : `docs/ISSUE_DEPENDENCIES_V1.md` (missions #227, matching prétentions #232, etc.).

## Suggested skills

- `/caveman`
- `/tdd`
- Relire ce handoff + `HANDOFF_ISSUE_222.md` / `HANDOFF_ISSUE_170.md` si autre import CSV
