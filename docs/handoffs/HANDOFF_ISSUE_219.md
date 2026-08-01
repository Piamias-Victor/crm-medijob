# Handoff — Issue #219 (Referent optionnel Pharmacy/Contact + filtres)

## État

**Prêt à merger sur `dev`.** Branche `feat/issue-219-referent-optional`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/219
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/244
- Parent : Epic #210 · CSV V1-006 · `docs/grill/CSV_V1_DECISIONS.md`
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_219.md` → `done/` après merge
- Graphe : `docs/ISSUE_DEPENDENCIES_V1.md` (slice 4)
- Bloqué par : #213 (mergé)

## Livré

- Migration `20260801141000_optional_referent_v1` : `referentId` optionnel Pharmacy + Contact ; Candidate/Mission `String?` + `onDelete: SetNull`
- Forms create/edit : `ReferentField` clearable ; défaut UX = user courant ; contact hérite référent pharmacie si présent
- Filtres `referentIds` + sentinel `__none__` (« Sans référent ») pharmacies/contacts (+ CVthèque)
- `listRecruiters` = Direction / Recruteur / RH-Admin (pas Communication)
- Colonne tableau pharmacies **hors scope** (#220)

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Nullabilité | `String?` + SetNull sur 4 entités |
| Backfill | Non — migration schéma seule |
| Défaut create | `session.user.id`, clearable → null |
| Picker | Direction + Recruteur + RH-Admin |
| Contact create | Prefill pharmacy.referent sinon user |
| Filtre none | `__none__` / « Sans référent » |
| Colonnes liste | Non (#220) |
| Perms réassign | Tout rôle avec write entité |
| Seeds | Garder référents démo |

## Suite

Prochaines slices débloquées par #219 : **#220** (colonnes pharmacies), **#223** (contacts CSV), **#224** (candidats), **#227** (missions) — voir graphe.

## Suggested skills

- `/caveman`
- `/tdd`
- Prisma migrate skills si DB locale pas à jour
- Lire `CONTEXT.md` (Referent) + ce handoff
