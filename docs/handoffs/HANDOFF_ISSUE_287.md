# Handoff — Issue #287 (Anonymized dossier structuré)

## État

**Validé user · prêt merge `dev`.** Branche `feat/issue-287-anonymized-dossier-sections`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/287
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/292
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_287.md` → à déplacer `done/` **après** merge
- Glossaire : `CONTEXT.md` § Anonymized dossier (modale, pas éditeur Documents)

## Livré

Voir diff PR #292. Points d’entrée :

- Schéma Zod 6 sections : `view-models/anonymized-dossier.schema.ts` (+ parse / labels / export)
- Stockage : JSON stringifié dans `Candidate.anonymizedProfile` (pas de migration Prisma ; legacy markdown = null parse → regen)
- Gen + save : `generateAnonymized` / `saveAnonymized` ; PII partagée `candidate-anonymized-pii-dossier.ts`
- UX : clic bouton → `AnonymizedDossierModal` (GlassModal) → IA ou load existant → edit → **Générer le PDF**
- PDF brandé : `anonymized-profile-document.tsx` + `.styles.ts` (hero + blocs numérotés)
- `cvSummary` **n’est plus un prérequis** (notes / métier / mobilité en contexte)

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Shape sections | plain string, 6 clés camelCase, `""` = vide |
| Stockage | même colonne `String?` JSON |
| Edit UI | **modale** (pas éditeur permanent Documents) |
| Résumé IA | **ne pas bloquer** la gen dossier |
| PDF / encarts | redesign hero + cards ; modale large, textareas grands |

## Suite

- Merge PR #292 → `dev`
- `git mv docs/prompts/pending/PROMPT_ISSUE_287.md docs/prompts/done/` + commit push **direct `dev`**
- Phase 5 : supprimer branche locale / remote après merge si besoin

## Suggested skills

- `/caveman`
- `/tdd`
- Relire `use-anonymized-dossier-modal.ts` + PDF styles si retune design
