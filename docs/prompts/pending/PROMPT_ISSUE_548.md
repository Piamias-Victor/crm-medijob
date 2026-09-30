# Prompt — Issue #548

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/548  
**Parent** : #545 · ADR 0036  
**Blocked by** : #547

## Skills

```
/caveman
/tdd
/code-review
```

## Contexte

Stamp on transition only. Inventory ALL paths that set QUALIFIE / POURVU / Badakan STAFFED|COMPLETED.

### Inventaire attendu (à compléter/vérifier dans le code)

1. Entrées app ✓ Qualifié → Candidate QUALIFIE
2. Interview close → Candidate QUALIFIE
3. Candidate status update UI/API → QUALIFIE
4. Mission updateStatus / terminal → POURVU
5. Pipeline applyTerminalTransition → POURVU
6. Badakan mission sync upsert step → STAFFED/COMPLETED

Rules: previous≠target; never stamp if create/first-seen already target; never overwrite; keep on rollback.

## Critères d'acceptation

- [ ] Inventory written in Compte rendu
- [ ] One test per path
- [ ] First sync already STAFFED → staffedAt NULL
- [ ] Rollback keeps stamp
- [ ] Sync behavior otherwise unchanged

## Fichiers probables

- qualify / interview close / candidate update / mission transition / badakan sync repos

## Compte rendu

(à remplir)
