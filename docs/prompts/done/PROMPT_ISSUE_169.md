# Prompt — Issue #169

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/169  
**Parent** : Epic #19 · `docs/PRD_V2.md` · Milestone **Bloc 1 — Candidats**  
**Blocked by** : #154 · #157 · #161 (mergées)

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#169) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Handoffs dépendances :
- `docs/handoffs/HANDOFF_ISSUE_154.md` — page `/candidats/new` (flow création existant)
- `docs/handoffs/HANDOFF_ISSUE_157.md` — CVthèque tableau + filtres
- `docs/handoffs/HANDOFF_ISSUE_161.md` — export CSV (contexte liste candidats)

Contexte : bouton « Importer un CV » sur `/candidats` → `/candidats/new?source=cv` (upload PDF, extraction IA, revue, création).

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
git checkout -b feat/issue-169-import-cv-list origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #169`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
