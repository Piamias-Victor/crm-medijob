# Grill CSV V1 Opérationnel — décisions

Source : `Guide CRM - V1 - Opérationnel.csv`

## V1-001 — Connexion sécurisée
**Décision :** conserver login email + mot de passe existant ; ajouter réinitialisation mot de passe par email (lien one-shot) ; déconnexion automatique après 30 min d’inactivité (idle).
**Statut code :** login OK ; reset + idle logout à faire.

## V1-002 — Rôles et permissions
**Décision :** adopter les 4 rôles CSV — Direction / Recruteur / Communication / RH-Admin. Abandon du modèle legacy `ADMIN` | `RECRUTEUR`. Matrice de droits par module à définir (suite grill).
**CONTEXT :** termes UserRole + Referent mis à jour.

### V1-002 — Visibilité
**Décision :** pas de cloisonnement général par référent. En revanche, **CA et Marge** sont soumis à un droit de vue selon le rôle. Les **actions** (CRUD, admin, publication…) sont aussi différenciées par rôle.
**Ouvert :** matrice exacte rôle × (vue CA/Marge + actions) — questions client si pas tranché en grill.

### V1-002 — Vue CA / Marge
**Décision :**
| Rôle | CA | Marge |
|------|----|-------|
| Direction | oui | oui |
| RH-Admin | oui | oui |
| Recruteur | non | non |
| Communication | non | non |

### V1-002 — Matrice d’actions (hypothèse de travail)
**Décision interne (à confirmer client) :**
| Action | Direction | Recruteur | Communication | RH-Admin |
|--------|-----------|-----------|---------------|----------|
| CRM ops CRUD | oui | oui | lecture seule | oui |
| Matching + rattacher | oui | oui | non | oui |
| Offres rédiger/publier | oui | oui | oui | oui |
| Candidatures accept/refus | oui | oui | non | oui |
| Admin référentiels | oui | non | non | oui |
| Gestion utilisateurs | oui | non | non | oui |
| Soft delete entités | oui | non | non | oui |
| Dashboard KPI (hors CA/Marge) | oui | oui | oui | oui |

### V1-002 — Comptes / DB
**Décision :** repartir de zéro sur la DB (pas de migration de data existante). Mapping legacy sans objet opérationnel ; seeds : créer les 4 rôles à la main. Si un mapping était besoin : ADMIN→RH-Admin, RECRUTEUR→Recruteur.

## V1-003 — Menu + recherche globale
**Décision :** conserver la nav actuelle (Accueil, Candidats, Pharmacies, Contacts, Missions, Offres, Assistant, Admin). Ajouter recherche globale multi-entités : Pharmacie, Contact, Candidat, Mission uniquement (pas Offres / Applications en V1).

## V1-004 — Identité visuelle
**Décision :** remapper les tokens CSS sur la palette CSV — teal #0C2F37, mint #5AE2A1, sky #73C6EF, rose #FE7CCA + logo Medijob. Réutiliser le design system atomic existant.

## V1-005 — Schéma de base
**Décision :** conserver le schéma Prisma existant comme base (entités CSV couvertes). Modifications / champs manquants traités ligne par ligne ensuite.

## V1-006 — Recruteur référent
**Décision :** `referentId` sur Pharmacie, Contact, Candidat, Mission — **optionnel**. Ajouter sur Pharmacy + Contact (manquant). Filtrable sur toutes les listes. UX : préremplir avec l’utilisateur connecté sans forcer.

## V1-007 — Vue rapide
**Décision :** panneau latéral d’aperçu sans quitter la liste, réutilisé sur les listes ops (+ Offres). Bouton vers fiche complète.

## V1-008 — Historique horodaté
**Décision :** traçabilité auto — à chaque create/update d’entité, entrée système dans ActivityLog (« Fiche créée » / « Fiche modifiée par [user] »). Pas de diff champ-par-champ en V1. En plus des ActivityLog métier (appel, email, note…).

## V1-009 — Documents
**Décision :** couvert sur Pharmacie / Contact / Mission / Candidat (upload, download, delete). **À ajouter :** aperçu in-app (PDF/image). Pas de docs sur Offre / User en V1.

## V1-010 — RGPD
**Décision :** non figé en interne — questions client. Soft delete existant ≠ conformité complète.

## V1-011 — Colonnes liste pharmacies
**Décision :** garder colonnes actuelles + ajouter manquantes CSV : code postal, date d'ajout, recruteur référent, bouton vue rapide.

## V1-012 — Filtres pharmacies
**Décision :** ajouter ville, région, recruteur référent ; garder filtres existants (dont missions actives).

## V1-013 — Vue rapide pharmacie
**Décision :** panneau = coordonnées, contacts principaux, besoins en cours, dernière action + lien fiche complète.

## V1-014 — SIRENE
**Décision :** fonctionnellement couvert. Possible polish UI/UX du flow recherche/préremplissage (pas de nouveau backend).

## V1-015 — Champs complémentaires pharmacie
**Décision :** couvert (titulaire = Contact isPrimary / TITULAIRE).

## V1-016 — Statut pharmacie
**Décision :** aligner sur CSV — Client / Prospect / Inactif. Label (et enum si besoin) : ACTIF → Client.

## V1-017 — Bloc Contacts pharmacie
**Décision :** couvert (onglet Contacts fiche pharmacie).

## V1-018 — Historique pharmacie
**Décision :** timeline mixte ActivityLog + missions terminées (POURVU / ANNULÉE), chronologique. Besoins ouverts restent dans onglet Besoins.

## V1-019 — Documents pharmacie
**Décision :** couvert (catégories OK). Seul gap = aperçu (V1-009).

## V1-020 — Besoins en cours
**Décision :** couvert (missions non terminales + statuts). À améliorer UI : type de contrat visible (groupement par type optionnel).

## V1-021 — Import pharmacies
**Décision :** import CSV only (pas xlsx natif). Mapping colonnes + contrôle format. Dédup SIRET ou nom+ville+CP → écran fusion.

## V1-021 — Import pharmacies (confirm)
**Confirmé :** CSV only + dédup/fusion.

## V1-022 — Colonnes liste contacts
**Décision :** ajouter nom/prénom séparés + vue rapide ; garder badge principal.

## V1-023 — Filtres contacts
**Décision :** ajouter ville + recruteur référent ; garder extras (statut pharmacie, principal).

## Mode batch
Session passée en validation par lots (OK / écarts / questions client).

## LOT A — Contacts V1-024 → V1-028
- **V1-024** : couvert (+ référent optionnel)
- **V1-025** : couvert (pharmacie obligatoire)
- **V1-026** : référentiel admin ContactRole (CRUD comme métiers) — seed : titulaire, pharmacien adjoint, préparateur référent, RH, comptabilité, autre. Remplace l’enum fixe.
- **V1-027** : historique = ActivityLog (+ auto V1-008) ; pas de timeline missions sur le contact
- **V1-028** : docs OK (+ aperçu V1-009)

## LOT B — Candidats V1-029 → V1-040
- **V1-029** : + date ajout + vue rapide ; garder extras
- **V1-030** : + ville, mobilité, statut (via V1-039)
- **V1-031** : vue rapide contenu CSV
- **V1-032–035, 037** : couverts
- **V1-036** : timeline ActivityLog + missions (positionnements)
- **V1-038** : CV = cvUrl ; autres docs = Document
- **V1-039** : statut CSV Nouveau / À qualifier / Qualifié / En mission / Inactif / Blacklisté. « En mission » = auto si positionné sur mission non terminale (surcharge manuelle Inactif/Blacklisté possible)
- **V1-040** : import CSV + dédup email/tél + fusion

## LOT C — Maps
- 3 vues Map (Pharmacies, Candidats, Missions) toggle liste/carte
- Filtres pharmacies map = Client / Prospect / Inactif (pas de nouveaux statuts « en contact / partenaire » sans confirmation client)
- Géocode lat/lng Pharmacy + Candidate ; Mission = coords pharmacie
- Provider : Mapbox ou Leaflet+OSM (choix technique plus tard)


## LOT D — Missions V1-041 → V1-047
- **V1-041** : tableau colonnes CSV + vue rapide ; kanban en toggle optionnel
- **V1-042** : tous filtres CSV
- **V1-043** : + champ dédié profilRecherche
- **V1-044–047** : couverts (garder Vacation)

## LOT E — Offres V1-048 → V1-052
- Module Offres complet : génération IA, cycle de vie, liste, actions, soft delete
- Diffusion = Webflow (hypothèse de travail) — à confirmer client (Q9)

## LOT F — Matching V1-053 → V1-056
- **V1-053, 056** : couverts
- **V1-054** : + champ prétentions salariales sur Candidate ; critères matching enrichis
- **V1-055** : multi-select contact — mode d’envoi (deep links vs API SMS/WhatsApp) → Q10 client

## LOT G — Candidatures V1-057 → V1-060
- Inbox tableau colonnes CSV complètes
- Accept : créer ou rattacher + CV ; dédup branchée
- Refus : statut REFUSEE / soft delete avec trace stats
- Livrer avec Offres + webhook Webflow

## LOT H — Assistant V1-061 → V1-065
- 061–063 : couverts
- 064 P2 : raccourci assistant → matching existant
- 065 : CR hebdo data-driven filtré par référent

## LOT H confirmé par user

## LOT I — Dashboard + ajouts (en attente confirm Finance in-scope)
- **V1-066** : KPI CSV sur accueil (à pourvoir, urgentes <48h, candidatures à traiter, taux remplissage)
- **V1-067** : centre d’alertes ; règle « relances en retard » → Q client
- **ADD Entretien** : champs intégrés CRM (pas iframe) depuis medijob-eval → Q inventaire champs
- **ADD Finance** : présent dans CSV (ligne manuelle) → in scope V1 sous réserve inventaire proto op-medijob + Facturation/Devis (Q client)

## LOT I — Dashboard + ajouts — CONFIRMÉ
- **V1-066 / V1-067** : KPI + centre d’alertes (Q11 relances)
- **ADD Entretien** : in scope — champs CRM (Q12)
- **ADD Finance** : **IN SCOPE V1** — Q13 tranché (2026-08-19) : sous-ensemble CRM-native, spec `docs/PRD_FINANCE_DEVIS_V1.md` (remplace HITL inventaire #234)
- Source de vérité CSV : `docs/Guide_CRM_V1_Operationnel.csv`

## Grill CSV V1 — STATUT
Toutes les lignes du CSV ont été traitées (décisions internes et/ou Q client).
Prochaines étapes : réponses client → `/to-prd` → `/to-issues`.
