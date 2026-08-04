# Backlog QA V1 — inventaire exhaustif (session 03/08 + notes)

Source : `docs/testing-results/medijob-tests-2026-08-03.json`  
Note session Victor : *« Les loaders sont encore adaptés au design card alors que maintenant on est en design tableau »*

Légende statut code (au 04/08, après PR #259) :
- ✅ corrigé en code (à **revalider** sur preview git-dev)
- ❌ **pas fait** / ouvert
- ⚠️ partiel / infra / besoin clarif produit
- 📦 hors scope test (sections jamais jouées)

---

## A. Note globale session (jamais traité comme ticket)

| # | Demande | Statut |
|---|---------|--------|
| A1 | **Loaders encore style “card”** alors que listes = **tableau** — aligner skeletons/loaders sur le design table | ❌ |

---

## B. Auth / mail

| # | Demande | Statut |
|---|---------|--------|
| B1 | Mail reset mot de passe n’arrive pas | ⚠️ infra Resend / config — UI forgot OK ; pas un bug produit seul |

---

## C. Pharmacies

| # | Demande | Statut |
|---|---------|--------|
| C1 | Filtres : clear région (et autres) → boucle on/off | ✅ (#259) — retester |
| C2 | Carte : « Aucun point géolocalisé » | ✅ seed lat/lng (#259) — retester + reseed |
| C3 | Fichier CSV d’exemple pour tester l’import | ❌ |
| C4 | Doublon SIRET create → fusion (pas toast seul) | ✅ guard create (#259) — retester |
| C5 | Soft delete invisible même admin/testeur | ✅ bouton fiche (#259) — retester |
| C6 | Onglet Besoins : missions ouvertes + type contrat (« pas compris ») | ⚠️ clarifier UX / vérifier comportement réel |
| C7 | Historique : ActivityLog + missions Pourvu/Annulée (« pas compris ») | ⚠️ idem |

---

## D. Candidats — liste

| # | Demande | Statut |
|---|---------|--------|
| D1 | Mêmes bugs filtres que pharmacies | ✅ même hook (#259) — retester |
| D2 | Carte candidats vide | ✅ (#259) — retester |
| D3 | **Candidatures reçues** : passer en **liste/tableau** comme onglet candidats (pas cards) | ❌ |

---

## E. Candidats — création / fiche

| # | Demande | Statut |
|---|---------|--------|
| E1 | Consentement RGPD **coché par défaut** à la création manuelle | ✅ (#259) — retester |
| E2 | Fusionner sur duplicate-review ne fait rien (Ignorer OK) | ✅ status Zod (#259) — retester |
| E3 | Import CV : accepter **JPEG** (etc.) comme document | ✅ JPG/WEBP (#259) — retester |
| E4 | Import CV : message IA « Réponse non valide » plus clair | ✅ msg amélioré (#259) |
| E5 | Import CV PDF : **signaler si doublon déjà existant** | ❌ / ⚠️ flow existe en théorie — **pas visible / pas fiable** selon QA |
| E6 | Fichier CSV candidats d’exemple pour tester | ❌ |
| E7 | Statut **Blacklisté** introuvable | ⚠️ option existe dans select — **UX découverte** à améliorer (label/aide) |
| E8 | Résumé IA : bouton **Enregistrer toujours grisé** (marche quand même) | ❌ |
| E9 | **Profil anonymisé** introuvable | ✅ raccourcis sur Profil (#259) — retester |
| E10 | Présenter à une pharmacie (mailto) : **mettre les noms** des gens | ❌ |
| E11 | Présentation dans un **périmètre** : idem noms manquants | ❌ |
| E12 | Onglet Documents : **CV accessible d’ici** aussi | ✅ (+ Profil) (#259) — retester |
| E13 | Bouton **Effacement RGPD hyper petit** (« miche ») | ❌ |

---

## F. Missions / Matching

| # | Demande | Statut |
|---|---------|--------|
| F1 | Carte missions vide | ✅ (#259) — retester |
| F2 | Création mission : **pas d’ouverture de la fiche** après create | ✅ redirect (#259) — retester |
| F3 | Champ « profil recherché » peu clair | ⚠️ wording / aide UI |
| F4 | Après Placé → Pourvu : **pipeline candidats vide** | ✅ (#259) — retester |
| F5 | Matching Email : ouvrir **Gmail** comme pharmacies | ✅ (#259) — retester |
| F6 | Deep links Email (même problème Gmail) | ✅ (#259) — retester |

---

## G. Sections jamais testées (à faire + bugs potentiels)

| # | Module | Statut |
|---|--------|--------|
| G1 | Offres (liste, générer IA, publier/dépublier) | 📦 |
| G2 | Assistant IA (chat, raccourcis, rapport semaine…) | 📦 |
| G3 | Admin & RGPD (référentiels, users…) | 📦 |
| G4 | Matrice des rôles (4 comptes) | 📦 |
| G5 | E2E Staffing / CVthèque / Qualité données | 📦 |

---

## H. Priorité proposée (ce qui reste **ouvert**)

> Session 04/08 branche `fix/qa-backlog-p0-p1` — P0/P1 ci-dessous traités en code (à revalider preview).

### P0 — UX / design (ta note #1)
1. **A1** Loaders/skeletons : passer du style card → **table**

### P1 — bugs / manques clairement demandés
2. **D3** Inbox candidatures en liste/tableau  
3. **E8** Bouton Enregistrer résumé IA (état disabled faux)  
4. **E10 + E11** Mailto présentation : inclure **noms** des contacts/candidats  
5. **E13** Bouton RGPD plus visible  
6. **E5** Doublon explicite à l’import CV (feedback visible)  
7. **E7** Rendre Blacklisté évident (hint / ordre options / aide)

### P2 — assets / clarté
8. **C3 + E6** Fichiers CSV sample pharmacies + candidats  
9. **C6 + C7 + F3** Clarifier écrans Besoins / Historique / profil recherché (copy ou empty states)

### P3 — revalidation fixes #259
Tout le ✅ ci-dessus sur preview **git-dev** (pas prod `main`).

---

## Compte rendu honnête

Sur ~28 signaux QA :
- ~12 touchés en code (#259) → **à retester**, pas “clos”
- ~10+ encore **ouverts** (loaders, inbox liste, résumé IA, mailto noms, RGPD bouton, CSV samples, doublon CV visible…)
- ~7 modules **jamais joués**

Tu avais raison : une grosse partie des retours n’était pas encore traitée.
