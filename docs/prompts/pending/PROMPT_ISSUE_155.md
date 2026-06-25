# Prompt — Issue #155

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/155  
**Parent** : Epic #19 · `docs/PRD_V2.md` · Milestone **Bloc 2 — Pharmacies & Contacts**  
**Blocked by** : — (première issue du bloc)

---

## Milestone — ordre recommandé

| # | Issue | Titre |
|---|-------|-------|
| 1 | **#155** | Page `/pharmacies/new` dédiée ← **cette session** |
| 2 | #156 | Page `/contacts/new` dédiée |
| 3 | #158 | Tableau pharmacies + filtres multi |
| 4 | #159 | Tableau contacts + filtres multi |
| 5 | #162 | Export CSV pharmacies filtrée (blocked #158, #149) |
| 6 | #163 | Export CSV contacts filtrée (blocked #159, #149) |
| 7 | #173 | Détection et fusion doublons Pharmacy |

Référence dépendances transverses : `docs/ISSUE_DEPENDENCIES.md` · patterns liste/filtres Bloc 1 : handoffs #147, #148, #157.

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#155) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Handoffs utiles :
- `docs/handoffs/HANDOFF_ISSUE_154.md` — pattern page `/candidats/new` (remplace modale)
- `docs/handoffs/HANDOFF_ISSUE_059.md` — module pharmacies existant (SIRET, fiche)

Contexte : remplacer modale création pharmacie par route `/pharmacies/new`. Conserver enrichissement SIRET + calcul TVA. Cleanup modales liste/accueil → redirect page dédiée. **Création inline depuis fiche pharmacie inchangée** (décision interview #156 — même logique contacts).

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
git checkout -b feat/issue-155-pharmacies-new-page origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #155`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
