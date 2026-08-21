# Questions client — Guide CRM V1 Opérationnel

À envoyer au client pour lever les ambiguïtés du CSV.  
Complété au fil de la session grill. Les items tranchés en interne sont retirés ou marqués ✅.

---

## Rôles & permissions (V1-002)

### Q1 — Qui voit CA et Marge ? ✅ TRANCHÉ (interne)
| Rôle | CA | Marge |
|------|----|-------|
| Direction | oui | oui |
| RH-Admin | oui | oui |
| Recruteur | non | non |
| Communication | non | non |

### Q2 — Matrice d'actions par module ⏳ À CONFIRMER
Voici la matrice que nous proposons. Merci de **valider ou corriger** :

| Action | Direction | Recruteur | Communication | RH-Admin |
|--------|-----------|-----------|---------------|----------|
| CRM ops (CRUD Pharmacies / Contacts / Candidats / Missions) | oui | oui | lecture seule | oui |
| Matching + rattacher candidats | oui | oui | non | oui |
| Offres : rédiger / publier / dépublier | oui | oui | oui | oui |
| Candidatures site : accept / refus | oui | oui | non | oui |
| Admin référentiels (métiers, pipeline, LGO…) | oui | non | non | oui |
| Gestion utilisateurs | oui | non | non | oui |
| Soft delete entités | oui | non | non | oui |
| Dashboard KPI (hors CA / Marge) | oui | oui | oui | oui |


### Q3 — Migration des comptes existants ✅ N/A
Repartir de zéro sur la DB — pas de migration de comptes. Seeds manuels des 4 rôles.

---

*Suite : autres ambiguïtés CSV ajoutées au fil du grill.*

---

## RGPD (V1-010)

### Q4 — Consentement ✅ TRANCHÉ
Oui pour **candidats** seulement.
- Candidature site → consentement obligatoire (quand intake existera) : `consentGivenAt` + `consentSource=SITE`
- Création manuelle / import CV → case optionnelle → `MANUAL` / `IMPORT`
- Contacts pharmacie → non en V1

### Q5 — Durée de conservation ✅ TRANCHÉ
| Donnée | Durée |
|--------|--------|
| Candidats inactifs | 24 mois puis revue |
| Blacklistés | 36 mois puis revue |
| Candidatures refusées | 12 mois |
| Pharmacies inactives | pas de purge auto |
| RIB post-mission | 12 mois |

V1 : alert-only (`docs/gdpr/RETENTION.md`), pas de purge silencieuse.

### Q6 — Droit à l'effacement ✅ TRANCHÉ
Action **Effacement RGPD** in-app : hard delete cascade (DB + Blob) + audit sans PII.
Rôles : **Direction + RH-Admin**. Soft delete ops ≠ oubli. Amendement ADR-0007.

### Q7 — Registre des traitements ✅ TRANCHÉ
Externe (Notion / PDF). Lien admin `/admin/rgpd` via `RGPD_REGISTER_URL`. Pas d’écran registre in-app V1.

---

## Maps pharmacies (ajouts CSV)

### Q8 — Statuts carte pharmacies
Sur la map, le brief cite « Clients, en contact, partenaire… ».  
Nos statuts CRM sont **Client / Prospect / Inactif**. Faut-il d’autres statuts, ou ces 3 suffisent pour filtrer la carte ?

---

## Offres / site (V1-050)

### Q9 — CMS du site Medijob
La diffusion des offres est prévue via **Webflow CMS**. Confirmez-vous que le site carrières / offres est toujours sur Webflow ? Sinon, quel outil / API faut-il brancher ?

---

## Matching — contact candidats (V1-055)

### Q10 — SMS / Email / WhatsApp depuis le matching
Depuis l’écran matching, sélection multiple puis contact. Trois options techniques :

**A.** Liens natifs (`mailto:`, `sms:`, WhatsApp Web `wa.me`) — simple, pas d’abonnement, envoi depuis le téléphone/mail du recruteur  
**B.** Envoi email transactionnel (Resend) depuis le CRM + ActivityLog auto  
**C.** SMS / WhatsApp via prestataire (Twilio, etc.) — coût + compte Business

Que souhaitez-vous en V1 ? (plusieurs canaux possibles)

---

## Dashboard (V1-067)

### Q11 — Relances en retard
Le centre d’alertes cite les « relances en retard ». Quelle règle exacte ?
Ex. : pas d’ActivityLog depuis X jours sur mission à pourvoir / candidat en process / autre ?

---

## Fiche d’entretien (ajout CSV)

### Q12 — Proto medijob-eval
Confirmez que https://medijob-eval.netlify.app/ est la référence des champs d’entretien à intégrer dans la fiche candidat. L’outil Netlify doit-il rester utilisé en parallèle, ou le CRM le remplace ?

#### Answer (2026-08-17)
**CRM remplace** l’outil Netlify ; **tous les profils** sont in scope (pharmacien, préparateur, étudiant, conseiller_para, rayonniste). Confirmé par Victor.

---

## Finance / performance (ajout CSV)

### Q13 — Proto op-medijob
Le CSV demande le tableau de suivi perf + Facturation/Devis (https://op-medijob.netlify.app).
Quels écrans / indicateurs / entités (devis, factures, CA, marge) doivent être dans le CRM V1 ? Tout le proto, ou un sous-ensemble ?

#### Answer (2026-08-19)
**Sous-ensemble CRM-native** — pas tout le proto, pas d’iframe Netlify. Confirmé grill (Victor).

V1 = **Devis** first-class sur la **Mission** (prix libre, PDF + Gmail) + **Facturation** (stats + liste) pour Direction / RH-Admin. **Commercial status** parallèle au Mission status. CA = montant du Devis **accepté** (une fois, date d’acceptation) ; Marge saisie manuelle ; Facturé = marque + date. Annulée → CA 0. Pas d’estimateur candidat, pas de coupe par candidat, pas d’entité Facture, pas d’admin tarifs.

Spec : `docs/PRD_FINANCE_DEVIS_V1.md`.

