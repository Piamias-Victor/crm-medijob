# Handoff — Issue #154 (Page /candidats/new)

## État

**Prêt merge.** Branche `feat/issue-154-candidats-new-page`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/154
- Parent : Epic #19 · Milestone Bloc 1 — Candidats
- Débloque : #169 (`?source=cv`), flux create sans modale

## Livré

### Route `/candidats/new`
- RSC + `createServerCaller` · defaults référent = user connecté · mobilité 20 km
- Redirect si pas de jobTitle en référentiel

### UI
- `CandidateCreatePage` — shell fiche (`EntityDetailShell` + `DetailPageHeader`), **sans onglets**
- `CandidateCreateForm` — réutilise `CandidateProfileFields` / `CandidateProfileSelects`
- Section **Notes internes** en bas (pas de bouton IA — résumé IA reste sur fiche via `cvSummary`)
- 3 types contrat create (CDI/CDD/INTERIM) via `createContractOptions`

### Backend
- `candidate.create` → schema complet `candidateCreateInputSchema`
- `createProfile` repo + `candidate-profile-write.ts` (DRY avec update)
- Submit → redirect `/candidats/[id]`

### Cleanup
- Modales candidat supprimées (`CandidateFormModal`, quick-create)
- Liste + accueil → lien `/candidats/new`
- Combobox hover accent

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Schema | Étendre `candidate-profile.schema.ts` |
| UI | Réutiliser composants fiche profil |
| API | Remplacer quick-create par schema complet |
| Doublons | Skip #154 → wiring #170 |
| Contrats create | 3 types seulement |
| Defaults | référent=user · mobilité=20 · collections vides OK |
| Modales | Supprimées |
| Post-submit | redirect fiche candidat |
| Layout | Comme fiche `/candidats/[id]` sans onglets |
| Tests auto | Schema Zod + router create + write mapper |
| `?source=cv` | Hors scope (#169) |
| Notes vs cvSummary | Notes internes = textarea · Résumé IA = panneau fiche uniquement |

## Tests

```bash
cd apps/web
pnpm vitest run src/view-models/candidate-create.schema.test.ts src/server/routers/candidate.test.ts src/server/db/repositories/candidate-profile-write.test.ts
pnpm typecheck && pnpm lint
cd .. && pnpm lint:lines
pnpm dev  # /candidats/new · /candidats → Nouveau candidat
```

## Suite (Bloc 1)

Ordre milestone : **#157** tableau + filtres + kanban → #161 → #169 → #170 doublons

## Points d'attention

- Casts `UseFormRegister<CandidateProfileInput>` dans create form — refactor form partagé possible
- Pas de détection doublon à la création (#170)
- `DEFAULT_MOBILITY_RADIUS_KM=30` edit · `CREATE_DEFAULT=20` create (`candidate-mobility.ts`)

## Suggested skills

- `/caveman` + `/tdd` pour #157
- `/handoff` en fin de session
