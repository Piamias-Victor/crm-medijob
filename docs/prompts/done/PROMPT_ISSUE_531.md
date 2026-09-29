# Prompt — Issue #531

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/531  
**Parent** : Milestone 19  
**Blocked by** : #527  
**Slug branche** : `feat/issue-531-pilotage-unlinked-labels`

---

## Skills

```
/caveman
/tdd
```

---

## Setup

```bash
git fetch origin && git checkout -b feat/issue-531-pilotage-unlinked-labels origin/dev
```

---

## Périmètre

Pilotage/listes : lignes non liées comptées ; libellé Excel affiché ; bucket « Non liée ».

### Acceptance criteria

- [ ] CA/Marge incluent non liées
- [ ] Affichage label si FK null
- [ ] Bucket Non liée
- [ ] Tests

## Fichiers probables

- view-models facturation-pilotage / slices / suivi map
- composants table facturation

---

## Compte rendu

## Compte rendu

- Test Pilotage CA/Marge + slice Non liée for unlinked Excel lines
- Dry-run audit 2026-09-29 (counts only, gap 0)
