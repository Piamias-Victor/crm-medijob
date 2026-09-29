# Prompt — Issue #532

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/532  
**Parent** : Milestone 19  
**Blocked by** : #527  
**Slug branche** : `feat/issue-532-link-finance-line`

---

## Skills

```
/caveman
/tdd
```

area:ui — réutiliser combobox existants ; pas de nouveau design.

---

## Setup

```bash
git fetch origin && git checkout -b feat/issue-532-link-finance-line origin/dev
```

---

## Périmètre

Filtre « non liées » + mutation lien Pharmacy/Candidate ; `finance.view` only.

### Acceptance criteria

- [x] Filtre non liées
- [x] Lien manuel garde labels
- [x] Recruteur forbidden
- [x] Composants existants
- [x] < 100 lignes

## Fichiers probables

- facturation router + filters
- FacturationPlacements / Interim pages
- molecules combobox pharmacy/candidate

---

## Compte rendu

- Filtre Liaison → `unlinkedOnly` (match + map + config)
- Mutation `linkLine` (repo patch + deps + router) ; labels Excel inchangés
- UI `FinanceLineLinkControl` (Combobox + GlassModal) sur lignes non liées
- Tests : unlinked filter, link+labels, Recruteur FORBIDDEN
- Gate : typecheck + lint:lines OK ; unit vitest (hors integration docker)
