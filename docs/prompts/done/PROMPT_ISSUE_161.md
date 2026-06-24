# Prompt — Issue #161

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/161  
**Parent** : Epic #19 · `docs/PRD_V2.md` · Milestone **Bloc 1 — Candidats**  
**Blocked by** : #149 · #157 (livrés sur branche `feat/issue-157-cvtheque-table-filters`)

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#161) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Lire `docs/handoffs/HANDOFF_ISSUE_157.md` — **ExportCsvButton déjà branché** côté client dans `CvthequeFilterBar` (lignes filtrées visibles). Valider AC ou compléter (endpoint serveur si volume > liste chargée).

Handoffs dépendances :
- `docs/handoffs/HANDOFF_ISSUE_149.md` — ExportCsvButton + `build-csv.ts` BOM UTF-8
- `docs/handoffs/HANDOFF_ISSUE_157.md` — tableau + filtres

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
git checkout -b feat/issue-161-cvtheque-export-csv origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #161`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
