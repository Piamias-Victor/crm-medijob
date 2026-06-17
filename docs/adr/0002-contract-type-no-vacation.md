# ADR 0002 — Suppression de VACATION dans ContractType

**Date :** 2026-06-17  
**Statut :** Accepté

## Contexte

La SPEC_V1 définit `ContractType` avec quatre valeurs : `CDI`, `CDD`, `REMPLACEMENT`, `VACATION`. Il n'existe pas de différence fonctionnelle terrain entre `REMPLACEMENT` et `VACATION` dans le contexte de Medijob.

## Décision

Supprimer `VACATION` de l'enum `ContractType`. Les trois valeurs retenues sont : `CDI`, `CDD`, `REMPLACEMENT`.

## Conséquences

- Le schéma Prisma doit retirer `VACATION` de l'enum `ContractType`.
- Les formulaires de création/édition de mission ne proposent que trois options.
- La SPEC_V1 est considérée obsolète sur ce point.
