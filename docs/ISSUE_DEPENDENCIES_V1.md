# Graphe de dépendances — Issues CRM MediJob V1 Opérationnel

> **Epic parente** : [#210 — PRD V1 Opérationnel](https://github.com/Piamias-Victor/crm-medijob/issues/210)  
> **Sources** : `docs/PRD_V1_OPERATIONNEL.md` · `docs/Guide_CRM_V1_Operationnel.csv` · `docs/grill/CSV_V1_DECISIONS.md`  
> **25 slices** (21 AFK `ready-for-agent` · 4 HITL `ready-for-human`)

## Mapping

| Slice | GitHub | Type | Titre |
|-------|--------|------|-------|
| 1 | #211 | AFK | [DESIGN] Palette Medijob CSV + logo tokens |
| 2 | #212 | AFK | [AUTH] Reset password email + idle logout 30 min |
| 3 | #213 | AFK | [AUTH] 4 UserRoles + permission matrix + gate CA/Marge |
| 4 | #219 | AFK | [TRANSVERSE] Referent optionnel Pharmacy/Contact + filtres |
| 5 | #214 | AFK | [TRANSVERSE] Recherche globale 4 entités |
| 6 | #215 | AFK | [TRANSVERSE] Panneau vue rapide générique (+ pharmacie) |
| 7 | #216 | AFK | [TRANSVERSE] ActivityLog auto create/update |
| 8 | #217 | AFK | [TRANSVERSE] Aperçu documents PDF/image |
| 9 | #220 | AFK | [PHARMACIES] Colonnes/filtres CSV + statut Client |
| 10 | #221 | AFK | [PHARMACIES] Historique mixte + type contrat dans Besoins |
| 11 | #222 | AFK | [PHARMACIES] Import CSV + dédup/fusion |
| 12 | #223 | AFK | [CONTACTS] Liste/filtres CSV + admin Contact role référentiel |
| 13 | #224 | AFK | [CANDIDATS] Statut CSV + prétentions + colonnes/filtres/vue rapide |
| 14 | #225 | AFK | [CANDIDATS] Timeline historique + import CSV + fusion |
| 15 | #226 | HITL | [CANDIDATS] Fiche d’entretien intégrée (champs medijob-eval) |
| 16 | #227 | AFK | [MISSIONS] Tableau + filtres CSV + profilRecherche |
| 17 | #228 | AFK | [MAPS] Vues map Pharmacies / Candidats / Missions |
| 18 | #229 | AFK | [OFFRES] Génération IA + cycle de vie + liste/actions |
| 19 | #230 | HITL | [OFFRES] Publish/unpublish CMS (Webflow hypo) |
| 20 | #231 | AFK | [CANDIDATURES] Webhook + inbox tableau accept/refus/dédup |
| 21 | #232 | AFK | [IA] Matching critères prétentions + multi-select contact |
| 22 | #233 | AFK | [IA] CR hebdo data-driven + raccourci meilleurs profils P2 |
| 23 | #218 | AFK | [DASHBOARD] KPI CSV + centre d’alertes |
| 24 | #234 | HITL | [FINANCE] Perf + Facturation/Devis (inventaire proto) |
| 25 | #235 | HITL | [RGPD] Consentement / rétention / effacement / registre |

## Blocked by

```
#211  →  (aucun)
#212  →  (aucun)
#213  →  (aucun)
#214  →  (aucun)
#215  →  (aucun)
#216  →  (aucun)
#217  →  (aucun)
#218  →  (aucun)

#219  →  #213
#220  →  #219, #215
#221  →  #216
#222  →  #220
#223  →  #219, #215
#224  →  #219, #215
#225  →  #216, #224
#226  →  #224
#227  →  #219, #215
#228  →  #220, #224, #227
#229  →  #227
#230  →  #229
#231  →  #230, #224
#232  →  #224, #227
#233  →  #232
#234  →  #213
#235  →  #213
```

## Prompts

`docs/prompts/pending/PROMPT_ISSUE_{NNN}.md` — une issue = un prompt.
