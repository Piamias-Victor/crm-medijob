# Prompt — Issue #187

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/187  
**Parent** : Epic #19 · `docs/PRD_V2.md` · ADR-0006 · Milestone **Bloc 1 — Candidats**  
**Blocked by** : #147 · #170 · #186 (webhook — peut dev avec seed)

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#187) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Handoffs dépendances :
- `docs/handoffs/HANDOFF_ISSUE_147.md` — EntityTable
- `docs/handoffs/HANDOFF_ISSUE_170.md` — detect/merge doublons candidats
- `docs/handoffs/HANDOFF_ISSUE_186.md` — webhook Webflow (si disponible)

Contexte : inbox en **tableau** (`/candidats?tab=inbox`). Accept → doublon → merge (#170) sinon création Candidate. Refuse → REFUSEE. Badge nav count EN_ATTENTE.

---

## Skills

```
/caveman
/tdd
```

---

## Setup

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-187-inbox-applications origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #187`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
