# Prompt — Issue #150

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/150  
**Parent** : Epic #19 · `docs/PRD_V2.md` · ADR-0007  
**Blocked by** : —

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#150) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Lire `docs/handoffs/HANDOFF_ISSUE_149.md` (ExportCsv livré en #149 — pattern toast erreur, composants transverses Bloc 0).

Code existant utile : `ConfirmDialog`, `GlassModal`.

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
git checkout -b feat/issue-150-soft-delete-modal origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #150`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
