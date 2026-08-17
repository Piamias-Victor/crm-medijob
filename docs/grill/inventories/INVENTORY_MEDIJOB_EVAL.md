# Inventory — medijob-eval.netlify.app

> **Décision CRM (confirmée Victor 2026-08-17) :** le CRM **remplace** l'outil Netlify d'évaluation. **Tous les profils sont in scope** : pharmacien, préparateur, étudiant, conseiller_para, rayonniste.

## Coverage par profil

| profileId | Coverage | Counts |
|---|---|---|
| `pharmacien` | API complete (cdd_cdi + interim) + bundle script_officielle + scored duplicates | API: 2 tpl · Bundle unique items: **66** · with `?`: **48** · **+32** qmark vs prior extract |
| `preparateur` | Bundle only — 3 variants; not in public `/api/templates` | API: 0 tpl · Bundle unique items: **61** · with `?`: **47** · **+33** qmark vs prior extract |
| `etudiant` | Bundle only — 3 variants; not in public `/api/templates` | API: 0 tpl · Bundle unique items: **61** · with `?`: **44** · **+30** qmark vs prior extract |
| `conseiller_para` | Bundle only — 2 variants; not in public `/api/templates` | API: 0 tpl · Bundle unique items: **35** · with `?`: **33** · **+18** qmark vs prior extract |
| `rayonniste` | Bundle only — 2 variants; not in public `/api/templates` | API: 0 tpl · Bundle unique items: **35** · with `?`: **33** · **+18** qmark vs prior extract |

### Additional questions recovered (this pass vs prior extract)

| profileId | + questions (`?`) | + total texts | prior → now unique items |
|---|---:|---:|---|
| `pharmacien` | **+32** | +34 | 30 → 64 |
| `preparateur` | **+33** | +35 | 24 → 59 |
| `etudiant` | **+30** | +32 | 27 → 59 |
| `conseiller_para` | **+18** | +20 | 13 → 33 |
| `rayonniste` | **+18** | +20 | 13 → 33 |

Method: balanced-brace parse of `profileId` / `id`+`sections` objects in `eval.js` only (no cross-profile windows).

## Architecture observée

- SPA **Vite** (bundle `/assets/index-*.js`), hébergé Netlify
- API Netlify Functions `/api/*`
- Health : model **`claude-sonnet-4-5`**, `hasKey=True`
- Tool4Staffing : configured=`True`, apiBase=`https://app-v4.tool4staffing.com/api/v2`
- Routes SPA : 23 · API paths : 20

## Workflow (trame → réponses → CV+IA → PDF)

1. Choix profil / mode (trame)
2. Saisie réponses (questions + suggested answers / scoring B1–C5)
3. Enrichissement CV + génération IA (`/api/score`, `/api/qualify-project`)
4. Export PDF / push Tool4Staffing (`/api/t4s/*`)
5. Persistance évaluations (`/api/evaluations` — auth)

## Critères de scoring (B1–C5)

- **B1** — Expérience en officine
- **B2** — Autonomie & responsabilité
- **B3** — Outils & périmètre technique
- **B4** — Disponibilité
- **B5** — Réactivité / dernière minute
- **C1** — Communication & clarté
- **C2** — Professionnalisme & savoir-être
- **C3** — Adaptabilité / intégration
- **C4** — Fiabilité perçue
- **C5** — Posture de service & relation patient

## Pharmacien — inventaire API (référence complete)

Public `/api/templates` expose **uniquement** pharmacien (`cdd_cdi` + `interim`).

### Pharmacien(ne) — mode `cdd_cdi` (`profileId=pharmacien`) — **source: API `/api/templates` (complete)**

Recrutement CDI/CDD — trame long terme (motivations, projet, réalisations).

#### Parcours & situation _B1_

- **pharm_q1** [B1] Êtes-vous en poste actuellement ? Adjoint, titulaire ou remplaçant ?
  - `weak` 4 pts — **En recherche**: En recherche active, sans poste actuel.
  - `ok` 8 pts — **Remplaçant occasionnel**: Remplaçant ponctuel.
  - `good` 12 pts — **Adjoint salarié**: Adjoint en CDI ou CDD long.
  - `excellent` 12 pts — **Titulaire / remplaçant régulier**: Titulaire ou remplaçant régulier établi.
- **pharm_q2** [B1] Depuis combien d’années exercez-vous en officine ?
  - `weak` 0 pts — **Aucune**: Aucune expérience post-thèse.
  - `ok` 4 pts — **< 1 an**: Moins d’un an d’exercice.
  - `good` 8 pts — **1 à 3 ans**: Entre 1 et 3 ans d’exercice.
  - `excellent` 12 pts — **> 3 ans**: Plus de 3 ans d’exercice, parcours stable.
- **pharm_q3** [C3] Quels types et tailles d’officines avez-vous connus ?
  - `weak` 0 pts — **Un type**: Un seul type d’officine.
  - `ok` 3 pts — **Variés**: 2 ou 3 contextes différents.
  - `good` 5 pts — **Plusieurs tailles + types**: Plusieurs tailles et types d’officines.
  - `excellent` 7 pts — **Toutes tailles + forte affluence**: Petites, moyennes, grandes officines dont forte affluence.

#### Diplôme & profil

- **pharm_q4** [] Êtes-vous inscrit(e) à l’Ordre des pharmaciens ? Section A (adjoint) ou D ?
  - `weak` 0 pts — **Non inscrit(e)**: Pas d’inscription à l’Ordre.
  - `excellent` 0 pts — **Section A**: Inscrit(e) à l’Ordre, section A (adjoint).
  - `excellent` 0 pts — **Section D**: Inscrit(e) à l’Ordre, section D.
- **pharm_q5** [] Avez-vous soutenu votre thèse et obtenu le Diplôme d’État de docteur en pharmacie ?
  - `weak` 0 pts — **Pas de Diplôme d’État**: Thèse non soutenue / Diplôme d’État non obtenu.
  - `excellent` 0 pts — **Diplôme d’État obtenu**: Thèse soutenue et Diplôme d’État obtenu.

#### Compétences métier _B2 · B3_

- **pharm_q6** [B2] Avez-vous déjà remplacé un titulaire ? Sur quelles durées ? Seul(e) responsable de l’officine ?
  - `weak` 0 pts — **Jamais**: Jamais remplacé un titulaire.
  - `ok` 6 pts — **Quelques jours**: Quelques remplacements courts, sans responsabilité totale.
  - `good` 12 pts — **Remplacements moyens**: A déjà été seul(e) responsable sur des durées de 1 à 2 semaines.
  - `excellent` 18 pts — **Remplacements longs et réguliers**: Remplacements longs réguliers, gestion complète de l’officine.
- **pharm_q7** [B2] Avez-vous géré une équipe (préparateurs, étudiants), les plannings, les commandes ?
  - `weak` 0 pts — **Jamais**: Pas de management d’équipe.
  - `ok` 6 pts — **Un peu**: A déjà encadré ponctuellement.
  - `good` 12 pts — **Régulièrement**: Gestion équipe + plannings + commandes en place.
  - `excellent` 18 pts — **Gestion complète d’officine**: A piloté équipe, plannings, commandes, fournisseurs.
- **pharm_q8** [B3] Êtes-vous formé aux nouvelles missions officinales ? Si oui, lesquelles ?
  - `weak` 0 pts — **Non formé**: Pas formé aux nouvelles missions.
  - `ok` 4 pts — **1 à 2 missions**: Formé(e) à 1 ou 2 missions (ex. vaccination).
  - `good` 7 pts — **Plusieurs missions**: Formé(e) à plusieurs missions officinales.
  - `excellent` 10 pts — **Toutes missions à jour**: Formé(e) à toutes les missions officinales courantes, à jour.
- **pharm_q9** [B3] Quels logiciels métier maîtrisez-vous ?
  - `weak` 0 pts — **Aucun**: Aucun logiciel maîtrisé.
  - `ok` 4 pts — **1 logiciel**: 1 logiciel maîtrisé.
  - `good` 7 pts — **2 logiciels**: 2 logiciels métier, polyvalent.
  - `excellent` 10 pts — **3+ logiciels**: 3 logiciels ou plus, s’adapte vite.

#### Projet professionnel long terme _B7 · Motivation_

- **pharmacien_cdi_projet_1** [B7] Où vous voyez-vous professionnellement dans 3 ans ?
  - `weak` 0 pts — **Réponse floue / évasive**: 
  - `ok` 4 pts — **Réponse correcte, générique**: 
  - `good` 6 pts — **Réponse solide, structurée**: 
  - `excellent` 8 pts — **Réponse remarquable, exemples concrets**: 
- **pharmacien_cdi_projet_2** [B7] Pourquoi cherchez-vous un CDI / CDD plutôt que de l’intérim ou de rester dans votre poste actuel ?
  - `weak` 0 pts — **Réponse floue / évasive**: 
  - `ok` 4 pts — **Réponse correcte, générique**: 
  - `good` 6 pts — **Réponse solide, structurée**: 
  - `excellent` 8 pts — **Réponse remarquable, exemples concrets**: 
- **pharmacien_cdi_projet_3** [B7] Sur quelle durée envisagez-vous de vous engager ?
  - `weak` 0 pts — **< 6 mois / test**: Engagement court, positionnement flou.
  - `ok` 3 pts — **1 an**: Engagement 1 an, souhaite voir.
  - `good` 6 pts — **2-3 ans**: Engagement 2 à 3 ans, projet moyen terme.
  - `excellent` 8 pts — **> 3 ans / long terme**: Vision long terme, souhaite s’installer.

#### Réalisations & gestion de situations _C2 · C3 · Type STAR_

- **pharmacien_cdi_star_1** [C2] Racontez-nous une situation professionnelle difficile que vous avez gérée : contexte, action, résultat.
  - `weak` 0 pts — **Réponse floue / évasive**: 
  - `ok` 4 pts — **Réponse correcte, générique**: 
  - `good` 6 pts — **Réponse solide, structurée**: 
  - `excellent` 8 pts — **Réponse remarquable, exemples concrets**: 
- **pharmacien_cdi_star_2** [C1] Racontez-nous une réussite dont vous êtes particulièrement fier·e.
  - `weak` 0 pts — **Réponse floue / évasive**: 
  - `ok` 4 pts — **Réponse correcte, générique**: 
  - `good` 6 pts — **Réponse solide, structurée**: 
  - `excellent` 8 pts — **Réponse remarquable, exemples concrets**: 
- **pharmacien_cdi_conflit** [C3] Comment gérez-vous un désaccord avec un collègue ou un supérieur ?
  - `weak` 0 pts — **Évite le conflit**: Préfère ne pas aborder les désaccords.
  - `ok` 3 pts — **S’adapte au cas par cas**: Aborde parfois, dépend du contexte.
  - `good` 5 pts — **Dialogue direct et respectueux**: Aborde le sujet directement, sans agressivité.
  - `excellent` 7 pts — **Recherche la solution + montre l’exemple**: Propose des solutions, formalise, apaise.

#### Alignement Medijob & partenariat _C4 · Fiabilité_

- **pharmacien_cdi_medijob** [C4] Que savez-vous de Medijob et de notre approche du recrutement en pharmacie ?
  - `weak` 0 pts — **Réponse floue / évasive**: 
  - `ok` 4 pts — **Réponse correcte, générique**: 
  - `good` 6 pts — **Réponse solide, structurée**: 
  - `excellent` 8 pts — **Réponse remarquable, exemples concrets**: 
- **pharmacien_cdi_officine_ideale** [B7] À quoi ressemble votre officine / environnement de travail idéal ?
  - `weak` 0 pts — **Réponse floue / évasive**: 
  - `ok` 4 pts — **Réponse correcte, générique**: 
  - `good` 6 pts — **Réponse solide, structurée**: 
  - `excellent` 8 pts — **Réponse remarquable, exemples concrets**: 
- **pharmacien_cdi_references** [C4] Pouvez-vous fournir des références professionnelles vérifiables ?
  - `weak` 0 pts — **Aucune**: Pas de référence à donner.
  - `ok` 3 pts — **Une référence**: Une référence disponible.
  - `good` 5 pts — **2-3 références**: 2 à 3 références professionnelles.
  - `excellent` 7 pts — **Plusieurs récentes + variées**: Plusieurs références récentes, postes variés.

#### Rémunération & conditions attendues _Négociation_

- **pharmacien_cdi_rem_attentes** [B7] Quelles sont vos attentes salariales détaillées (fixe, variable, coefficient CCN, avantages) ?
  - `weak` 0 pts — **Réponse floue / évasive**: 
  - `ok` 4 pts — **Réponse correcte, générique**: 
  - `good` 6 pts — **Réponse solide, structurée**: 
  - `excellent` 8 pts — **Réponse remarquable, exemples concrets**: 
- **pharmacien_cdi_preavis** [B4] Avez-vous un préavis à respecter ? Sous quel délai pouvez-vous démarrer ?
  - `ok` 3 pts — **3 mois de préavis**: Préavis long (3 mois), démarrage tardif.
  - `good` 5 pts — **1-2 mois**: Préavis standard (1 à 2 mois).
  - `good` 7 pts — **< 1 mois / négociable**: Préavis court ou négociable.
  - `excellent` 8 pts — **Immédiat**: Peut démarrer immédiatement.
- **pharmacien_cdi_essai** [C4] Comment abordez-vous la période d’essai ?
  - `ok` 3 pts — **Crainte / négociation**: Sujet sensible, demande à raccourcir.
  - `good` 5 pts — **Neutre**: Prend la période d’essai comme un standard.
  - `excellent` 7 pts — **Volontaire, opportunité mutuelle**: Voit la période d’essai comme un test à double sens, sereinement.

#### Mobilité géographique _B6_

- **pharmacien_cdi_mobilite** [B6] Êtes-vous prêt·e à déménager ou à faire une longue distance quotidienne pour ce poste ?
  - `weak` 0 pts — **Non, zone limitée**: Reste sur sa zone actuelle (< 20 km).
  - `ok` 3 pts — **Jusqu’à 30 min**: OK pour ~30 min de trajet quotidien.
  - `good` 5 pts — **Jusqu’à 1h**: OK pour jusqu’à 1h de trajet.
  - `excellent` 8 pts — **Déménagement possible**: Déménagement envisagé si le poste le justifie.

#### Application Medijob _Non scoré_

- **pharmacien_cdi_app_1** [] Avez-vous déjà téléchargé l’application MEDIJOB ?
  - `None` 0 pts — **Oui**: Déjà téléchargée.
  - `None` 0 pts — **Non**: Pas encore téléchargée.
- **pharmacien_cdi_app_2** [] Souhaitez-vous que je vous accompagne pour finaliser votre inscription ?
  - `None` 0 pts — **Oui**: Souhaite être accompagné(e).
  - `None` 0 pts — **Non**: Préfère finaliser seul(e).

### Pharmacien(ne) — mode `interim` (`profileId=pharmacien`) — **source: API `/api/templates` (complete)**

Adjoint, titulaire-remplaçant, missions officinales, gestion d’équipe.

#### Parcours & situation _B1_

- **pharm_q1** [B1] Êtes-vous en poste actuellement ? Adjoint, titulaire ou remplaçant ?
  - `weak` 4 pts — **En recherche**: En recherche active, sans poste actuel.
  - `ok` 8 pts — **Remplaçant occasionnel**: Remplaçant ponctuel.
  - `good` 12 pts — **Adjoint salarié**: Adjoint en CDI ou CDD long.
  - `excellent` 12 pts — **Titulaire / remplaçant régulier**: Titulaire ou remplaçant régulier établi.
- **pharm_q2** [B1] Depuis combien d’années exercez-vous en officine ?
  - `weak` 0 pts — **Aucune**: Aucune expérience post-thèse.
  - `ok` 4 pts — **< 1 an**: Moins d’un an d’exercice.
  - `good` 8 pts — **1 à 3 ans**: Entre 1 et 3 ans d’exercice.
  - `excellent` 12 pts — **> 3 ans**: Plus de 3 ans d’exercice, parcours stable.
- **pharm_q3** [C3] Quels types et tailles d’officines avez-vous connus ?
  - `weak` 0 pts — **Un type**: Un seul type d’officine.
  - `ok` 3 pts — **Variés**: 2 ou 3 contextes différents.
  - `good` 5 pts — **Plusieurs tailles + types**: Plusieurs tailles et types d’officines.
  - `excellent` 7 pts — **Toutes tailles + forte affluence**: Petites, moyennes, grandes officines dont forte affluence.

#### Diplôme & profil

- **pharm_q4** [] Êtes-vous inscrit(e) à l’Ordre des pharmaciens ? Section A (adjoint) ou D ?
  - `weak` 0 pts — **Non inscrit(e)**: Pas d’inscription à l’Ordre.
  - `excellent` 0 pts — **Section A**: Inscrit(e) à l’Ordre, section A (adjoint).
  - `excellent` 0 pts — **Section D**: Inscrit(e) à l’Ordre, section D.
- **pharm_q5** [] Avez-vous soutenu votre thèse et obtenu le Diplôme d’État de docteur en pharmacie ?
  - `weak` 0 pts — **Pas de Diplôme d’État**: Thèse non soutenue / Diplôme d’État non obtenu.
  - `excellent` 0 pts — **Diplôme d’État obtenu**: Thèse soutenue et Diplôme d’État obtenu.

#### Compétences métier _B2 · B3_

- **pharm_q6** [B2] Avez-vous déjà remplacé un titulaire ? Sur quelles durées ? Seul(e) responsable de l’officine ?
  - `weak` 0 pts — **Jamais**: Jamais remplacé un titulaire.
  - `ok` 6 pts — **Quelques jours**: Quelques remplacements courts, sans responsabilité totale.
  - `good` 12 pts — **Remplacements moyens**: A déjà été seul(e) responsable sur des durées de 1 à 2 semaines.
  - `excellent` 18 pts — **Remplacements longs et réguliers**: Remplacements longs réguliers, gestion complète de l’officine.
- **pharm_q7** [B2] Avez-vous géré une équipe (préparateurs, étudiants), les plannings, les commandes ?
  - `weak` 0 pts — **Jamais**: Pas de management d’équipe.
  - `ok` 6 pts — **Un peu**: A déjà encadré ponctuellement.
  - `good` 12 pts — **Régulièrement**: Gestion équipe + plannings + commandes en place.
  - `excellent` 18 pts — **Gestion complète d’officine**: A piloté équipe, plannings, commandes, fournisseurs.
- **pharm_q8** [B3] Êtes-vous formé aux nouvelles missions officinales ? Si oui, lesquelles ?
  - `weak` 0 pts — **Non formé**: Pas formé aux nouvelles missions.
  - `ok` 4 pts — **1 à 2 missions**: Formé(e) à 1 ou 2 missions (ex. vaccination).
  - `good` 7 pts — **Plusieurs missions**: Formé(e) à plusieurs missions officinales.
  - `excellent` 10 pts — **Toutes missions à jour**: Formé(e) à toutes les missions officinales courantes, à jour.
- **pharm_q9** [B3] Quels logiciels métier maîtrisez-vous ?
  - `weak` 0 pts — **Aucun**: Aucun logiciel maîtrisé.
  - `ok` 4 pts — **1 logiciel**: 1 logiciel maîtrisé.
  - `good` 7 pts — **2 logiciels**: 2 logiciels métier, polyvalent.
  - `excellent` 10 pts — **3+ logiciels**: 3 logiciels ou plus, s’adapte vite.

#### Disponibilités & mobilité

- **pharm_q10** [B4] À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?
  - `weak` 0 pts — **Flou**: Pas de visibilité claire.
  - `ok` 3 pts — **Contraintes**: Disponibilité limitée.
  - `good` 6 pts — **Bonne sous 2 sem**: Disponible sous 2 semaines.
  - `excellent` 8 pts — **Immédiate + large**: Immédiatement disponible, large amplitude.
- **pharm_q11** [B5] Acceptez-vous les missions de dernière minute ? Avec quel préavis ?
  - `weak` 0 pts — **Refuse**: Pas de missions express.
  - `ok` 3 pts — **Avec 24-48h**: OK avec 24 à 48h de préavis.
  - `excellent` 6 pts — **Régulièrement**: Accepte régulièrement les missions express.
- **pharm_q12** [B6] Quelle distance êtes-vous prêt(e) à parcourir ? Disposez-vous d’un véhicule ?
  - `weak` 0 pts — **< 10 km, sans véhicule**: Mobilité réduite.
  - `ok` 3 pts — **~20 km, TC**: ~20 km en TC.
  - `good` 5 pts — **~40 km + véhicule**: Jusqu’à 40 km, véhicule personnel.
  - `excellent` 8 pts — **> 40 km + véhicule**: Large mobilité, véhicule personnel.

#### Motivation & projet _B7_

- **pharm_q13** [B7] Qu’est-ce qui vous plaît dans le remplacement / l’intérim ?
  - `weak` 0 pts — **Flou**: Réponse vague.
  - `ok` 3 pts — **Liberté**: Liberté d’organisation.
  - `good` 6 pts — **Variété + projet**: Variété, en lien avec un projet.
  - `excellent` 8 pts — **Projet pro fort + critères clairs**: Projet professionnel fort, critères très clairs.
- **pharm_q14** [B7] Quel type de remplacement recherchez-vous (durée, autonomie, type d’officine) ?
  - `weak` 0 pts — **Pas d’avis**: Aucun critère exprimé.
  - `ok` 3 pts — **Préférence floue**: Préférence vague.
  - `good` 6 pts — **Critères clairs**: Critères clairs sur durée et autonomie.
  - `excellent` 8 pts — **Critères pros alignés**: Critères très clairs, alignés avec Medijob.
- **pharm_q15** [B7] Quelles sont vos attentes et vos critères prioritaires ?
  - `weak` 0 pts — **Aucune attente claire**: Aucune attente exprimée.
  - `ok` 3 pts — **Salaire surtout**: Attente principale = rémunération.
  - `good` 6 pts — **Équilibre + projet**: Équilibre vie pro / projet.
  - `excellent` 8 pts — **Critères pros structurés**: Attentes structurées, compatibles Medijob.

#### Savoir-être & adaptation _C1 · C2 · C3 · C4_

- **pharm_q16** [C3] Comment réagissez-vous lorsque vous intégrez une nouvelle équipe pour une mission courte ?
  - `weak` 0 pts — **Difficilement**: Adaptation difficile.
  - `ok` 3 pts — **Avec temps**: Adaptation correcte avec un peu de temps.
  - `good` 5 pts — **Bien**: Très bonne adaptation.
  - `excellent` 7 pts — **Immédiate**: Adaptation immédiate, à l’aise en multi-officines.
- **pharm_q17** [C3] Avez-vous déjà travaillé dans des officines à forte activité (plus de 600 patients / jour) ?
  - `weak` 0 pts — **Jamais**: Jamais en forte activité.
  - `ok` 3 pts — **Occasionnellement**: Quelques expériences en forte activité.
  - `good` 5 pts — **Régulièrement**: A travaillé régulièrement en forte activité.
  - `excellent` 7 pts — **Spécialiste très forte activité**: Habitué(e) aux officines > 600 patients/jour.
- **pharm_q18** [C3] Comment gérez-vous les périodes de forte affluence ?
  - `weak` 0 pts — **Mal**: Gestion difficile de l’affluence.
  - `ok` 3 pts — **Avec stress**: Gère mais avec stress.
  - `good` 5 pts — **Sereinement**: Gère sereinement les pics d’affluence.
  - `excellent` 7 pts — **Très sereinement**: Très à l’aise, peut piloter le rythme de l’équipe.
- **pharm_q19** [C4] Avez-vous déjà dû annuler une mission ? Dans quelles circonstances ?
  - `weak` 0 pts — **Plusieurs annulations**: Plusieurs annulations passées.
  - `ok` 3 pts — **Annulations rares**: Annulations rares et justifiées.
  - `good` 5 pts — **Fiable**: Aucune annulation récente.
  - `excellent` 7 pts — **Très fiable**: Aucun désistement, engagement démontré.

#### Application Medijob _Non scoré_

- **pharm_q20** [] Avez-vous déjà téléchargé l’application MEDIJOB ?
  - `None` 0 pts — **Oui**: Déjà téléchargée.
  - `None` 0 pts — **Non**: Pas encore téléchargée.
- **pharm_q21** [] Souhaitez-vous que je vous accompagne pour finaliser votre inscription ?
  - `None` 0 pts — **Oui**: Souhaite être accompagné(e).
  - `None` 0 pts — **Non**: Préfère finaliser seul(e).

## Bundle variants — all profiles (recovered from eval.js)

Each profile embeds 2–3 trame variants in the SPA bundle:

- `script_officielle` — numbered ACCUEIL→RÉMUNÉRATION fields (script Medijob; many prompts without `?`)
- `interim_scored` — sections + `question` + `suggestedAnswers` + criteria
- `cdd_cdi_scored` — long-term scored trame

**Note:** `conseiller_para` / `rayonniste` have scored variants only (no `script_officielle` block found).

### `preparateur` — bundle recovery

- Unique items: **61** · with `?`: **47** · variants: **3**
- Additional vs prior extract: **+33** questions with `?`

#### Variant `script_officielle` (profileId_block) — 24 items, 12 with `?`

Label: **Préparateur(trice) en pharmacie**  
Trame officielle Medijob — Qualification candidat Officine.

##### 1. ACCUEIL

- **prep_accueil** Bonjour M./Mme [Nom], je suis [Prénom], consultant(e) en recrutement chez MEDIJOB. Merci d'avoir pris quelques minutes pour cet échange. L'objectif de cet entretien est de mieux connaître votre parcours, vos compétences et vos attentes afin de pouvoir vous proposer des missions d'intérim ou des opportunités en CDI/CDD qui vous correspondent réellement. Cet échange dure une dizaine de minutes. Est-ce que vous êtes bien disponible ?

##### 2. PARCOURS PROFESSIONNEL

- **prep_parcours_recit** Présentez-moi rapidement votre parcours depuis l'obtention de votre diplôme.
- **prep_parcours_crm** À renseigner dans le CRM
- **prep_raison_depart** Pourquoi souhaitez-vous quitter votre poste actuel ?
- **prep_types_officine** Types d'officines connues
- **prep_experiences** Expériences (à cocher)

##### 3. COMPÉTENCES

- **prep_autonomie** Aujourd'hui, comment évalueriez-vous votre niveau d'autonomie en officine ?
- **prep_logiciels** Logiciels maîtrisés
- **prep_competences** Compétences réalisées quotidiennement
- **prep_nouvelles_missions** Êtes-vous formé(e) aux nouvelles missions officinales ?

##### 4. SAVOIR-ÊTRE

- **prep_qualites** Quelles sont selon vous vos principales qualités en officine ?
- **prep_progres** Et sur quels aspects souhaitez-vous encore progresser ?
- **prep_adaptation** Comment vous adaptez-vous lorsque vous intégrez une nouvelle équipe ?
- **prep_situation_difficile** Avez-vous déjà rencontré une situation difficile avec un patient ou au sein d'une équipe ? Comment l'avez-vous gérée ?

##### 5. VOTRE RECHERCHE

- **prep_type_poste** Type de poste recherché
- **prep_criteres** Critères prioritaires
- **prep_repoussoirs** Environnement ou organisation dans lequel vous ne souhaitez plus travailler ?

##### 6. DISPONIBILITÉS

- **prep_dispo_crm** À partir de quand êtes-vous disponible et avez-vous des contraintes particulières ?
- **prep_distance** Jusqu'à quelle distance êtes-vous prêt(e) à vous déplacer ?
- **prep_permis** Permis
- **prep_vehicule** Véhicule
- **prep_dernminute** Acceptez-vous les missions de dernière minute ou de courte durée ?
- **prep_dernminute_precisions** Précisions

##### 7. RÉMUNÉRATION

- **prep_remu_crm** Rémunération

#### Variant `interim_scored` (id_label_sections) — 22 items, 22 with `?`

Label: **Préparateur(trice) en pharmacie**  
Délivrance, comptoir, ordonnances, logiciels métier. Trame officielle Medijob.

##### Parcours & situation

- **prep_q1** [B1] Êtes-vous actuellement en poste ? Sous quel statut (CDI, CDD, intérim, remplacements) ?
  - `ok` 4 pts — **Sans poste**: En recherche, sans poste actuellement.
  - `good` 8 pts — **Intérim / remplacements**: En intérim ou remplacements ponctuels.
  - `good` 8 pts — **CDD en cours**: En CDD jusqu’à une date donnée.
  - `excellent` 12 pts — **CDI**: En CDI, souhaite bouger vers de l’intérim.
- **prep_q2** [B1] Depuis combien de temps exercez-vous en officine ? Combien d’officines avez-vous connues ?
- **prep_q3** [C3] Quels types d’officines : rurale, urbaine, centre commercial, forte affluence ?

##### Diplôme & profil

- **prep_q4** Êtes-vous titulaire du BP de préparateur ou du DEUST préparateur / technicien en pharmacie ? En quelle année ?
- **prep_q5** Êtes-vous en règle pour exercer (pièce d’identité, autorisation de travail si concerné) ?

##### Compétences métier

- **prep_q6** [B2] Êtes-vous totalement autonome au comptoir, du conseil à la délivrance ?
- **prep_q7** [B2] Êtes-vous à l’aise avec les ordonnances ?
- **prep_q8** [B3] Quels logiciels maîtrisez-vous ? (LGPI, Winpharma, Smart Rx, Périclès, Pharmaland…)
- **prep_q9** [B3] Avez-vous une expérience de la PDA, des préparations magistrales, d’un automate / robot ?
- **prep_q10** [B2] Pourriez-vous tenir un comptoir en toute autonomie en pleine affluence (sous contrôle du pharmacien) ?

##### Disponibilités & mobilité

- **prep_q11** [B4] À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?
- **prep_q12** [B5] Acceptez-vous les missions de dernière minute ? Avec quel préavis ?
  - `weak` 0 pts — **Refuse**: N’accepte pas les missions de dernière minute.
  - `ok` 3 pts — **Avec préavis 24-48h**: OK avec un préavis de 24 à 48h.
  - `excellent` 6 pts — **Régulièrement**: Accepte régulièrement les missions express.
- **prep_q13** [B6] Quelle distance êtes-vous prêt(e) à parcourir ? Disposez-vous d’un véhicule ?

##### Motivation & projet

- **prep_q14** [B7] Qu’est-ce qui vous plaît dans l’intérim ?
- **prep_q15** [B7] Quel type d’officine recherchez-vous ?
- **prep_q16** [B7] Quelles sont vos attentes et vos critères prioritaires pour vos prochaines missions ?

##### Savoir-être & adaptation

- **prep_q17** [C3] Arrivez-vous facilement à vous adapter à une nouvelle équipe ?
- **prep_q18** [C3] Avez-vous déjà travaillé dans des officines à forte activité (plus de 450 patients / jour) ?
- **prep_q19** [C4] Avez-vous déjà dû annuler une mission ? Dans quelles circonstances ?
- **prep_q20** [C4] Avez-vous une référence à nous donner pour prise de référence (pas obligatoire) ?
  - `ok` 3 pts — **Aucune**: Pas de référence à donner.
  - `good` 5 pts — **Référence proposée**: Référence professionnelle proposée.
  - `excellent` 7 pts — **Plusieurs références**: Plusieurs références récentes proposées.

##### Application Medijob

- **prep_q21** Avez-vous déjà téléchargé l’application MEDIJOB ?
- **prep_q22** Souhaitez-vous que je vous accompagne pour finaliser votre inscription ?

#### Variant `cdd_cdi_scored` (id_label_sections) — 25 items, 23 with `?`

Label: **Préparateur(trice) en pharmacie**  
Recrutement CDI/CDD — trame long terme (motivations, projet, réalisations).

##### Parcours & situation

- **prep_q1** [B1] Êtes-vous actuellement en poste ? Sous quel statut (CDI, CDD, intérim, remplacements) ?
  - `ok` 4 pts — **Sans poste**: En recherche, sans poste actuellement.
  - `good` 8 pts — **Intérim / remplacements**: En intérim ou remplacements ponctuels.
  - `good` 8 pts — **CDD en cours**: En CDD jusqu’à une date donnée.
  - `excellent` 12 pts — **CDI**: En CDI, souhaite bouger vers de l’intérim.
- **prep_q2** [B1] Depuis combien de temps exercez-vous en officine ? Combien d’officines avez-vous connues ?
  - `weak` 0 pts — **Aucune**: Aucune expérience hors stages.
  - `ok` 4 pts — **< 1 an**: Moins d’un an, principalement des stages.
  - `good` 8 pts — **1 à 3 ans**: Entre 1 et 3 ans, dans 2 ou 3 officines.
  - `excellent` 12 pts — **> 3 ans stable**: Plus de 3 ans, parcours stable et progression claire.
- **prep_q3** [C3] Quels types d’officines : rurale, urbaine, centre commercial, forte affluence ?
  - `weak` 0 pts — **Un seul type**: A surtout connu un seul type d’officine.
  - `ok` 3 pts — **Quelques contextes**: A travaillé dans 2 contextes différents.
  - `good` 5 pts — **Variés**: Connaît plusieurs types : rural, urbain, centre commercial.
  - `excellent` 7 pts — **Multi-contextes + forte affluence**: A travaillé dans des officines variées dont des forte affluence.

##### Diplôme & profil

- **prep_q4** Êtes-vous titulaire du BP de préparateur ou du DEUST préparateur / technicien en pharmacie ? En quelle année ?
- **prep_q5** Êtes-vous en règle pour exercer (pièce d’identité, autorisation de travail si concerné) ?

##### Compétences métier

- **prep_q6** [B2] Êtes-vous totalement autonome au comptoir, du conseil à la délivrance ?
  - `weak` 0 pts — **Non autonome**: Encore besoin d’un encadrement constant.
  - `ok` 6 pts — **Autonome encadré**: Autonome sur les cas simples, encadrement sur le reste.
  - `good` 12 pts — **Autonome complet**: Totalement autonome du conseil à la délivrance.
  - `excellent` 18 pts — **Pleinement autonome + cas complexes**: Gère seul cas complexes, tiers payant, affluence.
- **prep_q7** [B2] Êtes-vous à l’aise avec les ordonnances ?
  - `weak` 0 pts — **Pas à l’aise**: Difficultés à délivrer seul une ordonnance.
  - `ok` 6 pts — **Simples uniquement**: À l’aise sur les ordonnances simples seulement.
  - `good` 12 pts — **Toutes ordonnances classiques**: À l’aise sur tout type d’ordonnance courante.
  - `excellent` 18 pts — **Tous types + tiers payant**: Maîtrise ordonnances complexes, tiers payant, dispensations spéciales.
- **prep_q8** [B3] Quels logiciels maîtrisez-vous ? (LGPI, Winpharma, Smart Rx, Périclès, Pharmaland…)
  - `weak` 0 pts — **Aucun**: Aucun logiciel maîtrisé.
  - `ok` 4 pts — **1 logiciel**: Maîtrise d’un seul logiciel métier.
  - `good` 7 pts — **2 logiciels**: Maîtrise de 2 logiciels, s’adapte rapidement.
  - `excellent` 10 pts — **3+ logiciels**: Maîtrise de 3 logiciels ou plus, très polyvalent.
- **prep_q9** [B3] Avez-vous une expérience de la PDA, des préparations magistrales, d’un automate / robot ?
  - `weak` 0 pts — **Aucune**: Aucune expérience de PDA ou d’automate.
  - `ok` 4 pts — **PDA ou magistrales**: A déjà fait de la PDA OU des préparations magistrales.
  - `good` 7 pts — **Plusieurs**: Expérience PDA + magistrales ou automate.
  - `excellent` 10 pts — **PDA + automate + magistrales**: Large périmètre : PDA, automate/robot, préparations magistrales.
- **prep_q10** [B2] Pourriez-vous tenir un comptoir en toute autonomie en pleine affluence (sous contrôle du pharmacien) ?
  - `weak` 0 pts — **Non**: Pas à l’aise en affluence.
  - `ok` 6 pts — **Avec soutien**: OK si le pharmacien est très présent.
  - `good` 12 pts — **Oui en autonomie**: Oui, totalement autonome en pleine affluence.
  - `excellent` 18 pts — **Oui, gère même les imprévus**: Gère affluence, imprévus, multi-comptoir.

##### Projet professionnel long terme

- **preparateur_cdi_projet_1** [B7] Où vous voyez-vous professionnellement dans 3 ans ?
- **preparateur_cdi_projet_2** [B7] Pourquoi cherchez-vous un CDI / CDD plutôt que de l’intérim ou de rester dans votre poste actuel ?
- **preparateur_cdi_projet_3** [B7] Sur quelle durée envisagez-vous de vous engager ?
  - `weak` 0 pts — **< 6 mois / test**: Engagement court, positionnement flou.
  - `ok` 3 pts — **1 an**: Engagement 1 an, souhaite voir.
  - `good` 6 pts — **2-3 ans**: Engagement 2 à 3 ans, projet moyen terme.
  - `excellent` 8 pts — **> 3 ans / long terme**: Vision long terme, souhaite s’installer.

##### Réalisations & gestion de situations

- **preparateur_cdi_star_1** [C2] Racontez-nous une situation professionnelle difficile que vous avez gérée : contexte, action, résultat.
- **preparateur_cdi_star_2** [C1] Racontez-nous une réussite dont vous êtes particulièrement fier·e.
- **preparateur_cdi_conflit** [C3] Comment gérez-vous un désaccord avec un collègue ou un supérieur ?
  - `weak` 0 pts — **Évite le conflit**: Préfère ne pas aborder les désaccords.
  - `ok` 3 pts — **S’adapte au cas par cas**: Aborde parfois, dépend du contexte.
  - `good` 5 pts — **Dialogue direct et respectueux**: Aborde le sujet directement, sans agressivité.
  - `excellent` 7 pts — **Recherche la solution + montre l’exemple**: Propose des solutions, formalise, apaise.

##### Alignement Medijob & partenariat

- **preparateur_cdi_medijob** [C4] Que savez-vous de Medijob et de notre approche du recrutement en pharmacie ?
- **preparateur_cdi_officine_ideale** [B7] À quoi ressemble votre officine / environnement de travail idéal ?
- **preparateur_cdi_references** [C4] Pouvez-vous fournir des références professionnelles vérifiables ?
  - `weak` 0 pts — **Aucune**: Pas de référence à donner.
  - `ok` 3 pts — **Une référence**: Une référence disponible.
  - `good` 5 pts — **2-3 références**: 2 à 3 références professionnelles.
  - `excellent` 7 pts — **Plusieurs récentes + variées**: Plusieurs références récentes, postes variés.

##### Rémunération & conditions attendues

- **preparateur_cdi_rem_attentes** [B7] Quelles sont vos attentes salariales détaillées (fixe, variable, coefficient CCN, avantages) ?
- **preparateur_cdi_preavis** [B4] Avez-vous un préavis à respecter ? Sous quel délai pouvez-vous démarrer ?
  - `ok` 3 pts — **3 mois de préavis**: Préavis long (3 mois), démarrage tardif.
  - `good` 5 pts — **1-2 mois**: Préavis standard (1 à 2 mois).
  - `good` 7 pts — **< 1 mois / négociable**: Préavis court ou négociable.
  - `excellent` 8 pts — **Immédiat**: Peut démarrer immédiatement.
- **preparateur_cdi_essai** [C4] Comment abordez-vous la période d’essai ?
  - `ok` 3 pts — **Crainte / négociation**: Sujet sensible, demande à raccourcir.
  - `good` 5 pts — **Neutre**: Prend la période d’essai comme un standard.
  - `excellent` 7 pts — **Volontaire, opportunité mutuelle**: Voit la période d’essai comme un test à double sens, sereinement.

##### Mobilité géographique

- **preparateur_cdi_mobilite** [B6] Êtes-vous prêt·e à déménager ou à faire une longue distance quotidienne pour ce poste ?
  - `weak` 0 pts — **Non, zone limitée**: Reste sur sa zone actuelle (< 20 km).
  - `ok` 3 pts — **Jusqu’à 30 min**: OK pour ~30 min de trajet quotidien.
  - `good` 5 pts — **Jusqu’à 1h**: OK pour jusqu’à 1h de trajet.
  - `excellent` 8 pts — **Déménagement possible**: Déménagement envisagé si le poste le justifie.

##### Application Medijob

- **preparateur_cdi_app_1** Avez-vous déjà téléchargé l’application MEDIJOB ?
- **preparateur_cdi_app_2** Souhaitez-vous que je vous accompagne pour finaliser votre inscription ?

### `etudiant` — bundle recovery

- Unique items: **61** · with `?`: **44** · variants: **3**
- Additional vs prior extract: **+30** questions with `?`

#### Variant `script_officielle` (profileId_block) — 27 items, 12 with `?`

Label: **Étudiant(e) en pharmacie**  
Trame officielle Medijob — Qualification candidat Officine.

##### 1. ACCUEIL

- **etu_accueil** Bonjour M./Mme [Nom], je suis [Prénom], consultant(e) en recrutement chez MEDIJOB. Merci d'avoir pris quelques minutes pour cet échange. L'objectif de cet entretien est de mieux connaître votre parcours, votre expérience en officine et vos disponibilités afin de vous proposer des missions adaptées à votre niveau d'études et à votre projet professionnel. L'entretien dure une dizaine de minutes. Est-ce que vous êtes bien disponible ?

##### 2. PARCOURS

- **etu_parcours_recit** Pouvez-vous me présenter rapidement votre parcours en pharmacie et votre expérience en officine ?
- **etu_parcours_crm** À renseigner dans le CRM
- **etu_raison_depart** Pourquoi souhaitez-vous quitter votre poste / officine actuelle ?
- **etu_350h** 350 heures validées
- **etu_certificat** Certificat de remplacement
- **etu_types_officine** Types d'officines connues
- **etu_experiences** Expériences

##### 3. COMPÉTENCES

- **etu_autonomie** Aujourd'hui, quel est votre niveau d'autonomie au comptoir ?
- **etu_missions** Missions réalisées aujourd'hui en officine
- **etu_nouvelles_missions** Êtes-vous formé(e) aux nouvelles missions officinales ?
- **etu_logiciels** Logiciels maîtrisés

##### 4. SAVOIR-ÊTRE

- **etu_qualites** Quelles sont selon vous vos principales qualités en officine ?
- **etu_progres** Quels sont aujourd'hui les domaines dans lesquels vous souhaitez progresser ?
- **etu_adaptation** Comment vous adaptez-vous lorsque vous arrivez dans une nouvelle pharmacie ?
- **etu_difficulte** Avez-vous déjà rencontré une difficulté avec un patient ou dans une équipe ? Comment l'avez-vous gérée ?

##### 5. VOTRE PROJET

- **etu_type_mission** Type de mission recherché
- **etu_criteres** Critères les plus importants
- **etu_projet** Projet professionnel après vos études
- **etu_repoussoirs** Type de pharmacie ou organisation dans lequel vous ne souhaitez pas travailler ?

##### 6. DISPONIBILITÉS

- **etu_dispo_crm** Comment s'organisent vos disponibilités avec vos cours et vos examens ?
- **etu_distance** Jusqu'à quelle distance êtes-vous prêt(e) à vous déplacer ?
- **etu_permis** Permis
- **etu_vehicule** Véhicule
- **etu_types_missions** Acceptez-vous
- **etu_types_precisions** Précisions

##### 7. RÉMUNÉRATION

- **etu_remu_crm** Rémunération

#### Variant `interim_scored` (id_label_sections) — 19 items, 19 with `?`

Label: **Étudiant(e) en pharmacie**  
Règle Medijob : +350 H, certificat de remplacement en 6ᵉ année.

##### Diplôme & profil

- **etu_q1** [B2] En quelle année d’études êtes-vous, et l’avez-vous validée ? Dans quelle faculté ?
- **etu_q2** Avez-vous effectué au moins 350 h en officine ? Pouvez-vous le justifier ?
- **etu_q3** [B1] Avez-vous surtout travaillé au comptoir ou en back-office (stock, rayons) ?
- **etu_q4** Si 6ᵉ année validée : disposez-vous du certificat de remplacement ?

##### Compétences métier

- **etu_q5** [B2] Quel est votre niveau réel d’autonomie au comptoir aujourd’hui ?
- **etu_q6** [B2] Délivrez-vous des ordonnances seul(e), sous la supervision du pharmacien ?
- **etu_q7** [B3] Quels logiciels avez-vous déjà utilisés ?

##### Disponibilités & mobilité

- **etu_q8** [B4] À partir de quand êtes-vous disponible ? Quels jours ?
- **etu_q9** [B4] Comment vos disponibilités s’articulent-elles avec vos cours et vos examens ?
- **etu_q10** [B5] Acceptez-vous les missions de dernière minute ? Avec quel préavis ?
  - `weak` 0 pts — **Refuse**: Pas de missions express.
  - `ok` 3 pts — **Avec 24-48h**: OK avec 24 à 48h.
  - `excellent` 6 pts — **Régulièrement**: Accepte régulièrement les missions express.
- **etu_q11** [B6] Quelle distance êtes-vous prêt(e) à parcourir ? Disposez-vous d’un véhicule ?

##### Motivation & projet

- **etu_q12** [B7] Qu’est-ce qui vous plaît dans l’intérim ?
- **etu_q13** [B7] Quel type d’officine recherchez-vous ?
- **etu_q14** [B7] Quel est votre projet (filière, thèse, installation) et en quoi l’intérim s’y inscrit-il ?

##### Savoir-être & adaptation

- **etu_q15** [C3] Comment réagissez-vous lorsque vous intégrez une nouvelle équipe ?
- **etu_q16** [C3] Comment gérez-vous les périodes de forte affluence ?
- **etu_q17** [C4] Avez-vous déjà dû annuler une mission ? Dans quelles circonstances ?

##### Application Medijob

- **etu_q18** Avez-vous déjà téléchargé l’application MEDIJOB ?
- **etu_q19** Souhaitez-vous que je vous accompagne pour finaliser votre inscription ?

#### Variant `cdd_cdi_scored` (id_label_sections) — 22 items, 20 with `?`

Label: **Étudiant(e) en pharmacie**  
Recrutement CDI/CDD — trame long terme (motivations, projet, réalisations).

##### Diplôme & profil

- **etu_q1** [B2] En quelle année d’études êtes-vous, et l’avez-vous validée ? Dans quelle faculté ?
  - `weak` 0 pts — **< 3ᵉ**: Avant la 3ᵉ année.
  - `ok` 6 pts — **3ᵉ ou 4ᵉ validée**: En 3ᵉ ou 4ᵉ année validée.
  - `good` 12 pts — **5ᵉ année validée**: En 5ᵉ année validée.
  - `excellent` 18 pts — **6ᵉ année validée**: En 6ᵉ année validée.
- **etu_q2** Avez-vous effectué au moins 350 h en officine ? Pouvez-vous le justifier ?
- **etu_q3** [B1] Avez-vous surtout travaillé au comptoir ou en back-office (stock, rayons) ?
  - `weak` 0 pts — **Back-office uniquement**: Uniquement back-office.
  - `ok` 4 pts — **Mixte mais peu comptoir**: Mixte, principalement back-office.
  - `good` 8 pts — **Comptoir majoritaire**: Comptoir majoritaire.
  - `excellent` 12 pts — **Comptoir + autonomie progressive**: Comptoir avec autonomie progressive et variée.
- **etu_q4** Si 6ᵉ année validée : disposez-vous du certificat de remplacement ?

##### Compétences métier

- **etu_q5** [B2] Quel est votre niveau réel d’autonomie au comptoir aujourd’hui ?
  - `weak` 0 pts — **Pas autonome**: Encore besoin d’encadrement permanent.
  - `ok` 6 pts — **Cas simples**: Autonome sur les cas simples.
  - `good` 12 pts — **Niveau préparateur**: Autonomie type préparateur.
  - `excellent` 18 pts — **Pleinement autonome**: Pleinement autonome, gère cas complexes.
- **etu_q6** [B2] Délivrez-vous des ordonnances seul(e), sous la supervision du pharmacien ?
  - `weak` 0 pts — **Non**: N’a pas encore délivré seul(e).
  - `ok` 6 pts — **Avec validation**: Délivre avec validation pharmacien sur chaque ordonnance.
  - `good` 12 pts — **Souvent**: Délivre souvent seul(e) sous supervision globale.
  - `excellent` 18 pts — **Régulièrement**: Délivre régulièrement seul(e), y compris cas complexes.
- **etu_q7** [B3] Quels logiciels avez-vous déjà utilisés ?
  - `weak` 0 pts — **Aucun**: Aucun logiciel utilisé.
  - `ok` 4 pts — **1 logiciel**: 1 logiciel découvert.
  - `good` 7 pts — **2 logiciels**: 2 logiciels métiers connus.
  - `excellent` 10 pts — **3+ logiciels**: 3 logiciels ou plus.

##### Projet professionnel long terme

- **etudiant_cdi_projet_1** [B7] Où vous voyez-vous professionnellement dans 3 ans ?
- **etudiant_cdi_projet_2** [B7] Pourquoi cherchez-vous un CDI / CDD plutôt que de l’intérim ou de rester dans votre poste actuel ?
- **etudiant_cdi_projet_3** [B7] Sur quelle durée envisagez-vous de vous engager ?
  - `weak` 0 pts — **< 6 mois / test**: Engagement court, positionnement flou.
  - `ok` 3 pts — **1 an**: Engagement 1 an, souhaite voir.
  - `good` 6 pts — **2-3 ans**: Engagement 2 à 3 ans, projet moyen terme.
  - `excellent` 8 pts — **> 3 ans / long terme**: Vision long terme, souhaite s’installer.

##### Réalisations & gestion de situations

- **etudiant_cdi_star_1** [C2] Racontez-nous une situation professionnelle difficile que vous avez gérée : contexte, action, résultat.
- **etudiant_cdi_star_2** [C1] Racontez-nous une réussite dont vous êtes particulièrement fier·e.
- **etudiant_cdi_conflit** [C3] Comment gérez-vous un désaccord avec un collègue ou un supérieur ?
  - `weak` 0 pts — **Évite le conflit**: Préfère ne pas aborder les désaccords.
  - `ok` 3 pts — **S’adapte au cas par cas**: Aborde parfois, dépend du contexte.
  - `good` 5 pts — **Dialogue direct et respectueux**: Aborde le sujet directement, sans agressivité.
  - `excellent` 7 pts — **Recherche la solution + montre l’exemple**: Propose des solutions, formalise, apaise.

##### Alignement Medijob & partenariat

- **etudiant_cdi_medijob** [C4] Que savez-vous de Medijob et de notre approche du recrutement en pharmacie ?
- **etudiant_cdi_officine_ideale** [B7] À quoi ressemble votre officine / environnement de travail idéal ?
- **etudiant_cdi_references** [C4] Pouvez-vous fournir des références professionnelles vérifiables ?
  - `weak` 0 pts — **Aucune**: Pas de référence à donner.
  - `ok` 3 pts — **Une référence**: Une référence disponible.
  - `good` 5 pts — **2-3 références**: 2 à 3 références professionnelles.
  - `excellent` 7 pts — **Plusieurs récentes + variées**: Plusieurs références récentes, postes variés.

##### Rémunération & conditions attendues

- **etudiant_cdi_rem_attentes** [B7] Quelles sont vos attentes salariales détaillées (fixe, variable, coefficient CCN, avantages) ?
- **etudiant_cdi_preavis** [B4] Avez-vous un préavis à respecter ? Sous quel délai pouvez-vous démarrer ?
  - `ok` 3 pts — **3 mois de préavis**: Préavis long (3 mois), démarrage tardif.
  - `good` 5 pts — **1-2 mois**: Préavis standard (1 à 2 mois).
  - `good` 7 pts — **< 1 mois / négociable**: Préavis court ou négociable.
  - `excellent` 8 pts — **Immédiat**: Peut démarrer immédiatement.
- **etudiant_cdi_essai** [C4] Comment abordez-vous la période d’essai ?
  - `ok` 3 pts — **Crainte / négociation**: Sujet sensible, demande à raccourcir.
  - `good` 5 pts — **Neutre**: Prend la période d’essai comme un standard.
  - `excellent` 7 pts — **Volontaire, opportunité mutuelle**: Voit la période d’essai comme un test à double sens, sereinement.

##### Mobilité géographique

- **etudiant_cdi_mobilite** [B6] Êtes-vous prêt·e à déménager ou à faire une longue distance quotidienne pour ce poste ?
  - `weak` 0 pts — **Non, zone limitée**: Reste sur sa zone actuelle (< 20 km).
  - `ok` 3 pts — **Jusqu’à 30 min**: OK pour ~30 min de trajet quotidien.
  - `good` 5 pts — **Jusqu’à 1h**: OK pour jusqu’à 1h de trajet.
  - `excellent` 8 pts — **Déménagement possible**: Déménagement envisagé si le poste le justifie.

##### Application Medijob

- **etudiant_cdi_app_1** Avez-vous déjà téléchargé l’application MEDIJOB ?
- **etudiant_cdi_app_2** Souhaitez-vous que je vous accompagne pour finaliser votre inscription ?

### `conseiller_para` — bundle recovery

- Unique items: **35** · with `?`: **33** · variants: **2**
- Additional vs prior extract: **+18** questions with `?`

#### Variant `interim_scored` (id_label_sections) — 20 items, 20 with `?`

Label: **Conseiller(ère) en parapharmacie**  
Conseil, vente, gammes parapharmacie. Profil polyvalent (retail, beauté, esthétique acceptés).

##### Parcours & situation

- **cp_q1** [B1] Êtes-vous actuellement en poste ? Sous quel statut (CDI, CDD, intérim, freelance, sans poste) ?
  - `ok` 4 pts — **Sans poste**: En recherche, sans poste actuellement.
  - `good` 8 pts — **Intérim / missions**: En intérim ou missions courtes.
  - `good` 8 pts — **CDD en cours**: En CDD jusqu’à une date donnée.
  - `excellent` 12 pts — **CDI**: En CDI, souhaite passer à l’intérim.
- **cp_q2** [B1] Quelle est votre expérience dans le conseil-vente (parapharmacie, cosmétique, grande distribution, esthétique…) ?
- **cp_q3** [C3] Avez-vous déjà travaillé en pharmacie / parapharmacie ?

##### Profil & autorisations

- **cp_q4** [B3] Avez-vous une formation en lien avec le conseil-vente, l’esthétique ou la parapharmacie ?
- **cp_q5** Êtes-vous en règle pour exercer (pièce d’identité, autorisation de travail si concerné) ?

##### Compétences conseil & vente

- **cp_q6** [B2] Êtes-vous à l’aise pour conseiller un client en autonomie ?
- **cp_q7** [B3] Quelles gammes parapharmacie connaissez-vous (dermo-cosmétique, hygiène, compléments, bébé, solaire, minceur…) ?
- **cp_q8** [B3] Avez-vous une expérience de la tenue de caisse, de l’encaissement et de la mise en avant produit ?
- **cp_q9** [B2] Pouvez-vous tenir un point de vente en autonomie en cas de forte affluence ?

##### Disponibilités & mobilité

- **cp_q10** [B4] À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?
- **cp_q11** [B5] Acceptez-vous les missions de dernière minute ? Avec quel préavis ?
  - `weak` 0 pts — **Refuse**: Pas de missions express.
  - `ok` 3 pts — **Avec 24-48h**: OK avec 24 à 48h de préavis.
  - `excellent` 6 pts — **Régulièrement**: Accepte régulièrement les missions express.
- **cp_q12** [B6] Quelle distance êtes-vous prêt(e) à parcourir ? Disposez-vous d’un véhicule ?

##### Motivation & projet

- **cp_q13** [B7] Qu’est-ce qui vous attire dans la parapharmacie / le secteur santé ?
- **cp_q14** [B7] Quel type d’environnement recherchez-vous (officine, parapharmacie indépendante, grande surface) ?

##### Savoir-être & adaptation

- **cp_q15** [C3] Arrivez-vous facilement à vous adapter à une nouvelle équipe ?
- **cp_q16** [C2] Avez-vous déjà géré des clients exigeants ou difficiles ?
- **cp_q17** [C4] Avez-vous déjà dû annuler une mission ? Dans quelles circonstances ?
- **cp_q18** [C4] Avez-vous une référence à nous donner pour prise de référence (pas obligatoire) ?
  - `ok` 3 pts — **Aucune**: Pas de référence à donner.
  - `good` 5 pts — **Référence proposée**: Référence professionnelle proposée.
  - `excellent` 7 pts — **Plusieurs références**: Plusieurs références récentes proposées.

##### Application Medijob

- **cp_q19** Avez-vous déjà téléchargé l’application MEDIJOB ?
- **cp_q20** Souhaitez-vous que je vous accompagne pour finaliser votre inscription ?

#### Variant `cdd_cdi_scored` (id_label_sections) — 24 items, 22 with `?`

Label: **Conseiller(ère) en parapharmacie**  
Recrutement CDI/CDD — trame long terme (motivations, projet, réalisations).

##### Parcours & situation

- **cp_q1** [B1] Êtes-vous actuellement en poste ? Sous quel statut (CDI, CDD, intérim, freelance, sans poste) ?
  - `ok` 4 pts — **Sans poste**: En recherche, sans poste actuellement.
  - `good` 8 pts — **Intérim / missions**: En intérim ou missions courtes.
  - `good` 8 pts — **CDD en cours**: En CDD jusqu’à une date donnée.
  - `excellent` 12 pts — **CDI**: En CDI, souhaite passer à l’intérim.
- **cp_q2** [B1] Quelle est votre expérience dans le conseil-vente (parapharmacie, cosmétique, grande distribution, esthétique…) ?
  - `weak` 0 pts — **Aucune**: Aucune expérience en conseil-vente.
  - `ok` 4 pts — **< 1 an**: Moins d’un an d’expérience ou stages.
  - `good` 8 pts — **1 à 3 ans**: Entre 1 et 3 ans dans le conseil-vente.
  - `excellent` 12 pts — **> 3 ans**: Plus de 3 ans dans le conseil-vente, parcours stable.
- **cp_q3** [C3] Avez-vous déjà travaillé en pharmacie / parapharmacie ?
  - `weak` 0 pts — **Jamais**: Jamais en pharmacie ni parapharmacie.
  - `ok` 3 pts — **Stages courts**: Quelques stages courts en pharmacie / parapharmacie.
  - `good` 5 pts — **Oui, expérience confirmée**: Oui, plusieurs mois en pharmacie / parapharmacie.
  - `excellent` 7 pts — **Oui, plusieurs lieux**: Oui, plusieurs officines / parapharmacies différentes.

##### Profil & autorisations

- **cp_q4** [B3] Avez-vous une formation en lien avec le conseil-vente, l’esthétique ou la parapharmacie ?
  - `weak` 0 pts — **Aucune**: Aucune formation spécifique.
  - `ok` 4 pts — **CAP / Bac Pro**: CAP ou Bac Pro vente / esthétique.
  - `good` 7 pts — **BTS / formation spécialisée**: BTS MUC, esthétique-cosmétique ou formation parapharmacie.
  - `excellent` 10 pts — **Formation continue + spécialisation**: Diplôme + formations dermo-cosmétique / continuum.
- **cp_q5** Êtes-vous en règle pour exercer (pièce d’identité, autorisation de travail si concerné) ?

##### Compétences conseil & vente

- **cp_q6** [B2] Êtes-vous à l’aise pour conseiller un client en autonomie ?
  - `weak` 0 pts — **Pas à l’aise**: Encore besoin d’un encadrement constant.
  - `ok` 6 pts — **À l’aise sur le basique**: À l’aise sur les questions simples uniquement.
  - `good` 12 pts — **Autonome**: Conseille en autonomie sur la plupart des gammes.
  - `excellent` 18 pts — **Expert·e + vente additionnelle**: Maîtrise les gammes, propose des ventes additionnelles, peut former.
- **cp_q7** [B3] Quelles gammes parapharmacie connaissez-vous (dermo-cosmétique, hygiène, compléments, bébé, solaire, minceur…) ?
  - `weak` 0 pts — **Aucune**: Aucune gamme parapharmacie connue.
  - `ok` 4 pts — **1 à 2 gammes**: 1 ou 2 gammes maîtrisées.
  - `good` 7 pts — **3 à 4 gammes**: Plusieurs gammes (dermo-cosmétique + hygiène + …).
  - `excellent` 10 pts — **Large périmètre**: Très large périmètre de gammes maîtrisées.
- **cp_q8** [B3] Avez-vous une expérience de la tenue de caisse, de l’encaissement et de la mise en avant produit ?
  - `weak` 0 pts — **Non**: Pas d’expérience caisse / merchandising.
  - `ok` 4 pts — **Caisse uniquement**: Tenue de caisse OK, peu de merchandising.
  - `good` 7 pts — **Caisse + merch basique**: Caisse et mise en avant produit OK.
  - `excellent` 10 pts — **Caisse + merch + animations**: Très à l’aise sur caisse, merch, animations commerciales.
- **cp_q9** [B2] Pouvez-vous tenir un point de vente en autonomie en cas de forte affluence ?
  - `weak` 0 pts — **Non**: Pas à l’aise en affluence.
  - `ok` 6 pts — **Avec soutien**: OK avec un manager présent.
  - `good` 12 pts — **Oui en autonomie**: Oui, totalement autonome en affluence.
  - `excellent` 18 pts — **Oui + management instinctif**: Gère affluence + coordonne instinctivement les collègues.

##### Projet professionnel long terme

- **conseiller_para_cdi_projet_1** [B7] Où vous voyez-vous professionnellement dans 3 ans ?
- **conseiller_para_cdi_projet_2** [B7] Pourquoi cherchez-vous un CDI / CDD plutôt que de l’intérim ou de rester dans votre poste actuel ?
- **conseiller_para_cdi_projet_3** [B7] Sur quelle durée envisagez-vous de vous engager ?
  - `weak` 0 pts — **< 6 mois / test**: Engagement court, positionnement flou.
  - `ok` 3 pts — **1 an**: Engagement 1 an, souhaite voir.
  - `good` 6 pts — **2-3 ans**: Engagement 2 à 3 ans, projet moyen terme.
  - `excellent` 8 pts — **> 3 ans / long terme**: Vision long terme, souhaite s’installer.

##### Réalisations & gestion de situations

- **conseiller_para_cdi_star_1** [C2] Racontez-nous une situation professionnelle difficile que vous avez gérée : contexte, action, résultat.
- **conseiller_para_cdi_star_2** [C1] Racontez-nous une réussite dont vous êtes particulièrement fier·e.
- **conseiller_para_cdi_conflit** [C3] Comment gérez-vous un désaccord avec un collègue ou un supérieur ?
  - `weak` 0 pts — **Évite le conflit**: Préfère ne pas aborder les désaccords.
  - `ok` 3 pts — **S’adapte au cas par cas**: Aborde parfois, dépend du contexte.
  - `good` 5 pts — **Dialogue direct et respectueux**: Aborde le sujet directement, sans agressivité.
  - `excellent` 7 pts — **Recherche la solution + montre l’exemple**: Propose des solutions, formalise, apaise.

##### Alignement Medijob & partenariat

- **conseiller_para_cdi_medijob** [C4] Que savez-vous de Medijob et de notre approche du recrutement en pharmacie ?
- **conseiller_para_cdi_officine_ideale** [B7] À quoi ressemble votre officine / environnement de travail idéal ?
- **conseiller_para_cdi_references** [C4] Pouvez-vous fournir des références professionnelles vérifiables ?
  - `weak` 0 pts — **Aucune**: Pas de référence à donner.
  - `ok` 3 pts — **Une référence**: Une référence disponible.
  - `good` 5 pts — **2-3 références**: 2 à 3 références professionnelles.
  - `excellent` 7 pts — **Plusieurs récentes + variées**: Plusieurs références récentes, postes variés.

##### Rémunération & conditions attendues

- **conseiller_para_cdi_rem_attentes** [B7] Quelles sont vos attentes salariales détaillées (fixe, variable, coefficient CCN, avantages) ?
- **conseiller_para_cdi_preavis** [B4] Avez-vous un préavis à respecter ? Sous quel délai pouvez-vous démarrer ?
  - `ok` 3 pts — **3 mois de préavis**: Préavis long (3 mois), démarrage tardif.
  - `good` 5 pts — **1-2 mois**: Préavis standard (1 à 2 mois).
  - `good` 7 pts — **< 1 mois / négociable**: Préavis court ou négociable.
  - `excellent` 8 pts — **Immédiat**: Peut démarrer immédiatement.
- **conseiller_para_cdi_essai** [C4] Comment abordez-vous la période d’essai ?
  - `ok` 3 pts — **Crainte / négociation**: Sujet sensible, demande à raccourcir.
  - `good` 5 pts — **Neutre**: Prend la période d’essai comme un standard.
  - `excellent` 7 pts — **Volontaire, opportunité mutuelle**: Voit la période d’essai comme un test à double sens, sereinement.

##### Mobilité géographique

- **conseiller_para_cdi_mobilite** [B6] Êtes-vous prêt·e à déménager ou à faire une longue distance quotidienne pour ce poste ?
  - `weak` 0 pts — **Non, zone limitée**: Reste sur sa zone actuelle (< 20 km).
  - `ok` 3 pts — **Jusqu’à 30 min**: OK pour ~30 min de trajet quotidien.
  - `good` 5 pts — **Jusqu’à 1h**: OK pour jusqu’à 1h de trajet.
  - `excellent` 8 pts — **Déménagement possible**: Déménagement envisagé si le poste le justifie.

##### Application Medijob

- **conseiller_para_cdi_app_1** Avez-vous déjà téléchargé l’application MEDIJOB ?
- **conseiller_para_cdi_app_2** Souhaitez-vous que je vous accompagne pour finaliser votre inscription ?

### `rayonniste` — bundle recovery

- Unique items: **35** · with `?`: **33** · variants: **2**
- Additional vs prior extract: **+18** questions with `?`

#### Variant `interim_scored` (id_label_sections) — 20 items, 20 with `?`

Label: **Rayonniste**  
Réception, mise en rayon, gestion des stocks. Profils retail / logistique acceptés.

##### Parcours & situation

- **ray_q1** [B1] Êtes-vous actuellement en poste ? Sous quel statut (CDI, CDD, intérim, sans poste) ?
  - `ok` 4 pts — **Sans poste**: En recherche, sans poste actuellement.
  - `good` 8 pts — **Intérim**: En intérim ou missions courtes.
  - `good` 8 pts — **CDD**: En CDD en cours.
  - `excellent` 12 pts — **CDI**: En CDI, recherche flexibilité.
- **ray_q2** [B1] Quelle est votre expérience en mise en rayon, manutention ou logistique (tous secteurs confondus) ?
- **ray_q3** [C3] Avez-vous déjà travaillé en pharmacie / parapharmacie ?

##### Profil & autorisations

- **ray_q4** Êtes-vous en règle pour exercer (pièce d’identité, autorisation de travail si concerné) ?
- **ray_q5** [B2] Êtes-vous à l’aise avec le port de charges et la station debout prolongée ?

##### Compétences rayon & stock

- **ray_q6** [B2] Êtes-vous à l’aise avec la réception des commandes (déballage, contrôle, rangement) ?
- **ray_q7** [B3] Connaissez-vous la gestion des périmés / dates courtes / retours fournisseurs ?
- **ray_q8** [B3] Avez-vous déjà utilisé un logiciel de gestion de stock ou un scanner de code-barres ?
- **ray_q9** [B2] Êtes-vous rigoureux(se) sur les emplacements, le facing et le rangement ?

##### Disponibilités & mobilité

- **ray_q10** [B4] À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?
- **ray_q11** [B5] Acceptez-vous les missions de dernière minute ? Avec quel préavis ?
  - `weak` 0 pts — **Refuse**: Pas de missions express.
  - `ok` 3 pts — **Avec 24-48h**: OK avec 24 à 48h de préavis.
  - `excellent` 6 pts — **Régulièrement**: Accepte régulièrement les missions express.
- **ray_q12** [B6] Quelle distance êtes-vous prêt(e) à parcourir ? Disposez-vous d’un véhicule ?

##### Motivation & projet

- **ray_q13** [B7] Qu’est-ce qui vous plaît dans le métier de rayonniste / dans l’intérim ?
- **ray_q14** [B7] Quel type d’environnement recherchez-vous (officine, parapharmacie, GMS, logistique) ?

##### Savoir-être & adaptation

- **ray_q15** [C3] Arrivez-vous facilement à vous intégrer à une nouvelle équipe ?
- **ray_q16** [C2] Comment réagissez-vous lorsqu’il y a une grosse livraison et que tout doit être rangé rapidement ?
- **ray_q17** [C4] Avez-vous déjà dû annuler une mission ? Dans quelles circonstances ?
- **ray_q18** [C4] Avez-vous une référence à nous donner pour prise de référence (pas obligatoire) ?
  - `ok` 3 pts — **Aucune**: Pas de référence à donner.
  - `good` 5 pts — **Référence proposée**: Référence professionnelle proposée.
  - `excellent` 7 pts — **Plusieurs références**: Plusieurs références récentes proposées.

##### Application Medijob

- **ray_q19** Avez-vous déjà téléchargé l’application MEDIJOB ?
- **ray_q20** Souhaitez-vous que je vous accompagne pour finaliser votre inscription ?

#### Variant `cdd_cdi_scored` (id_label_sections) — 24 items, 22 with `?`

Label: **Rayonniste**  
Recrutement CDI/CDD — trame long terme (motivations, projet, réalisations).

##### Parcours & situation

- **ray_q1** [B1] Êtes-vous actuellement en poste ? Sous quel statut (CDI, CDD, intérim, sans poste) ?
  - `ok` 4 pts — **Sans poste**: En recherche, sans poste actuellement.
  - `good` 8 pts — **Intérim**: En intérim ou missions courtes.
  - `good` 8 pts — **CDD**: En CDD en cours.
  - `excellent` 12 pts — **CDI**: En CDI, recherche flexibilité.
- **ray_q2** [B1] Quelle est votre expérience en mise en rayon, manutention ou logistique (tous secteurs confondus) ?
  - `weak` 0 pts — **Aucune**: Aucune expérience en rayon / logistique.
  - `ok` 4 pts — **< 1 an**: Moins d’un an d’expérience.
  - `good` 8 pts — **1 à 3 ans**: Entre 1 et 3 ans en rayon ou logistique.
  - `excellent` 12 pts — **> 3 ans**: Plus de 3 ans, parcours stable.
- **ray_q3** [C3] Avez-vous déjà travaillé en pharmacie / parapharmacie ?
  - `weak` 0 pts — **Jamais**: Jamais en pharmacie ni parapharmacie.
  - `ok` 3 pts — **Stages courts**: Quelques stages ou missions courtes.
  - `good` 5 pts — **Oui, expérience confirmée**: Oui, expérience récente en officine.
  - `excellent` 7 pts — **Oui, multi-lieux**: Oui, plusieurs officines / parapharmacies.

##### Profil & autorisations

- **ray_q4** Êtes-vous en règle pour exercer (pièce d’identité, autorisation de travail si concerné) ?
- **ray_q5** [B2] Êtes-vous à l’aise avec le port de charges et la station debout prolongée ?
  - `weak` 0 pts — **Non**: Difficultés avec le port de charges ou la station debout.
  - `ok` 6 pts — **Avec contraintes**: OK avec certaines contraintes (limites poids, pauses).
  - `good` 12 pts — **Oui**: À l’aise sur le port de charges et la station debout.
  - `excellent` 18 pts — **Aucune limite**: Aucune limite — habitué(e) à des charges lourdes.

##### Compétences rayon & stock

- **ray_q6** [B2] Êtes-vous à l’aise avec la réception des commandes (déballage, contrôle, rangement) ?
  - `weak` 0 pts — **Pas formé**: Pas d’expérience de réception.
  - `ok` 6 pts — **Avec encadrement**: Sait réceptionner avec un encadrement.
  - `good` 12 pts — **Autonome**: Autonome sur la réception et le contrôle.
  - `excellent` 18 pts — **Pleinement autonome + ajustements**: Gère seul(e), repère les erreurs fournisseurs, ajuste.
- **ray_q7** [B3] Connaissez-vous la gestion des périmés / dates courtes / retours fournisseurs ?
  - `weak` 0 pts — **Non**: Pas familier des dates courtes / périmés.
  - `ok` 4 pts — **Notions**: Notions de base.
  - `good` 7 pts — **À l’aise**: À l’aise avec les dates courtes et les périmés.
  - `excellent` 10 pts — **Maîtrise + retours fournisseurs**: Maîtrise dates courtes, périmés, retours fournisseurs.
- **ray_q8** [B3] Avez-vous déjà utilisé un logiciel de gestion de stock ou un scanner de code-barres ?
  - `weak` 0 pts — **Aucun**: Aucun outil utilisé.
  - `ok` 4 pts — **Scanner seul**: Scanner de code-barres uniquement.
  - `good` 7 pts — **Logiciel basique**: Logiciel de stock connu.
  - `excellent` 10 pts — **Plusieurs logiciels + scanner**: Plusieurs logiciels métier + scanner, polyvalent.
- **ray_q9** [B2] Êtes-vous rigoureux(se) sur les emplacements, le facing et le rangement ?
  - `weak` 0 pts — **Peu rigoureux**: Peu rigoureux sur le facing.
  - `ok` 6 pts — **Correct**: Correct mais variable.
  - `good` 12 pts — **Rigoureux**: Rigoureux et soigneux sur le rangement.
  - `excellent` 18 pts — **Très rigoureux + propose des améliorations**: Très rigoureux, propose des optimisations d’organisation.

##### Projet professionnel long terme

- **rayonniste_cdi_projet_1** [B7] Où vous voyez-vous professionnellement dans 3 ans ?
- **rayonniste_cdi_projet_2** [B7] Pourquoi cherchez-vous un CDI / CDD plutôt que de l’intérim ou de rester dans votre poste actuel ?
- **rayonniste_cdi_projet_3** [B7] Sur quelle durée envisagez-vous de vous engager ?
  - `weak` 0 pts — **< 6 mois / test**: Engagement court, positionnement flou.
  - `ok` 3 pts — **1 an**: Engagement 1 an, souhaite voir.
  - `good` 6 pts — **2-3 ans**: Engagement 2 à 3 ans, projet moyen terme.
  - `excellent` 8 pts — **> 3 ans / long terme**: Vision long terme, souhaite s’installer.

##### Réalisations & gestion de situations

- **rayonniste_cdi_star_1** [C2] Racontez-nous une situation professionnelle difficile que vous avez gérée : contexte, action, résultat.
- **rayonniste_cdi_star_2** [C1] Racontez-nous une réussite dont vous êtes particulièrement fier·e.
- **rayonniste_cdi_conflit** [C3] Comment gérez-vous un désaccord avec un collègue ou un supérieur ?
  - `weak` 0 pts — **Évite le conflit**: Préfère ne pas aborder les désaccords.
  - `ok` 3 pts — **S’adapte au cas par cas**: Aborde parfois, dépend du contexte.
  - `good` 5 pts — **Dialogue direct et respectueux**: Aborde le sujet directement, sans agressivité.
  - `excellent` 7 pts — **Recherche la solution + montre l’exemple**: Propose des solutions, formalise, apaise.

##### Alignement Medijob & partenariat

- **rayonniste_cdi_medijob** [C4] Que savez-vous de Medijob et de notre approche du recrutement en pharmacie ?
- **rayonniste_cdi_officine_ideale** [B7] À quoi ressemble votre officine / environnement de travail idéal ?
- **rayonniste_cdi_references** [C4] Pouvez-vous fournir des références professionnelles vérifiables ?
  - `weak` 0 pts — **Aucune**: Pas de référence à donner.
  - `ok` 3 pts — **Une référence**: Une référence disponible.
  - `good` 5 pts — **2-3 références**: 2 à 3 références professionnelles.
  - `excellent` 7 pts — **Plusieurs récentes + variées**: Plusieurs références récentes, postes variés.

##### Rémunération & conditions attendues

- **rayonniste_cdi_rem_attentes** [B7] Quelles sont vos attentes salariales détaillées (fixe, variable, coefficient CCN, avantages) ?
- **rayonniste_cdi_preavis** [B4] Avez-vous un préavis à respecter ? Sous quel délai pouvez-vous démarrer ?
  - `ok` 3 pts — **3 mois de préavis**: Préavis long (3 mois), démarrage tardif.
  - `good` 5 pts — **1-2 mois**: Préavis standard (1 à 2 mois).
  - `good` 7 pts — **< 1 mois / négociable**: Préavis court ou négociable.
  - `excellent` 8 pts — **Immédiat**: Peut démarrer immédiatement.
- **rayonniste_cdi_essai** [C4] Comment abordez-vous la période d’essai ?
  - `ok` 3 pts — **Crainte / négociation**: Sujet sensible, demande à raccourcir.
  - `good` 5 pts — **Neutre**: Prend la période d’essai comme un standard.
  - `excellent` 7 pts — **Volontaire, opportunité mutuelle**: Voit la période d’essai comme un test à double sens, sereinement.

##### Mobilité géographique

- **rayonniste_cdi_mobilite** [B6] Êtes-vous prêt·e à déménager ou à faire une longue distance quotidienne pour ce poste ?
  - `weak` 0 pts — **Non, zone limitée**: Reste sur sa zone actuelle (< 20 km).
  - `ok` 3 pts — **Jusqu’à 30 min**: OK pour ~30 min de trajet quotidien.
  - `good` 5 pts — **Jusqu’à 1h**: OK pour jusqu’à 1h de trajet.
  - `excellent` 8 pts — **Déménagement possible**: Déménagement envisagé si le poste le justifie.

##### Application Medijob

- **rayonniste_cdi_app_1** Avez-vous déjà téléchargé l’application MEDIJOB ?
- **rayonniste_cdi_app_2** Souhaitez-vous que je vous accompagne pour finaliser votre inscription ?

### `pharmacien` — bundle recovery

- Unique items: **66** · with `?`: **48** · variants: **3**
- Additional vs prior extract: **+32** questions with `?`

API above is authoritative for scored pharmacien. Bundle also has `script_officielle` + scored mirrors:

#### Variant `script_officielle` (profileId_block) — 30 items, 14 with `?`

Label: **Pharmacien(ne)**  
Trame officielle Medijob — Qualification candidat Officine.

##### 1. ACCUEIL

- **pharm_accueil** Bonjour M./Mme [Nom], je suis [Prénom], consultant(e) en recrutement chez MEDIJOB. Merci de prendre quelques minutes pour cet échange. L'objectif de cet entretien est de mieux comprendre votre parcours, vos compétences et vos attentes afin de vous proposer des missions d'intérim ou des opportunités en CDI/CDD qui correspondent réellement à votre profil. L'entretien dure une dizaine de minutes. Est-ce que vous êtes bien disponible ?

##### 2. PARCOURS PROFESSIONNEL

- **pharm_parcours_recit** Pouvez-vous me présenter rapidement votre parcours depuis l'obtention de votre diplôme ?
- **pharm_parcours_crm** À renseigner dans le CRM
- **pharm_raison_depart** Pourquoi souhaitez-vous quitter votre poste actuel ?
- **pharm_these** Thèse soutenue
- **pharm_ordre** Inscription à l'Ordre
- **pharm_section** Section de l'Ordre
- **pharm_types_officine** Types d'officines connues
- **pharm_responsabilites** Responsabilités exercées

##### 3. COMPÉTENCES

- **pharm_autonomie** Aujourd'hui, comment décririez-vous votre niveau d'autonomie en officine ?
- **pharm_missions** Missions réalisées régulièrement en autonomie
- **pharm_nouvelles_missions** Êtes-vous formé(e) aux nouvelles missions officinales ?
- **pharm_logiciels** Logiciels maîtrisés
- **pharm_seul_responsable** Avez-vous déjà assuré seul(e) la responsabilité de l'officine ?
- **pharm_responsabilites_detail** Si oui, dans quels contextes ?

##### 4. SAVOIR-ÊTRE

- **pharm_qualites** Selon vous, quelles sont vos principales qualités en tant que pharmacien(ne) ?
- **pharm_progres** Quels sont aujourd'hui les domaines dans lesquels vous souhaitez encore évoluer ?
- **pharm_adaptation** Comment vous adaptez-vous lorsque vous rejoignez une nouvelle équipe ou une nouvelle officine ?
- **pharm_situation_complexe** Pouvez-vous me parler d'une situation complexe que vous avez dû gérer avec un patient, un collaborateur ou une problématique organisationnelle ?

##### 5. VOTRE RECHERCHE

- **pharm_type_poste** Type de poste recherché
- **pharm_criteres** Critères prioritaires
- **pharm_evolution** Souhaits d'évolution à moyen / long terme
- **pharm_repoussoirs** Environnement ou organisation dans lequel vous ne souhaitez plus travailler ?

##### 6. DISPONIBILITÉS

- **pharm_dispo_crm** À partir de quand êtes-vous disponible et avez-vous des contraintes particulières ?
- **pharm_distance** Jusqu'à quelle distance êtes-vous prêt(e) à vous déplacer ?
- **pharm_permis** Permis
- **pharm_vehicule** Véhicule
- **pharm_types_missions** Acceptez-vous
- **pharm_types_precisions** Précisions

##### 7. RÉMUNÉRATION

- **pharm_remu_crm** Rémunération

#### Variant `interim_scored` (id_label_sections) — 21 items, 21 with `?`

Label: **Pharmacien(ne)**  
Adjoint, titulaire-remplaçant, missions officinales, gestion d’équipe.

##### Parcours & situation

- **pharm_q1** [B1] Êtes-vous en poste actuellement ? Adjoint, titulaire ou remplaçant ?
- **pharm_q2** [B1] Depuis combien d’années exercez-vous en officine ?
- **pharm_q3** [C3] Quels types et tailles d’officines avez-vous connus ?

##### Diplôme & profil

- **pharm_q4** Êtes-vous inscrit(e) à l’Ordre des pharmaciens ? Section A (adjoint) ou D ?
- **pharm_q5** Avez-vous soutenu votre thèse et obtenu le Diplôme d’État de docteur en pharmacie ?

##### Compétences métier

- **pharm_q6** [B2] Avez-vous déjà remplacé un titulaire ? Sur quelles durées ? Seul(e) responsable de l’officine ?
- **pharm_q7** [B2] Avez-vous géré une équipe (préparateurs, étudiants), les plannings, les commandes ?
- **pharm_q8** [B3] Êtes-vous formé aux nouvelles missions officinales ? Si oui, lesquelles ?
- **pharm_q9** [B3] Quels logiciels métier maîtrisez-vous ?

##### Disponibilités & mobilité

- **pharm_q10** [B4] À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?
- **pharm_q11** [B5] Acceptez-vous les missions de dernière minute ? Avec quel préavis ?
  - `weak` 0 pts — **Refuse**: Pas de missions express.
  - `ok` 3 pts — **Avec 24-48h**: OK avec 24 à 48h de préavis.
  - `excellent` 6 pts — **Régulièrement**: Accepte régulièrement les missions express.
- **pharm_q12** [B6] Quelle distance êtes-vous prêt(e) à parcourir ? Disposez-vous d’un véhicule ?

##### Motivation & projet

- **pharm_q13** [B7] Qu’est-ce qui vous plaît dans le remplacement / l’intérim ?
- **pharm_q14** [B7] Quel type de remplacement recherchez-vous (durée, autonomie, type d’officine) ?
- **pharm_q15** [B7] Quelles sont vos attentes et vos critères prioritaires ?

##### Savoir-être & adaptation

- **pharm_q16** [C3] Comment réagissez-vous lorsque vous intégrez une nouvelle équipe pour une mission courte ?
- **pharm_q17** [C3] Avez-vous déjà travaillé dans des officines à forte activité (plus de 600 patients / jour) ?
- **pharm_q18** [C3] Comment gérez-vous les périodes de forte affluence ?
- **pharm_q19** [C4] Avez-vous déjà dû annuler une mission ? Dans quelles circonstances ?

##### Application Medijob

- **pharm_q20** Avez-vous déjà téléchargé l’application MEDIJOB ?
- **pharm_q21** Souhaitez-vous que je vous accompagne pour finaliser votre inscription ?

#### Variant `cdd_cdi_scored` (id_label_sections) — 24 items, 22 with `?`

Label: **Pharmacien(ne)**  
Recrutement CDI/CDD — trame long terme (motivations, projet, réalisations).

##### Parcours & situation

- **pharm_q1** [B1] Êtes-vous en poste actuellement ? Adjoint, titulaire ou remplaçant ?
  - `weak` 4 pts — **En recherche**: En recherche active, sans poste actuel.
  - `ok` 8 pts — **Remplaçant occasionnel**: Remplaçant ponctuel.
  - `good` 12 pts — **Adjoint salarié**: Adjoint en CDI ou CDD long.
  - `excellent` 12 pts — **Titulaire / remplaçant régulier**: Titulaire ou remplaçant régulier établi.
- **pharm_q2** [B1] Depuis combien d’années exercez-vous en officine ?
  - `weak` 0 pts — **Aucune**: Aucune expérience post-thèse.
  - `ok` 4 pts — **< 1 an**: Moins d’un an d’exercice.
  - `good` 8 pts — **1 à 3 ans**: Entre 1 et 3 ans d’exercice.
  - `excellent` 12 pts — **> 3 ans**: Plus de 3 ans d’exercice, parcours stable.
- **pharm_q3** [C3] Quels types et tailles d’officines avez-vous connus ?
  - `weak` 0 pts — **Un type**: Un seul type d’officine.
  - `ok` 3 pts — **Variés**: 2 ou 3 contextes différents.
  - `good` 5 pts — **Plusieurs tailles + types**: Plusieurs tailles et types d’officines.
  - `excellent` 7 pts — **Toutes tailles + forte affluence**: Petites, moyennes, grandes officines dont forte affluence.

##### Diplôme & profil

- **pharm_q4** Êtes-vous inscrit(e) à l’Ordre des pharmaciens ? Section A (adjoint) ou D ?
- **pharm_q5** Avez-vous soutenu votre thèse et obtenu le Diplôme d’État de docteur en pharmacie ?

##### Compétences métier

- **pharm_q6** [B2] Avez-vous déjà remplacé un titulaire ? Sur quelles durées ? Seul(e) responsable de l’officine ?
  - `weak` 0 pts — **Jamais**: Jamais remplacé un titulaire.
  - `ok` 6 pts — **Quelques jours**: Quelques remplacements courts, sans responsabilité totale.
  - `good` 12 pts — **Remplacements moyens**: A déjà été seul(e) responsable sur des durées de 1 à 2 semaines.
  - `excellent` 18 pts — **Remplacements longs et réguliers**: Remplacements longs réguliers, gestion complète de l’officine.
- **pharm_q7** [B2] Avez-vous géré une équipe (préparateurs, étudiants), les plannings, les commandes ?
  - `weak` 0 pts — **Jamais**: Pas de management d’équipe.
  - `ok` 6 pts — **Un peu**: A déjà encadré ponctuellement.
  - `good` 12 pts — **Régulièrement**: Gestion équipe + plannings + commandes en place.
  - `excellent` 18 pts — **Gestion complète d’officine**: A piloté équipe, plannings, commandes, fournisseurs.
- **pharm_q8** [B3] Êtes-vous formé aux nouvelles missions officinales ? Si oui, lesquelles ?
  - `weak` 0 pts — **Non formé**: Pas formé aux nouvelles missions.
  - `ok` 4 pts — **1 à 2 missions**: Formé(e) à 1 ou 2 missions (ex. vaccination).
  - `good` 7 pts — **Plusieurs missions**: Formé(e) à plusieurs missions officinales.
  - `excellent` 10 pts — **Toutes missions à jour**: Formé(e) à toutes les missions officinales courantes, à jour.
- **pharm_q9** [B3] Quels logiciels métier maîtrisez-vous ?
  - `weak` 0 pts — **Aucun**: Aucun logiciel maîtrisé.
  - `ok` 4 pts — **1 logiciel**: 1 logiciel maîtrisé.
  - `good` 7 pts — **2 logiciels**: 2 logiciels métier, polyvalent.
  - `excellent` 10 pts — **3+ logiciels**: 3 logiciels ou plus, s’adapte vite.

##### Projet professionnel long terme

- **pharmacien_cdi_projet_1** [B7] Où vous voyez-vous professionnellement dans 3 ans ?
- **pharmacien_cdi_projet_2** [B7] Pourquoi cherchez-vous un CDI / CDD plutôt que de l’intérim ou de rester dans votre poste actuel ?
- **pharmacien_cdi_projet_3** [B7] Sur quelle durée envisagez-vous de vous engager ?
  - `weak` 0 pts — **< 6 mois / test**: Engagement court, positionnement flou.
  - `ok` 3 pts — **1 an**: Engagement 1 an, souhaite voir.
  - `good` 6 pts — **2-3 ans**: Engagement 2 à 3 ans, projet moyen terme.
  - `excellent` 8 pts — **> 3 ans / long terme**: Vision long terme, souhaite s’installer.

##### Réalisations & gestion de situations

- **pharmacien_cdi_star_1** [C2] Racontez-nous une situation professionnelle difficile que vous avez gérée : contexte, action, résultat.
- **pharmacien_cdi_star_2** [C1] Racontez-nous une réussite dont vous êtes particulièrement fier·e.
- **pharmacien_cdi_conflit** [C3] Comment gérez-vous un désaccord avec un collègue ou un supérieur ?
  - `weak` 0 pts — **Évite le conflit**: Préfère ne pas aborder les désaccords.
  - `ok` 3 pts — **S’adapte au cas par cas**: Aborde parfois, dépend du contexte.
  - `good` 5 pts — **Dialogue direct et respectueux**: Aborde le sujet directement, sans agressivité.
  - `excellent` 7 pts — **Recherche la solution + montre l’exemple**: Propose des solutions, formalise, apaise.

##### Alignement Medijob & partenariat

- **pharmacien_cdi_medijob** [C4] Que savez-vous de Medijob et de notre approche du recrutement en pharmacie ?
- **pharmacien_cdi_officine_ideale** [B7] À quoi ressemble votre officine / environnement de travail idéal ?
- **pharmacien_cdi_references** [C4] Pouvez-vous fournir des références professionnelles vérifiables ?
  - `weak` 0 pts — **Aucune**: Pas de référence à donner.
  - `ok` 3 pts — **Une référence**: Une référence disponible.
  - `good` 5 pts — **2-3 références**: 2 à 3 références professionnelles.
  - `excellent` 7 pts — **Plusieurs récentes + variées**: Plusieurs références récentes, postes variés.

##### Rémunération & conditions attendues

- **pharmacien_cdi_rem_attentes** [B7] Quelles sont vos attentes salariales détaillées (fixe, variable, coefficient CCN, avantages) ?
- **pharmacien_cdi_preavis** [B4] Avez-vous un préavis à respecter ? Sous quel délai pouvez-vous démarrer ?
  - `ok` 3 pts — **3 mois de préavis**: Préavis long (3 mois), démarrage tardif.
  - `good` 5 pts — **1-2 mois**: Préavis standard (1 à 2 mois).
  - `good` 7 pts — **< 1 mois / négociable**: Préavis court ou négociable.
  - `excellent` 8 pts — **Immédiat**: Peut démarrer immédiatement.
- **pharmacien_cdi_essai** [C4] Comment abordez-vous la période d’essai ?
  - `ok` 3 pts — **Crainte / négociation**: Sujet sensible, demande à raccourcir.
  - `good` 5 pts — **Neutre**: Prend la période d’essai comme un standard.
  - `excellent` 7 pts — **Volontaire, opportunité mutuelle**: Voit la période d’essai comme un test à double sens, sereinement.

##### Mobilité géographique

- **pharmacien_cdi_mobilite** [B6] Êtes-vous prêt·e à déménager ou à faire une longue distance quotidienne pour ce poste ?
  - `weak` 0 pts — **Non, zone limitée**: Reste sur sa zone actuelle (< 20 km).
  - `ok` 3 pts — **Jusqu’à 30 min**: OK pour ~30 min de trajet quotidien.
  - `good` 5 pts — **Jusqu’à 1h**: OK pour jusqu’à 1h de trajet.
  - `excellent` 8 pts — **Déménagement possible**: Déménagement envisagé si le poste le justifie.

##### Application Medijob

- **pharmacien_cdi_app_1** Avez-vous déjà téléchargé l’application MEDIJOB ?
- **pharmacien_cdi_app_2** Souhaitez-vous que je vous accompagne pour finaliser votre inscription ?

## Still missing / needs repo or auth

- `/api/evaluations` → **401** without session (stored evaluations, scoring history)
- `/api/auth/*` — not probed (no password login)
- `/api/qualify-project` → **405** on GET (POST-only; body/schema unknown)
- `/api/score` GET ≈ health; real scoring likely POST + auth
- Public `/api/templates` **missing** preparateur, etudiant, conseiller_para, rayonniste — recovered from minified JS only (no server edit API without auth)
- Exact mode flags linking `id_label_sections` blobs to `cdd_cdi` vs `interim` inferred from section titles, not always explicit `mode:` on those objects
- Prompt templates Claude, PDF layout, Netlify function source: **prototype repo required**
- Suggested-answer completeness: Application Medijob sections often have checkbox/action fields without `question:` strings
- Possible admin-only template CRUD at `/api/templates/:id` untested

## Fichiers bruts

- `.raw/eval.html`, `.raw/eval.js`
- `.raw/eval-templates.json`, `.raw/eval-health.json`, probes
- `.raw/eval-extract.json`, `.raw/eval-profiles-deep.json`
