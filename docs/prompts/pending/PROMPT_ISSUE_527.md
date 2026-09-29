# Prompt — Issue #527

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/527  
**Parent** : Milestone 19  
**Blocked by** : #526  
**Slug branche** : `feat/issue-527-finance-line-import-schema`

---

## Skills

```
/caveman
/tdd
```

area:data — `/code-review` vs `dev`.

---

## Setup

```bash
git fetch origin && git checkout -b feat/issue-527-finance-line-import-schema origin/dev
```

Lire ADR 0035, FinanceLine schema, `createFinanceLineSchema`, repos facturation.

---

## Périmètre

Migration : pharmacyId/candidateId nullable ; pharmacyLabel, candidateLabel, referentLabel ; importKey unique ; source UI|EXCEL_IMPORT. create UI reste obligatoire Pharmacy+Candidate (test).

### Acceptance criteria

- [ ] Migration locale
- [ ] Null FKs OK en DB
- [ ] Labels + importKey unique + source
- [ ] Test create sans Pharmacy/Candidate échoue
- [ ] Create avec les deux OK

## Fichiers probables

- `apps/web/prisma/schema.prisma` + migration
- `apps/web/src/view-models/finance-line.schema.ts` (+ tests)
- repositories facturation map/select

---

## Compte rendu

