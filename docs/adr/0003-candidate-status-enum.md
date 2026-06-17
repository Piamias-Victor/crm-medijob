# ADR 0003 — Ajout de CandidateStatus sur Candidate

**Date :** 2026-06-17  
**Statut :** Accepté

## Contexte

La SPEC_V1 ne modélise la disponibilité d'un candidat que par `availableFrom: DateTime?`. Cela ne suffit pas à exprimer les états métier réels : un candidat peut être en mission, sous préavis, ou inactif.

## Décision

Ajouter un champ `status: CandidateStatus` sur `Candidate` avec l'enum :
```prisma
enum CandidateStatus {
  DISPONIBLE
  EN_MISSION
  SOUS_PREAVIS
  INACTIF
}
```

`availableFrom` est conservé pour indiquer une date future de disponibilité (ex. : fin de préavis).

Le `CandidateStatus` est géré manuellement par le recruteur — il n'est pas calculé automatiquement à partir du pipeline.

## Conséquences

- Ajout du champ `status CandidateStatus @default(DISPONIBLE)` dans le schéma Prisma.
- Les badges de statut sur les fiches et listes candidats utilisent ce champ.
- La SPEC_V1 est considérée obsolète sur ce point.
