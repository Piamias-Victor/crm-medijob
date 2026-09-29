# Prompt — Issue #530

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/530  
**Parent** : Milestone 19  
**Blocked by** : #529  
**Slug branche** : `feat/issue-530-excel-import-cli`

---

## Skills

```
/caveman
/tdd
```

---

## Setup

```bash
git fetch origin && git checkout -b feat/issue-530-excel-import-cli origin/dev
```

Pattern : `apps/web/scripts/import-syncro-entrees.ts`.

---

## Périmètre

CLI dry-run défaut → rapport `docs/audits/import-excel/<date>-dry-run.md` (comptes, pas de noms). `--apply` transactionnel skip importKey. Test 2e apply = 0 création.

### Acceptance criteria

- [ ] Dry-run défaut
- [ ] Rapport sans PII
- [ ] Apply skip existants
- [ ] 2e apply = 0 (test)
- [ ] Tableau rapprochement mensuel

## Fichiers probables

- `apps/web/scripts/import-excel-finance-lines.ts`
- `apps/web/src/server/.../excel-import*`
- `docs/audits/import-excel/.gitkeep`

---

## Compte rendu

## Compte rendu

- CLI dry-run/--apply + plan/report/apply pure + DB deps
- Test: 2e apply = 0 création ; rapport sans noms
