# Prompt — Issue #528

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/528  
**Parent** : Milestone 19  
**Blocked by** : #527  
**Slug branche** : `feat/issue-528-excel-finance-parser`

---

## Skills

```
/caveman
/tdd
```

area:logic — fixtures xlsx **anonymisées** générées ; zéro nom réel.

---

## Setup

```bash
git fetch origin && git checkout -b feat/issue-528-excel-finance-parser origin/dev
```

---

## Périmètre

Parser pur onglets mois ; CHIFFRE gagne le mois entier ; SAISIE/TOTAL ignorés ; CA vide → 0 ; heures Intérim sans tarif.

### Acceptance criteria

- [ ] Overlap Suivi ignoré si mois dans CHIFFRE
- [ ] SAISIE ignoré
- [ ] CA vide → 0
- [ ] Heures Intérim numériques ; pas hourlyRate
- [ ] Fixtures anonymes
- [ ] Fichiers < 100 lignes

## Fichiers probables

- `apps/web/src/lib/finance/excel-import-*`
- tests + helper generate xlsx

---

## Compte rendu

