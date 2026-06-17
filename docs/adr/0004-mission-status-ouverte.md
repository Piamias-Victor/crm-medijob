# ADR 0004 — Ajout de OUVERTE dans MissionStatus

**Date :** 2026-06-17  
**Statut :** Accepté

## Contexte

La SPEC_V1 initiale utilisait `MissionStatus @default(EN_COURS)`. L'interview `/grill-with-docs` a clarifié que `EN_COURS` signifie « le candidat est activement en poste », pas « la mission est ouverte au recrutement ». Sans statut intermédiaire, une mission nouvellement créée serait incorrectement classée `EN_COURS`.

## Décision

Ajouter `OUVERTE` à l'enum `MissionStatus` comme valeur par défaut à la création. Le passage à `EN_COURS` se fait manuellement lors de l'action « Placer » un candidat.

Valeurs finales : `OUVERTE` | `EN_COURS` | `TERMINEE` | `ANNULEE`.

## Conséquences

- `@default(OUVERTE)` sur `Mission.status`.
- Le kanban `/missions` affiche quatre colonnes de statut.
- L'action « Placer » fait passer `OUVERTE` → `EN_COURS`.
