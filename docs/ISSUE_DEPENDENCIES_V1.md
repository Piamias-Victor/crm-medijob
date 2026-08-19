# Graphe de dépendances — Issues CRM MediJob V1 Opérationnel

> **Epic parente** : [#210 — PRD V1 Opérationnel](https://github.com/Piamias-Victor/crm-medijob/issues/210)  
> **Sources** : `docs/PRD_V1_OPERATIONNEL.md` · `docs/PRD_JOB_BOARD_V1.md` (#321) · `docs/Guide_CRM_V1_Operationnel.csv` · `docs/grill/CSV_V1_DECISIONS.md`  
> **25 slices** (22 AFK `ready-for-agent` · 3 HITL `ready-for-human`)

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
| 15 | #226 | HITL | [CANDIDATS] Fiche d’entretien intégrée (champs medijob-eval) — children #297–#303, follow-up admin trames #312–#315 |
| 16 | #227 | AFK | [MISSIONS] Tableau + filtres CSV + profilRecherche |
| 17 | #228 | AFK | [MAPS] Vues map Pharmacies / Candidats / Missions |
| 18 | #229 | AFK | [OFFRES] Génération IA + cycle de vie + liste/actions |
| 19 | #230 | AFK | [OFFRES] Publish/unpublish job board (`offres`) |
| 20 | #231 | AFK | [CANDIDATURES] Ingest `candidatures` + inbox accept/refus/dédup |
| 21 | #232 | AFK | [IA] Matching critères prétentions + multi-select contact |
| 22 | #233 | AFK | [IA] CR hebdo data-driven + raccourci meilleurs profils P2 |
| 23 | #218 | AFK | [DASHBOARD] KPI CSV + centre d’alertes |
| 24 | #234 | HITL | [FINANCE] Perf + Facturation/Devis (inventaire proto) |
| 25 | #235 | HITL | [RGPD] Consentement / rétention / effacement / registre |

## Children of #226 (Interview)

| Slice | GitHub | Type | Titre |
|-------|--------|------|-------|
| A | #297 | AFK | [CANDIDATS][Interview] Fondations — entité, seed trames/JobTitles, onglet vide |
| B | #298 | AFK | [CANDIDATS][Interview] Démarrer un entretien — create Candidate + DRAFT |
| C | #299 | AFK | [CANDIDATS][Interview] Déduplication à l’ouverture |
| D | #300 | AFK | [CANDIDATS][Interview] Parcours réponses + autosave |
| E | #301 | AFK | [CANDIDATS][Interview] Clôture — score, mapping profil, status |
| F | #302 | AFK | [CANDIDATS][Interview] PDF compte-rendu |
| G | #303 | AFK | [CANDIDATS][Interview] IA optionnelle OpenRouter |
| H | #312 | AFK | [CANDIDATS][Interview] Pin version trame + seed fill-only |
| I | #313 | AFK | [CANDIDATS][Interview] Admin trames — copie de travail + Publier |
| J | #314 | AFK | [CANDIDATS][Interview] Créer et archiver une trame |
| K | #315 | AFK | [CANDIDATS][Interview] Dupliquer / insérer questions depuis une autre trame |

## Children of #321 (Job board)

| Slice | GitHub | Type | Titre |
|-------|--------|------|-------|
| A | #230 | AFK | [OFFRES] Publish/unpublish job board (`offres`) |
| B | #231 | AFK | [CANDIDATURES] Ingest `candidatures` + inbox accept/refus/dédup |

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
#297  →  (aucun)           # children of #226 [Interview]
#298  →  #297
#299  →  #298
#300  →  #298
#301  →  #300
#302  →  #301
#303  →  #301
#312  →  (aucun)           # admin trames follow-up
#313  →  #312
#314  →  #313
#315  →  #313
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
