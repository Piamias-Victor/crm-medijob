# Prompt — Issue #485

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/485  
**Parent** : PRD #480 — Entrées app  
**Blocked by** : #482  
**Slug branche** : `feat/issue-485-entrees-app-exits-archive`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #480.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-485-entrees-app-exits-archive origin/dev
```

Rebaser sur #482 mergé. Peut avancer en parallèle de #484.

---

## Périmètre

Sorties hors vue défaut : Call outcome `Pas intéressé` / `Hors cible`, Intake status `Hors zone`, plus App-validated / Ignore déjà exclus. Filtre **archives / refusés** pour les retrouver. **Ignore** en action ligne (sémantique ignore existante, pas de reappear sync). Mutations ops / Ignore → `crm.write`.

### Acceptance criteria

- [ ] Négatifs (`Pas intéressé`, `Hors cible`, `Hors zone`) hors liste défaut
- [ ] Filtre archives retrouve négatifs / Ignore / App-validated selon PRD
- [ ] Ignore en action ligne ; sync ne les ramène pas
- [ ] Mutations gated `crm.write`
- [ ] Tests list query + ignore + permissions
- [ ] Fichiers < 100 lignes, TDD

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD · **interdit worktree**
- Vocabulaire : Ignore ≠ App-validated (succès)

## Fichiers impactés (indicatifs)

- list where / filters Entrées app
- UI Ignore row action
- permissions sur mutations

---

## Fin

PR vers `dev` avec `Closes #485`.

## Commande de test

```bash
cd apps/web && pnpm test -- app-profile permissions
```
