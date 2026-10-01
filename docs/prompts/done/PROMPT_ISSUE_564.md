# Prompt — Issue #564

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/564  
**Parent** : Milestone 21 · PRD `docs/prd/21-offres-standalone-carte.md`  
**Blocked by** : None

## Skills

```
/caveman
```

Docs-only — no `/tdd`. `/code-review` on the docs diff.

## Critères d'acceptation

- [x] ADR 0037 merged
- [x] CONTEXT glossary: Offre liée, Offre sans mission, Sections d'offre; JobOffer updated
- [x] PRD + run journal present under docs/

## Fichiers probables

- `docs/adr/0037-job-offer-without-mission.md`
- `CONTEXT.md`
- `docs/prd/21-offres-standalone-carte.md`
- `docs/handoffs/21-offres-run.md`

## Tests manuels

- [x] Ouvrir ADR 0037 : contexte audit 95 offres, décisions 1–11, conséquences
- [x] CONTEXT : chercher « Offre sans mission » et « Sections d'offre »
- [x] Confirmer aucune mention Mapbox obligatoire (Leaflet ADR 0013)

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm lint:prompts
```

## Compte rendu

- ADR 0037 + CONTEXT (Offre liée / sans mission / Sections d'offre)
- PRD 21 + journal `docs/handoffs/21-offres-run.md`
- Prompts pending #565–#571 ; milestone GitHub 21 ; issues #564–#571
- Format titre retenu : poste seul (61 % audit API)
