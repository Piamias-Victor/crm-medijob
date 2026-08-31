# Prompt — Issue #374

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/374  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : #372  
**Slug branche** : `feat/issue-374-weekly-availability-filter`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #365. Pas matching IA / logiciels. Pas de MissionCandidate.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs `#366` `#367` `#372`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-374-weekly-availability-filter origin/dev
```

---

## Périmètre

Filtre recruteur : créneau AM/PM daté + JobTitle + ville / Mobility radius (défaut 30 km). Origin App, App-validated, pas Inactif. Inconnu et indispo exclus. Contacter (tél). Pas de MissionCandidate.

### Acceptance criteria

- [ ] Filtre créneau + métier + geo
- [ ] Unknown et declared-unavailable absents de « dispo »
- [ ] Pas logiciel / salaire / type de contrat
- [ ] Contact tél ; aucun MissionCandidate
- [ ] Rayon défaut 30 km
- [ ] Tests requête déterministe (pas matchingRouter IA)

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- View-models pour le filtre
- **Interdit : `git worktree`**

Vocabulaire : Weekly availability, JobTitle, Mobility radius. ADR 0024.

## Fichiers impactés

- router / repository filtre Intérim
- UI module Intérim — filtre
- `buildSmsUrl` si contact depuis la liste

---

## Fin

PR vers `dev` avec `Closes #374`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Filtrer mercredi AM + métier → seulement les origin App avec ce créneau coché
- [ ] Semaine jamais remplie absente ; semaine save vide absente
- [ ] Inactif (#373) absent ; tél cliquable ; kanban Mission inchangé
