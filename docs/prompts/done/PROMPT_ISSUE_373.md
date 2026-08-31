# Prompt — Issue #373

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/373  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : #367  
**Slug branche** : `feat/issue-373-app-validated-inactif`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #365. Inactif ≠ Blacklisté. Pas de 2ᵉ SMS (SMS = #375).

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs `#366` `#367`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-373-app-validated-inactif origin/dev
```

---

## Périmètre

SUSPENDED / BANNED → Candidate **Inactif**, hors vivier dispo. Restore COMPLETED → status d’avant. Pas Blacklisté auto. Pas de second SMS auto.

### Acceptance criteria

- [ ] SUSPENDED ou BANNED → Inactif
- [ ] Blacklisté jamais posé par ce sync
- [ ] Restore COMPLETED → status précédent + filtre
- [ ] Pas de second SMS automatique
- [ ] Tests cycle sync injecté

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- **Interdit : `git worktree`**

Vocabulaire : Candidate status Inactif ≠ Blacklisté. ADR 0026.

## Fichiers impactés

- sync Intérim / Candidate status
- mémoriser status pré-Inactif

---

## Fin

PR vers `dev` avec `Closes #373`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Fixture SUSPENDED → Candidate Inactif, plus dans le filtre dispos (#374)
- [ ] Blacklisté manuel inchangé
- [ ] Fixture restore COMPLETED → status d’avant (ex. Qualifié)
