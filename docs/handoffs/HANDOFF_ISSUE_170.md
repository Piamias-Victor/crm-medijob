# Handoff — Issue #170 (Détection et fusion doublons Candidate)

## État

**Prêt merge.** Branche `feat/issue-170-candidate-duplicates`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/170
- Parent : Epic #19 · ADR-0006 · Milestone Bloc 1 — Candidats
- Débloque : #187 (accept inbox + merge Application)

## Livré

### Backend
- `candidate.detectDuplicate` — email OU prénom+nom+tél, double match possible
- `candidate.merge` — fusion profil, soft-delete absorbé, transfert MissionCandidate / ActivityLog / Document / Application
- Re-detect serveur avant merge (`assertMergeDuplicateAllowed`)
- Repos : `candidate-duplicate.repo`, `candidate-merge.repo`
- Logique pure : `duplicate-identity-match`, `collectDuplicateMatches`, `validate-merge-candidates`
- `phonesMatch` partagé avec `intake.ts`

### UI / flux (3/4 déclencheurs)
| Flux | Déclencheur | Action principale |
|------|-------------|-------------------|
| `/candidats/new` | Early (email ou identité) | **Fusionner** → duplicate-review ou continuer |
| `/candidats/new?source=cv` | Early on mount | **Fusionner** → duplicate-review |
| Édition profil | Submit si conflit | duplicate-review |
| Accept Application | — | **Hors scope** → #187 |

- Page `/candidats/duplicate-review` — comparaison champ par champ (#152)
- Modale early alert + picker double match
- Draft sessionStorage (Zod discriminated union create/cv/edit)

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Ignorer doublon | Créer quand même (2e candidat) |
| Double match | Lister les deux, user choisit |
| Accept Application | Reporté #187 |
| Create manuel | Fusionner (aligné CV), plus seulement « Modifier la fiche » |

## Dette / audit post-merge

- Race submit vs fetch debounce (350 ms) — `guardSubmit` peut laisser passer si fetch en cours
- `findIdentityByNamePhone` : `take: 25` + filtre suffixe tel
- Casts résiduels `CandidateCvExtractionCreateForm` (create → profile fields)
- Labels hardcodés dans `candidate-duplicate-fields.ts`

## Tests

```bash
cd apps/web
pnpm typecheck
pnpm vitest run src/lib/phone-normalize.test.ts src/lib/candidate-duplicate-probe.test.ts src/view-models/candidate-duplicate.schema.test.ts src/server/candidate/ src/server/application/intake.test.ts src/server/db/repositories/candidate-merge.repo.test.ts src/server/db/repositories/candidate-duplicate.repo.test.ts src/server/routers/candidate-duplicate.test.ts
cd .. && pnpm lint:lines
```

## Tests manuels (issue)

1. Créer candidat email existant → fusion → garder téléphone nouveau → OK.
2. Import CV doublon → Fusionner → duplicate-review → fusion OK.
3. Édition profil conflit → duplicate-review → fusion ou ignorer.
4. Double match → picker → fusion sur bon candidat.

**Non testé en session :** accept Application (#187).

## Suite

**#187** — inbox candidatures : accept/refuse + merge via infrastructure #170

## Suggested skills

- `/caveman` + `/tdd` pour #187
- `/handoff` en fin de session
