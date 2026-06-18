# Handoff — Issue #60 (Fiche Pharmacy — Contacts, Besoins, création Mission)

`/caveman` + `/tdd` actifs.

## État

**Terminé et vert** (hors tests intégration DB si Docker absent).

- Branche : `feat/issue-60-pharmacy-fiche-tabs`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-60`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/60
- Prompt : `docs/prompts/done/PROMPT_ISSUE_060.md` · Spec : `SPEC_V2.md` §6.651–656
- Dépend de #59 (PharmacyForm, Combobox, portefeuille) · Débloque #61, #63

## Livré

### Backend
- `pharmacy.repository.ts` — `findDetailById` (contacts, missions, groupement, LGO)
- `pharmacy.ts` — `getById` enrichi via `toPharmacyDetail` ; update via `toPharmacyUpdateData` (**null explicites** pour champs vidés)
- `mission.repository.ts` — `createQuick` (status `A_POURVOIR`)
- `mission.ts` — `create`, `createJobTitle`, `referentials` (métiers + référents)
- `mission-referentials.ts` + adapter

### View-models
- `pharmacy-detail.ts` / `.types.ts` — payload fiche, contacts, missions actives (exclut POURVU/ANNULEE)
- `pharmacy-update.ts` — mapping Prisma avec null sur champs optionnels vidés
- `pharmacy-profile.ts` — `getMissingPharmacyFields` (ville, CP)
- `mission-quick-create.schema.ts` — title, jobTitleId, contractType, startDate optionnel, referentId, pharmacyId
- `pharmacy-tabs.ts`, `pharmacy-tab-meta.ts`

### UI
- `/pharmacies/[id]` — RSC + `PharmacyDetailPage`
- 5 onglets : **Infos** · **Contacts** · **Besoins en cours** · **Historique** stub · **Documents** stub
- Infos : `PharmacyForm` inline + banner localisation + `GeoFields` (CP → ville)
- Contacts : liste cliquable + **Nouveau contact** (modale, pharmacie verrouillée)
- Besoins : missions actives + `MissionQuickCreateForm` (métier inline, date « Dès que possible »)
- Header : contact principal, groupement, statut, LGO
- `PharmacyListCard` → lien `/pharmacies/[id]`

### UX follow-up (même PR)
- Date picker label global : **« Dès que possible »** (`ASAP_DATE_LABEL` dans `date-picker-utils`)
- Création métier inline : mission quick-create **+** fiche candidat (`mission.createJobTitle`)
- `GeoFields` extrait — partagé candidat + pharmacie

### Tests (TDD red→green)
- `pharmacy-detail.test.ts` (3), `pharmacy-update.test.ts` (1), `pharmacy-profile.test.ts` (2)
- `pharmacy.test.ts` (9), `mission.test.ts` (6), `date-picker-utils.test.ts` (3)
- `typecheck` · `lint` · `lint:lines` verts sur périmètre touché

## Décisions

- Missions actives = `status` ∉ {POURVU, ANNULEE} via `isTerminalMissionStatus` (ADR 0001)
- `startDate` mission optionnel côté form → serveur default `new Date()` si ASAP
- Contact depuis fiche pharmacy : `lockedPharmacyId` sur `ContactForm` / `ContactAffiliationFields`

## Pièges / dette

- `.env` worktree = symlink manuel vers `medijob/apps/web/.env`
- `pnpm test` inclut intégration → Docker requis ; sinon `--exclude "**/*.integration.test.ts"`
- Historique / Documents = stubs (#63 / #61)
- `/missions/[id]` absent — refresh liste après création mission (pas redirect fiche)
- `createGroupement` / `createSoftware` restent admin-only sur Infos pharmacie

## Tests manuels

- [ ] 5 onglets visibles sur `/pharmacies/demo-pharmacy`
- [ ] Infos : vider téléphone → Enregistrer → persiste vide
- [ ] Infos : banner si ville/CP manquants ; CP 69001 → ville Lyon
- [ ] Contacts : créer contact depuis onglet → apparaît dans liste
- [ ] Besoins : créer mission ASAP + métier inline → liste A_POURVOIR
- [ ] Candidat : création métier inline sur fiche profil

## Suggested skills

- `/caveman` + `/tdd` pour #61 (Documents Blob) ou #63 (ActivityLog)
- Plugin Prisma pour migrations/documents si #61
