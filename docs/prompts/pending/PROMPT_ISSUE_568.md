# Prompt — Issue #568

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/568  
**Parent** : Milestone 21 · ADR 0037  
**Blocked by** : #567

## Skills

```
/caveman
/tdd
/code-review
```

Also: vercel-react-best-practices + web-design-guidelines (CRM privé: pas SEO/CRO).

## Critères d'acceptation

- [ ] Formulaire création Offre sans mission
- [ ] BAN géocode; ville non géocodable → blocage message clair
- [ ] Parcours mission inchangé
- [ ] Mêmes droits d'écriture JobOffer

## Fichiers probables

- `apps/web/src/components/molecules/JobOfferCreateModal.tsx`
- standalone form organism/molecules
- tRPC createStandalone mutation
- view-model zod schema

## Tests manuels

- [ ] /offres → Créer → Sans mission → ville inventée → erreur géocode
- [ ] Ville réelle → brouillon créé avec lat/lng
- [ ] Créer depuis mission → toujours OK

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install
pnpm dev
```

## Compte rendu

