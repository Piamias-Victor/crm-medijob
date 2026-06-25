# Prompt — Issue #162

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/162  
**Parent** : Epic #19 · `docs/PRD_V2.md` · Milestone **Bloc 2 — Pharmacies & Contacts**  
**Blocked by** : #149, #158

---

## Milestone — ordre recommandé

| # | Issue | Titre |
|---|-------|-------|
| 1 | #155 | Page `/pharmacies/new` dédiée ✓ |
| 2 | #156 | Page `/contacts/new` dédiée ✓ |
| 3 | #158 | Tableau pharmacies + filtres multi ✓ |
| 4 | #159 | Tableau contacts + filtres multi ✓ |
| 5 | **#162** | Export CSV pharmacies filtrée ← **cette session** |
| 6 | #163 | Export CSV contacts filtrée (blocked #159, #149) |
| 7 | #173 | Détection et fusion doublons Pharmacy |

Référence dépendances transverses : `docs/ISSUE_DEPENDENCIES.md` · export baseline : handoff #157, #161 · tableau pharmacies : handoff #158.

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#162) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Handoffs utiles :
- `docs/handoffs/HANDOFF_ISSUE_158.md` — `pharmacy.list` + filtres URL + colonnes tableau
- `docs/handoffs/HANDOFF_ISSUE_157.md` — `ExportCsvButton` déjà branché CVthèque
- `docs/handoffs/HANDOFF_ISSUE_149.md` — composant export partagé

Contexte : bouton export sur `/pharmacies`. Colonnes CSV = colonnes tableau (Nom, Ville, Groupement, Statut, Contact principal, Nb missions, LGO). Source = même query `pharmacy.list` avec filtres actifs. Nom fichier `pharmacies-YYYY-MM-DD.csv`, UTF-8 BOM.

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
git checkout -b feat/issue-162-pharmacy-export-csv origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #162`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
