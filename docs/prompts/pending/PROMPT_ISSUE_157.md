# Prompt — Issue #157

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/157  
**Parent** : Epic #19 · `docs/PRD_V2.md` · Milestone **Bloc 1 — Candidats**  
**Blocked by** : #147 · #148 (mergées)

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#157) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Lire `docs/handoffs/HANDOFF_ISSUE_154.md` (page `/candidats/new` livrée — plus de modale create).

Handoffs dépendances transverses :
- `docs/handoffs/HANDOFF_ISSUE_147.md` — EntityTable
- `docs/handoffs/HANDOFF_ISSUE_148.md` — FilterBar

Contexte existant : `CvthequeSection` / `CvthequeList` cartes · kanban `CvthequeKanban` · `candidate.list` sans filtres avancés.

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
git checkout -b feat/issue-157-cvtheque-table-filters origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #157`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
