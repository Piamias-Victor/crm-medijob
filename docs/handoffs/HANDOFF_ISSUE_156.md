# Handoff — Issue #156 (Page /contacts/new)

## État

**Prêt merge.** Branche `feat/issue-156-contacts-new-page`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/156
- Parent : Epic #19 · Milestone Bloc 2 — Pharmacies & Contacts
- Débloque : #159 (tableau contacts), create racine stable

## Livré

### Route `/contacts/new`
- RSC + `createServerCaller` · `buildContactCreateDefaults()` + `?pharmacyId=` via `resolveContactCreatePharmacy`
- `ContactCreatePage` + `ContactCreateForm` — miroir #155
- Submit → redirect `/contacts/[id]` (`contact.create` → `{ id }`)

### Warning titulaire principal
- `contact.primaryByPharmacy` + bandeau sous picker pharmacie
- Copy info sans case cochée · « remplacé » seulement si `isPrimary`
- Partagé create, edit fiche (`ContactForm`), modale pharmacie (`ContactForm` via `ContactFormModal`)
- `excludeContactId` sur edit pour ne pas s'avertir soi-même

### Refactor
- `ContactFormSections` — DRY create / edit / modale
- `useWatchedPharmacyId` + `useWatchedPrimaryFlag`

### Cleanup
- Liste `/contacts` + accueil → `/contacts/new`
- `HomeQuickCreateModals` : contact retiré
- `use-home-quick-create` : plus de `createContact`

### Inchangé
- `PharmacyContactsTab` + `ContactFormModal` (création inline pharmacie)

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Schema | Réutiliser `contact-form.schema.ts` |
| Doublons contact | Skip → issue future (comme pharmacy #173) |
| Picker pharmacie | Combobox filtre local |
| Post-submit | redirect `/contacts/[id]` |
| `?pharmacyId=` invalide | Ignorer silencieusement |
| Bandeau principal | Visible dès pharmacie choisie, pas besoin de cocher |

## Tests

```bash
cd apps/web
pnpm vitest run \
  src/view-models/contact-create-defaults.test.ts \
  src/view-models/contact-primary-warning.test.ts \
  src/lib/hooks/use-watched-pharmacy-id.test.ts \
  src/server/routers/contact.test.ts \
  src/server/routers/contact-create.test.ts \
  src/components/molecules/ContactInfoForm.test.tsx
pnpm typecheck && pnpm lint
cd .. && pnpm lint:lines
pnpm dev  # /contacts/new · fiche edit · onglet pharmacie
```

## Suite (Bloc 2)

Ordre milestone : **#158** tableau pharmacies → #159 contacts → #162/#163 exports → #173 doublons pharmacy

## Points d'attention

- `listByPharmacy` filtre contacts sans email — ne pas réutiliser pour warning principal
- Toast erreur `primaryByPharmacy` peut re-fire si remount avec `isError` (dette mineure)
- `use-watched-primary-flag` sans test dédié

## Suggested skills

- `/caveman` + `/tdd` pour #158
- `/handoff` en fin de session
