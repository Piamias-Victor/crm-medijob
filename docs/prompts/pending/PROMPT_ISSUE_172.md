# Prompt — Issue #172

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/172  
**Parent** : Epic #19 · `docs/PRD_V2.md` · Milestone **Bloc 1 — Candidats**  
**Blocked by** : #151 (mergée) · #171 (patterns IA réutilisables)

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#172) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Handoffs dépendances :
- `docs/handoffs/HANDOFF_ISSUE_151.md` — EmailButton, mailto/Gmail, ActivityLog
- `docs/handoffs/HANDOFF_ISSUE_171.md` — présentation pharmacie, IA email, hooks draft

Contexte : présentation multi-pharmacies — rayon km + centre → liste pharmacies désélectionnable → **un seul mailto:** groupé (CCI/To), corps générique IA.

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
git checkout -b feat/issue-172-present-candidate-radius origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #172`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
