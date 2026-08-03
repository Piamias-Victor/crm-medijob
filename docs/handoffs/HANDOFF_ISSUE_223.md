# Handoff — Issue #223 (Liste contacts CSV + admin Contact role)

## État

**Merge demandé sur `dev`.** Branche `feat/issue-223-contacts-roles-admin`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/223
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/248
- Parent : Epic #210 · CSV V1-022–V1-026 · `docs/grill/CSV_V1_DECISIONS.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_223.md` (après ce handoff)
- Bloqué par : #219 · #215 (mergés) — handoffs `HANDOFF_ISSUE_219.md` · `HANDOFF_ISSUE_215.md`
- Glossaire : **Contact role** dans `CONTEXT.md`

## Livré

- Enum Prisma `ContactRole` → modèle référentiel + FK `contactRoleId` — migration `20260801150000_contact_role_referential`
- Admin CRUD `/admin/roles-contacts` (pattern Software) — `admin.contactRole.*`, `ContactRoleAdmin`
- Seed CSV : Titulaire, Pharmacien adjoint, Préparateur référent, Responsable RH, Comptabilité, Autre — `seed-data.ts` `CONTACT_ROLES`
- Forms/filtres contacts : options DB, label UI « Fonction »
- Liste : colonnes Nom/Prénom séparées, filtre ville texte, extras conservés (badge principal, etc.)
- Vue rapide contact — `contact.quickView` + shell #215 (`ContactQuickView`)

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Schéma | `ContactRole` + `contactRoleId` (miroir JobTitle) |
| Seed labels | Textes CSV V1-026 (Pharmacien adjoint, Comptabilité, …) |
| Delete rôle | Comme Software/JobTitle (FK RESTRICT) |
| Route admin | `/admin/roles-contacts` |
| Vue rapide | Identité + rôle + pharmacie + tél/email + badge + lien fiche |
| Filtre ville | Texte libre sur `pharmacy.city` (comme pharmacies) |
| Label UI | « Fonction » ; domaine reste Contact role |
| Colonnes | Garder Ville en extra |
| Scope | Une PR |

## Suite

Slices V1 suivantes : `docs/ISSUE_DEPENDENCIES_V1.md` (candidats vue rapide #224, missions #227, etc.).

Local : `prisma migrate dev` puis seed — migration seed les 6 rôles avant seed.ts upsert.

## Suggested skills

- `/caveman`
- `/tdd`
- Relire ce handoff + `HANDOFF_ISSUE_215.md` si autre vue rapide liste (candidats/missions)
