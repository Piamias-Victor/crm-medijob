# JobOffer sans mission, mapping MEDIJOB, description sectionnée

## Contexte

Audit GET `medijob-offres` (95 offres, 2026-10-01) :

- `entreprise` = `"MEDIJOB"` dans 100 % des cas (jamais le nom de pharmacie).
- `profil_recherche`, `salaire_*`, `avantages` toujours `null` — tout le texte vit dans `description` (HTML).
- Titres : majorité = **libellé du poste seul** (58/95 ≈ 61 %) ; la ville est le champ `ville`, jamais dans le titre.
- CRM actuel : `JobOffer.missionId` obligatoire ; publication mappe `entreprise` ← `pharmacy.name` ; l’IA produit un HTML libre.

Les recruteurs veulent aussi des offres **sans Mission**, une vue **Liste | Carte** sur `/offres`, et une description HTML sectionnée fiable.

## Décision

1. `entreprise` = constante `"MEDIJOB"` pour toute publication.
2. Titre = poste seul (fonction pure) ; ville = champ séparé (mission.pharmacy.city ou champ standalone).
3. Description = HTML à 4 sections exactes : RÉSUMÉ DU POSTE · MISSIONS DU POSTE · PROFIL RECHERCHÉ · INFORMATIONS COMPLÉMENTAIRES — titres en `<p><strong>…</strong></p>` ; résumé en `<p>` ; les 3 autres en `<ul><li>`.
4. L’IA renvoie un JSON Zod `{ resume, missions[], profil[], infos[] }` ; un renderer pur produit le HTML échappé. JSON invalide → 1 retry puis erreur UI ; jamais de HTML malformé publié.
5. Pas de nouveau travail sur `profil_recherche` / salaires / avantages API (le site ne les affiche pas).
6. `JobOffer.missionId` nullable (`@unique` conservé) + champs standalone (métier, ville, geo, contrat, salaires, contenu).
7. Un résolveur pur : lié → Mission ; standalone → champs offre.
8. Géocode standalone = BAN existant (ADR 0013) ; ville non géocodable → formulaire bloqué.
9. `/offres` : Liste | Carte (Leaflet + OSM, ADR 0013 — pas Mapbox) ; badge Source ; pins filtrables.
10. Parcours « depuis mission » inchangé ; ajout parcours « sans mission ».
11. Hors périmètre : site public, carte fiche publique, republication auto.

## Conséquences

- Résolveur unique pour le payload board ; offres liées inchangées hors `entreprise` / titre / description.
- Offres standalone géocodées à la création ; pins `/offres` pour les deux sources.
- Description générée par code depuis JSON, pas par l’IA HTML.
- Offres déjà en ligne : republication manuelle (script `--dry-run` / `--apply` pour Victor).
