# Handoff — Issue #63 (ActivityLog Pharmacy & Contact)

`/caveman` + `/tdd` actifs.

## État

**Prêt PR.** Historique ActivityLog fonctionnel sur `/contacts/[id]` et `/pharmacies/[id]`.

- Branche : `feat/issue-63-activity-log-pharmacy-contact`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-63`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/63
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_063.md`
- Dépend de #60, #62 · Parent #19

## Livré

### Backend
- `activity-log.repository.ts` — `list` (contactId/pharmacyId + filtres `ActivityType`), `create` (author = session user)
- `activity-log.ts` router — `list`, `create`, branché `_app.ts`
- View-models : `activity-log-form.schema.ts`, `activity-log-list.ts`

### UI
- `ActivityLogTab` — filtres CheckboxGroup, timeline desc, form création manuelle
- Onglet Historique contact + pharmacie (remplace stubs)
- RSC charge logs initiaux ; mutations → `router.refresh()`
- Form : Combobox type (pas select natif) + DatePicker

### UX fix (post-review)
- `use-anchored-panel.ts` — portal `document.body` + position fixed + flip haut/bas
- `DatePicker` + `Combobox` — dropdowns plus coupés par `overflow-hidden` des `SectionCard` glass
- `ComboboxDropdown.tsx` — extrait pour < 100 lignes

### Tests (TDD)
- `activity-log.test.ts` (5) — router list/create/scope/filtres/auth

## Pièges / dette

- `.env` worktree = symlink manuel vers `medijob/apps/web/.env`
- `pnpm test` inclut intégration → Docker requis ; sinon `--exclude "**/*.integration.test.ts"`
- 1 test flaky préexistant : `PharmacyForm.test.tsx` (multiple `role="status"`) — hors scope
- #58 (candidat ActivityLog) branche séparée — réutiliser `use-anchored-panel` si merge après

## Tests manuels (checklist)

- [ ] Contact Marie Curie → Historique → ajouter DEVIS → visible contact uniquement
- [ ] Filtre NOTE → autres types masqués
- [ ] Pharmacie → Historique → log scopé pharmacyId
- [ ] Combobox Type + DatePicker en bas de carte → dropdowns non coupés
- [ ] `pnpm test && pnpm lint && pnpm typecheck`

## Suggested skills

- `/caveman` + `/tdd` pour issues suivantes (#61 documents, #65 mission fiche)
- Plugin Prisma si extension ActivityLog mission (#58 pattern)
