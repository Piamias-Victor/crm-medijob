# Prompt — Issue #483

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/483  
**Parent** : PRD #480 — Entrées app  
**Blocked by** : #481  
**Slug branche** : `feat/issue-483-entrees-app-comments-sms`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #480. **Ne pas toucher** l’envoi Intake booking SMS.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-483-entrees-app-comments-sms origin/dev
```

Dépend de #481 (liste). Peut avancer en parallèle de #482.

---

## Périmètre

Colonnes lecture seule sur Entrées app : **Badakan comments** + **indicateur SMS RDV envoyé** (`calendarSmsSentAt` ou équivalent). Affichage uniquement — zéro changement des règles / copy / flags d’envoi du SMS booking.

### Acceptance criteria

- [ ] Comments Badakan visibles en lecture sur les lignes
- [ ] Indicateur SMS RDV envoyé visible
- [ ] Aucun changement du comportement d’envoi Intake booking SMS
- [ ] Tests mapping / VM sans réseau Badakan live
- [ ] Fichiers < 100 lignes, TDD

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD · **interdit worktree**
- Vocabulaire : Badakan comment · Intake booking SMS

## Fichiers impactés (indicatifs)

- list / view-model Entrées app
- éventuel batch comments (pattern existant listComments) — éviter N+1 abusif

---

## Fin

PR vers `dev` avec `Closes #483`.

## Commande de test

```bash
cd apps/web && pnpm test -- app-profile badakan-comment
```
