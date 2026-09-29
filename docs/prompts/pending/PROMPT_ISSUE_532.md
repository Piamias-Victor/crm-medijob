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

- [ ] Filtre non liées
- [ ] Lien manuel garde labels
- [ ] Recruteur forbidden
- [ ] Composants existants
- [ ] < 100 lignes

## Fichiers probables

- facturation router + filters
- FacturationPlacements / Interim pages
- molecules combobox pharmacy/candidate

---

## Compte rendu

