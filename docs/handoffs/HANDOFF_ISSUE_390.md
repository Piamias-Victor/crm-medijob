# Handoff — Issue #390 (DRY audit Intérim)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Pas de prompt pending préalable — créé directement dans `done/` (travail déjà implémenté).

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/390
- Parent : audit Intérim post-#377 — `docs/handoffs/HANDOFF_ISSUE_377.md`
- PRD : `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0030`
- Branche : `fix/issue-390-interim-audit-dry` — **repo `medijob` only, jamais `git worktree`**
- Prompt : `docs/prompts/done/PROMPT_ISSUE_390.md`
- Transcript : [audit Intérim + DRY](c1384c70-11a1-4b42-9fc4-45ddb6d5cd00)
- Next : High restants de l’audit (login Badakan, GET séquentiels, PDF href, token weekly-availability)

## Livré

Refactor interne. Pas de nouvelle UI, pas d’écriture Badakan, pas de Ligne de suivi.

- Repo : `jobTitleRepository.findIdByNameInsensitive` — `app-profile.deps` n’importe plus Prisma
- Tests cycle : `stubCycleDeps` (`run-cycle.test-deps.ts`) — 7 fichiers
- Accept : `CandidateProfileUpdate` via `toCandidateCreateData` — plus d’assertions `as`
- Sync : `syncPagedRead` partagé missions + contrats (wrappers minces)

## Décisions

| Sujet | Choix |
|-------|--------|
| Issue | #390 créée pour `Closes #N` (pas d’issue avant le DRY) |
| Prompt | `done/` direct — jamais passé par `pending/` |
| Grill | Interdit — 4 items audit, pas de feature |
| Hors slice | cache `security_token`, GET parallèles, allowlist PDF, token weekly-availability |

## Pièges

- `stubCycleDeps` : override `client` = `Partial<BadakanClient>` mergé sur `emptyClient` (`CycleOverrides`)
- `syncPagedRead` reste séquentiel (même comportement qu’avant)
- `pnpm test` : `*.integration.test.ts` KO si Docker down. Unrelated
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [x] User `/handoff` + merge demandés cette session
- [ ] Intérim listes inchangées
- [ ] Accept Profils app
- [x] Auto : `tsc --noEmit` + `lint:lines` + unitaires DRY verts (session précédente)

## Suite

1. Merge PR → `dev` (`gh pr merge`, pas de push direct code)
2. Phase 5 : `git checkout dev && git pull && git branch -d fix/issue-390-interim-audit-dry`
3. Prompt déjà dans `docs/prompts/done/`
4. Next agent : High audit restants — **pas** re-DRY #390

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)
- `/audit-codebase` (reprise High restants)
