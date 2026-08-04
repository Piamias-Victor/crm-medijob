# Retest QA V1 — uniquement ce qu’il reste à valider

**URL :** preview **git-dev** (après merge PR [#260](https://github.com/Piamias-Victor/crm-medijob/pull/260)) — **pas** prod `main`.

**Comptes seed :** `recruteur@…` / `direction@…` / `communication@…` / `admin@…` / `victorpiamiaspro@gmail.com`  
Mots de passe : `*-medijob-2026` / `tester-medijob-2026`

**CSV exemples :** [`docs/testing-samples/`](./testing-samples/)

Coche OK / KO. Rien d’autre à rejouer (OK du 03/08 hors liste = skip).

---

## 1. Loaders & listes

| # | Check | OK |
|---|--------|----|
| 1.1 | Candidats / Pharmacies / Missions : skeleton chargement = **tableau**, pas cards | ☐ |
| 1.2 | Onglet **Candidatures reçues** = **tableau** (pas cards) | ☐ |
| 1.3 | Filtres clear (région etc.) : **pas** de boucle on/off URL | ☐ |
| 1.4 | Cartes pharmacies / candidats / missions : pins visibles (reseed si vide) | ☐ |

## 2. Pharmacies

| # | Check | OK |
|---|--------|----|
| 2.1 | Create SIRET doublon → écran **fusion / review**, pas toast seul | ☐ |
| 2.2 | Soft delete visible admin/testeur sur fiche | ☐ |
| 2.3 | Import CSV avec `docs/testing-samples/pharmacies-exemple.csv` | ☐ |

## 3. Candidats — create / CV / fiche

| # | Check | OK |
|---|--------|----|
| 3.1 | Nouveau candidat : consentement RGPD **coché** par défaut | ☐ |
| 3.2 | Duplicate-review : **Fusionner** marche (pas seulement Ignorer) | ☐ |
| 3.3 | Créer via CV : **JPG/JPEG/WEBP** acceptés + hint formats | ☐ |
| 3.4 | Créer via CV (profil déjà en base) : **toast doublon** visible | ☐ |
| 3.5 | Import CSV avec `docs/testing-samples/candidats-exemple.csv` | ☐ |
| 3.6 | Statut : hint **Blacklisté** ; fiche BLACKLISTE → chip header | ☐ |
| 3.7 | Résumé IA : après generate → bouton **Enregistré** ; edit → **Enregistrer** actif | ☐ |
| 3.8 | Profil : raccourcis **CV** + **profil anonymisé** | ☐ |
| 3.9 | Documents : CV accessible depuis l’onglet | ☐ |
| 3.10 | Bouton **Effacement RGPD** bien visible (pas minuscule) | ☐ |

## 4. Présentation email

| # | Check | OK |
|---|--------|----|
| 4.1 | Présenter à une pharmacie : **nom contact** affiché (Destinataire) | ☐ |
| 4.2 | Mailto / Gmail s’ouvre correctement | ☐ |
| 4.3 | Présentation périmètre : **noms** dans la liste + BCC | ☐ |

## 5. Missions / matching

| # | Check | OK |
|---|--------|----|
| 5.1 | Create mission → **ouvre la fiche** (redirect) | ☐ |
| 5.2 | Placé → Pourvu : pipeline **reste visible** (pas vide) | ☐ |
| 5.3 | Matching Email → **Gmail** (comme pharmacies) | ☐ |

---

## Hors scope ce retest (skip)

- Mail reset MDP (Resend infra)
- Offres / Assistant / Admin / matrice rôles (jamais joués — session séparée)
- Copy Besoins / Historique / « profil recherché » (clarif produit, pas bug bloquant)

---

## Résultat session

Date : ________  
Preview URL : ________  
KO bloquants : ________  
