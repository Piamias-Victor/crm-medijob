# ADR 0001 — Un Contact peut appartenir à plusieurs Pharmacies

**Date :** 2026-06-17  
**Statut :** Accepté

## Contexte

La SPEC_V1 modélise `Contact` avec un `pharmacyId` (FK unique → une seule pharmacie). En réalité terrain, un interlocuteur peut gérer plusieurs officines d'un même groupe.

## Décision

La relation Contact ↔ Pharmacie est many-to-many, portée par une table pivot `ContactPharmacy`. La notion de contact principal (`isPrimary`) est portée par cette table (un contact peut être principal pour une pharmacie et secondaire pour une autre).

## Conséquences

- Le schéma Prisma doit remplacer `Contact.pharmacyId` par un modèle `ContactPharmacy { contactId, pharmacyId, isPrimary }`.
- La page `/contacts` liste les contacts avec leur(s) pharmacie(s) associée(s).
- La page `/pharmacies/[id]` > onglet Contacts filtre via `ContactPharmacy.pharmacyId`.
- La SPEC_V1 est considérée obsolète sur ce point.
