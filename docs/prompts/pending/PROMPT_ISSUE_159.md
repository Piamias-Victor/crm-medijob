# Prompt — Issue #159

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/159  
**Parent** : Epic #19 · `docs/PRD_V2.md` · Milestone **Bloc 2 — Pharmacies & Contacts**  
**Blocked by** : #147, #148

---

## Milestone — ordre recommandé

| # | Issue | Titre |
|---|-------|-------|
| 1 | #155 | Page `/pharmacies/new` dédiée ✓ |
| 2 | #156 | Page `/contacts/new` dédiée ✓ |
| 3 | #158 | Tableau pharmacies + filtres multi ✓ |
| 4 | **#159** | Tableau contacts + filtres multi ← **cette session** |
| 5 | #162 | Export CSV pharmacies filtrée (blocked #158, #149) |
| 6 | #163 | Export CSV contacts filtrée (blocked #159, #149) |
| 7 | #173 | Détection et fusion doublons Pharmacy |

Référence dépendances transverses : `docs/ISSUE_DEPENDENCIES.md` · patterns tableau/filtres : handoffs #158, #157, #147, #148.

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#159) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Handoffs utiles :
- `docs/handoffs/HANDOFF_ISSUE_158.md` — pattern tableau pharmacies (réutiliser `EntityListFilterBar`, `resolveEntityListRows`, etc.)
- `docs/handoffs/HANDOFF_ISSUE_157.md` — pattern CVthèque
- `docs/handoffs/HANDOFF_ISSUE_156.md` — create contacts stable

Contexte : remplacer liste contacts actuelle par tableau. Colonnes : Nom · Rôle · Pharmacie · Téléphone · Email · Date ajout · Badge principal · Ville · Département · Actions. Filtres repo : rôle · pharmacie · ville · département (via `pharmacy.postalCode`) · statut pharmacie · contact principal (oui/non).

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
git checkout -b feat/issue-159-contact-table origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #159`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
