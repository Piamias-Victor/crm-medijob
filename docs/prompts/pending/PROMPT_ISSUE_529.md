# Prompt — Issue #529

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/529  
**Parent** : Milestone 19  
**Blocked by** : #528  
**Slug branche** : `feat/issue-529-excel-import-matching`

---

## Skills

```
/caveman
/tdd
```

---

## Setup

```bash
git fetch origin && git checkout -b feat/issue-529-excel-import-matching origin/dev
```

---

## Périmètre

Match exact Pharmacy/Candidate/Referent ; co-crédit → 1er nom ; importKey stable.

### Acceptance criteria

- [ ] Match exact → ids ; sinon null
- [ ] Co-crédit 1er nom
- [ ] importKey stable, indépendant du fichier
- [ ] TDD ; < 100 lignes

## Fichiers probables

- `apps/web/src/lib/finance/excel-import-match*`
- `apps/web/src/lib/finance/excel-import-key*`

---

## Compte rendu

