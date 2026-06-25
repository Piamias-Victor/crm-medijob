# Prompt — Issue #158

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/158  
**Parent** : Epic #19 · `docs/PRD_V2.md` · Milestone **Bloc 2 — Pharmacies & Contacts**  
**Blocked by** : #147, #148

---

## Milestone — ordre recommandé

| # | Issue | Titre |
|---|-------|-------|
| 1 | #155 | Page `/pharmacies/new` dédiée ✓ |
| 2 | #156 | Page `/contacts/new` dédiée ✓ |
| 3 | **#158** | Tableau pharmacies + filtres multi ← **cette session** |
| 4 | #159 | Tableau contacts + filtres multi |
| 5 | #162 | Export CSV pharmacies filtrée (blocked #158, #149) |
| 6 | #163 | Export CSV contacts filtrée (blocked #159, #149) |
| 7 | #173 | Détection et fusion doublons Pharmacy |

Référence dépendances transverses : `docs/ISSUE_DEPENDENCIES.md` · patterns tableau/filtres Bloc 1 : handoffs #147, #148, #157.

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#158) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Handoffs utiles :
- `docs/handoffs/HANDOFF_ISSUE_157.md` — pattern tableau CVthèque / filtres
- `docs/handoffs/HANDOFF_ISSUE_147.md` · `HANDOFF_ISSUE_148.md` — infra filtres
- `docs/handoffs/HANDOFF_ISSUE_156.md` — create pharmacies/contacts stable

Contexte : remplacer `PharmacyGrid` par tableau seul. Filtres repository-level (7 filtres). Colonnes : Nom · Ville · Groupement · Statut · Contact principal · Nb missions · LGO · Actions.

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
git checkout -b feat/issue-158-pharmacy-table origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #158`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
