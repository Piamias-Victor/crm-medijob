# Handoff — Issue #159 (Tableau contacts + filtres)

## État

**Prêt merge.** Branche `feat/issue-159-contact-table`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/159
- Parent : Epic #19 · Milestone Bloc 2 — Pharmacies & Contacts
- Débloque : #163 (export CSV contacts)

## Livré

### Backend
- `contact.list(filters?)` — Zod `contactListFiltersSchema` · `contact-list-where*.ts`
- **5 filtres** : rôle · pharmacie · département (`pharmacy.postalCode`) · statut pharmacie · contact principal
- Exclut contacts dont pharmacie soft-deleted
- Tests : where · repository · router · filter-map · href

### UI contacts
- `contact-table/` — EntityTable + `ContactFilterBar` (via `EntityListFilterBar`, tout en barre principale)
- Colonnes : Nom · Rôle · Pharmacie · Tél · Email · Date ajout · Badge principal · Ville · Actions
- RSC + `useContactListQuery` · URL sync · `?back=` fiche
- Supprimé `ContactList` / `ContactListCard`

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Pattern | Miroir pharmacies #158 |
| Filtres barre | 5 filtres, pas de panneau « Plus de filtres » |
| Filtre ville | **Hors scope** (comme #158) — colonne Ville affichée seulement |
| Colonne département | **Retirée** du tableau (filtre département conservé) |
| Interactions | Clic ligne + Modifier + `?back=` |
| Tri | Client-side, toutes colonnes |
| Export CSV | Report #163 |

## Tests

```bash
cd apps/web
pnpm vitest run src/server/db/repositories/contact-list-where-filters.test.ts src/server/db/repositories/contact.repository.test.ts src/server/routers/contact-list.test.ts src/server/routers/contact.test.ts src/lib/filters/contact-filter-map.test.ts src/lib/contact-href.test.ts src/view-models/contact-list.test.ts
pnpm typecheck && pnpm lint
cd .. && pnpm lint:lines
pnpm dev  # /contacts
```

## Suite (Bloc 2)

Ordre milestone : **#162** export CSV pharmacies → #163 export CSV contacts → #173 doublons pharmacy

## Points d'attention

- `department` reste dans `ContactListRow` (filtre + export #163) — plus affiché en colonne
- Filtre département = `postalCode startsWith` — pharmacies sans CP exclues
- `SPEC_COMPLEMENTAIRE.md` hors scope (non commité)

## Suggested skills

- `/caveman` + `/tdd` pour #162 ou #163
- `/handoff` en fin de session
