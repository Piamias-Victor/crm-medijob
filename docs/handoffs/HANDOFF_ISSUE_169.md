# Handoff — Issue #169 (Import CV depuis liste)

## État

**Prêt merge.** Branche `feat/issue-169-import-cv-list`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/169
- Parent : Epic #19 · Milestone Bloc 1 — Candidats
- Débloque : #170 (doublons)

## Livré

### Flow utilisateur
- Bouton **Créer via CV** sur `/candidats` → file picker direct → modal analyse → `/candidats/new?source=cv`
- Page revue : preview CV + champs extraits + notes internes → `candidate.create` avec `cvUrl`
- Doublons : **hors scope** (#170)

### Backend
- `extractCvDraft` — upload blob + IA sans candidat existant
- `discardCvDraft` — suppression blob si abandon revue
- `candidate.create` accepte `cvUrl` optionnel (blob allowlist)
- `sanitizeCvFilename` sur upload
- Refactor `uploadAndExtractCv` partagé draft/extract fiche

### UI / hooks
- `CreerViaCvButton`, `CvImportAnalyzingModal`
- `CandidateCvExtractionForm` partagé review + create
- `useCvImportFromList`, `useCvImportDraftCleanup`, sessionStorage draft
- Skeleton CVthèque tableau (`CvthequeTableSkeleton`)

### IA / matching
- Prompt `profileSummary` factuel (pas de compliments/invention)
- `matchJobTitles` : mots exacts + stem préparatrice↔préparateur

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| API | `extractCvDraft` + `candidate.create` enrichi |
| Doublons | Skip → #170 |
| Bouton | « Créer via CV », file picker immédiat |
| Notes | Une seule section « Notes internes » |
| Loader | Modal bloquante pendant analyse |

## Tests

```bash
cd apps/web
pnpm vitest run src/lib/cv-upload.test.ts src/lib/cv-import-draft-storage.test.ts src/server/routers/candidate-cv-discard.test.ts src/server/routers/candidate-cv-draft.test.ts src/server/routers/candidate-create-cv.test.ts src/server/routers/candidate-cv.test.ts src/view-models/cv-extraction-review.test.ts src/view-models/candidate-create.schema.test.ts src/server/db/repositories/candidate-profile-write.test.ts src/server/ai/job-title-match.test.ts src/server/ai/cv-extraction-prompt.test.ts
pnpm typecheck && pnpm lint
cd .. && pnpm lint:lines
pnpm dev  # /candidats → Créer via CV
```

## Tests manuels (issue)

1. Créer via CV → PDF → revue → confirmer → fiche candidat avec `cvUrl`.
2. Vérifier preview CV sur page création.
3. Abandon revue → retour liste (blob nettoyé).

## Suite (Bloc 1)

**#170** détection/fusion doublons — brancher sur create + import CV

## Suggested skills

- `/caveman` + `/tdd` pour #170
- `/handoff` en fin de session
