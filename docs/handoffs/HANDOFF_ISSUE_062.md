# Handoff — Issue #62 (Contacts — liste + fiche)

`/caveman` + `/tdd` actifs.

## État

**Terminé et vert.** `/contacts` liste + `/contacts/[id]` fiche avec édition inline (pas de modale Modifier).

- Branche : `feat/issue-62-contacts-module`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-62`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/62
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_062.md` · Spec : `SPEC_V2.md` §6.653–665
- Dépend de #59 (Combobox, pharmacy picker) · Débloque #63 (ActivityLog contact)

## Livré (voir diff PR)

### Backend
- `contact.repository.ts` — `list` (include pharmacy), `update`, `setPrimary` (unset previous sur même pharmacy), `listMissions`, create avec gestion `isPrimary`
- `contact.ts` — **`makeContactRouter(deps)` injectable** : `list`, `getById`, `create`, `update`, `softDelete`, `setPrimary`, `missions`, `pharmacyOptions`
- `_app.ts` — branché `contact`

### View-models
- `contact-list.ts` — colonnes SPEC §6.658
- `contact-form.schema.ts` — `pharmacyId` requis, enum `ContactRole` complet
- `contact-form.ts`, `contact-tab-meta.ts`
- `lib/contact-options.ts`, `lib/contact-form-styles.ts`

### UI
- **Liste** : `ContactsView`, `ContactTable` (row cliquable → fiche ; edit/delete stop propagation)
- **Fiche** : layout admin (header gradient, pills `adminNavLinkClass`, `AdminSectionCard`)
- **Infos** : `ContactInfoForm` — formulaire inline direct (plus de bouton Modifier / modale)
- `PrimaryToggle` — carte custom titulaire principal (étoile)
- Tabs : Infos · Historique stub · Missions (cards cliquables) · Documents stub
- `ContactDetailHeader` — badge primary + action « Définir titulaire principal »

### Seed
- `seed-demo.ts` — `demo-contact-1` (Marie Curie, titulaire) + missions liées via `contactId`

### Tests (TDD red→green)
- `contact-list.test.ts` (1), `contact.test.ts` (6), `PrimaryToggle.test.tsx` (2), `ContactInfoForm.test.tsx` (1)
- `contact.repository.integration.test.ts` — +1 cas `setPrimary`
- **174 tests verts** hors intégration DB ; `typecheck` · `lint` verts

## Décisions UX (demande utilisateur)

- Design fiche inspiré `/admin` (header gradient, pills, section card)
- `PrimaryToggle` custom au lieu de checkbox natif
- Clic ligne liste ou card mission → navigation directe
- Fiche : édition inline onglet Infos (1 clic Enregistrer, pas modale intermédiaire)

## Pièges / dette

- `.env` worktree = symlink manuel vers `medijob/apps/web/.env` (cf. prompt)
- `pnpm test` inclut intégration → Docker requis ; sinon `--exclude "**/*.integration.test.ts"`
- Historique / Documents = stubs (#63 / lot documents)
- Lien header pharmacie → `/pharmacies/[id]` (#60 peut être absent selon branche)
- Conflit possible contact repo avec #60 — merger `dev` souvent

## Hors scope (suite)

- ActivityLog contact (#63)
- Onglet contacts fiche pharmacy (#60)

## Tests manuels (résultat attendu)

- [ ] Liste colonnes SPEC + row click → fiche
- [ ] Create sans pharmacy → erreur validation
- [ ] 2 titulaires → 1 seul `isPrimary`, ancien reste listé
- [ ] Fiche Infos : edit inline + Enregistrer
- [ ] Onglet Missions : missions liées, card cliquable

## Suggested skills

- `/caveman` + `/tdd` pour #63
- Plugin Prisma pour ActivityLog polymorphe
