# Prompt — Issue #63

**Titre** : [PHARMACIES] ActivityLog Pharmacy & Contact  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/63  
**Parent** : #19  
**Blocked by** : #60, #62 · **Débloque** : —

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_062.md`, issue #58 (pattern ActivityLog), issue #63.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_062.md` (fiche contact, stubs Historique)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-63 -b feat/issue-63-activity-log-pharmacy-contact origin/dev
cd ../crm-medijob-issue-63
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

Remplacer stubs **Historique** sur `/contacts/[id]` et `/pharmacies/[id]` (si fiche existe) : timeline ActivityLog + création manuelle. Types commerciaux : ACTION_COMMERCIALE, DEVIS.

Réutiliser router/repo ActivityLog (#58 si mergé, sinon créer ici).

**US** : #37, #46

### Critères d'acceptation

- [ ] Historique contact fonctionnel (remplace stub)
- [ ] Historique pharmacy fonctionnel (ou contact-only si pas de fiche #60)
- [ ] Logs scopés pharmacyId / contactId
- [ ] Filtres ActivityType

---

## Fichiers impactés

- Réutiliser/étendre `activity-log` router + repository
- `ContactDetailPage` — onglet Historique
- Pharmacy fiche Historique (si route existe)
- Partager composant timeline avec candidat (#58) si possible

---

## Contraintes

DRY avec #58, repositories only, fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff + push + PR `Closes #63`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-63
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm dev
```

Login RECRUTEUR → fiche contact Marie Curie → Historique

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] DEVIS sur contact → visible contact uniquement
- [ ] Filtre NOTE fonctionne
- [ ] CI locale verte
