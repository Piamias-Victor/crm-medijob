# Prompt — Issue #154

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/154  
**Parent** : Epic #19 · `docs/PRD_V2.md` · Milestone **Bloc 1 — Candidats**  
**Blocked by** : —

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#154) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Lire `docs/handoffs/HANDOFF_ISSUE_152.md` (DuplicateDetectionPage livré Bloc 0 — redirect doublons = #170, pas dans ce slice).

Contexte existant : `CandidateQuickCreateForm` / modales `HomeQuickCreateModals` / `CvthequeList` — à remplacer par page dédiée.

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
git checkout -b feat/issue-154-candidats-new-page origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #154`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
