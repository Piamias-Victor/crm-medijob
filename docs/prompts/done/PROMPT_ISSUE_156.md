# Prompt — Issue #156

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/156  
**Parent** : Epic #19 · `docs/PRD_V2.md` · Milestone **Bloc 2 — Pharmacies & Contacts**  
**Blocked by** : — (suite logique #155, pas de dépendance technique)

---

## Milestone — ordre recommandé

| # | Issue | Titre |
|---|-------|-------|
| 1 | #155 | Page `/pharmacies/new` dédiée ✓ |
| 2 | **#156** | Page `/contacts/new` dédiée ← **cette session** |
| 3 | #158 | Tableau pharmacies + filtres multi |
| 4 | #159 | Tableau contacts + filtres multi |
| 5 | #162 | Export CSV pharmacies filtrée (blocked #158, #149) |
| 6 | #163 | Export CSV contacts filtrée (blocked #159, #149) |
| 7 | #173 | Détection et fusion doublons Pharmacy |

Référence dépendances transverses : `docs/ISSUE_DEPENDENCIES.md` · pattern page create : handoffs #154, #155.

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#156) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Handoffs utiles :
- `docs/handoffs/HANDOFF_ISSUE_155.md` — pattern `/pharmacies/new` (create page, cleanup modales, redirect fiche)
- `docs/handoffs/HANDOFF_ISSUE_154.md` — pattern `/candidats/new`
- Module contacts existant : `ContactFormModal`, `ContactsPage`, `PharmacyContactsTab`

Contexte : remplacer modale création contact **racine** (liste + accueil) par `/contacts/new`. **Création inline depuis onglet Contacts fiche pharmacie inchangée** (garder `ContactFormModal` + `lockedPharmacyId`).

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
git checkout -b feat/issue-156-contacts-new-page origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #156`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
