# Handoff — Issue #155 (Page /pharmacies/new)

## État

**Prêt merge.** Branche `feat/issue-155-pharmacies-new-page` · PR https://github.com/Piamias-Victor/crm-medijob/pull/204

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/155
- Parent : Epic #19 · Milestone Bloc 2 — Pharmacies & Contacts
- Débloque : #158 (tableau pharmacies), annuaire create stable pour #173

## Livré

### Route `/pharmacies/new`
- RSC + `createServerCaller` · defaults `buildPharmacyCreateDefaults()` (nom vide, status PROSPECT)
- `PharmacyCreatePage` — shell fiche (`EntityDetailShell` + `DetailPageHeader`), sans onglets
- `PharmacyCreateForm` + `PharmacyCreateFormSections` — miroir pattern #154
- Submit → redirect `/pharmacies/[id]` (`pharmacy.create` typé `{ id }`)

### Recherche annuaire (SIRET / nom)
- Réutilise `pharmacy.searchSiret` + `usePharmacySiretSearch`
- Bouton **Rechercher** à côté **Nom** et **SIRET** (query prioritaire selon bouton cliqué)
- 0 résultat → popup `SiretSearchAlertModal` (GlassModal)
- 1 résultat → auto-fill + TVA (`applyPharmacySiretLookup`)
- N résultats → `SiretLookupPicker` inline
- Partagé create + fiche edit via `PharmacySiretSearchPanel` + `PharmacyForm`

### Cleanup
- `PharmacyFormModal` supprimée
- Liste `/pharmacies` + accueil → lien/redirect `/pharmacies/new`
- `use-home-quick-create` : plus de wiring pharmacy modal

### Inchangé
- Édition inline fiche pharmacie (`PharmacyInfoForm` / `PharmacyForm`)
- Création contact depuis onglet pharmacie (`PharmacyContactsTab` + modale)

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Doublons | Skip → #173 (pas de wiring create) |
| Champ `type` INDEPENDANTE/CLINIQUE | Non — hors UI (cf. handoff #59) |
| `paymentConditions` / `notes` create | Non — pas sur form create |
| Schema | Étendre `pharmacy-form.schema.ts` (pas de fichier dédié) |
| UI | Miroir exact #154 (organisms create-page + create-form) |
| Modales liste/accueil | Supprimées → page dédiée |
| Post-submit | redirect `/pharmacies/[id]` |
| Feedback annuaire vide | Popup modal (pas ligne inline) |
| Recherche nom | Même API gouv · bouton dédié sur Nom |

## Tests

```bash
cd apps/web
pnpm vitest run src/view-models/pharmacy-create-defaults.test.ts src/view-models/pharmacy-form.test.ts src/server/routers/pharmacy.test.ts src/lib/pharmacy-siret-lookup.test.ts src/components/molecules/PharmacyForm.test.tsx
pnpm typecheck && pnpm lint
cd .. && pnpm lint:lines
pnpm dev  # /pharmacies/new · accueil · liste
```

## Suite (Bloc 2)

Ordre milestone : **#156** `/contacts/new` → #158 → #159 → #162/#163 → #173 doublons pharmacy

## Points d'attention

- SIRET absent annuaire gouv = `results: []` (ex. `94529941000010`) — comportement attendu, pas bug CRM
- `PharmacyFormReferentialsSection` extrait pour respect limite 100 lignes
- Prochaine issue contacts : garder `ContactFormModal` sur `PharmacyContactsTab` uniquement

## Suggested skills

- `/caveman` + `/tdd` pour #156
- `/handoff` en fin de session
