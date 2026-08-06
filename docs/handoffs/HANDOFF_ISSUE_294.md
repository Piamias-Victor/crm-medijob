# Handoff — Issue #294 (Profils app Badakan)

## État

**Validé user · merge sur `dev`.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/294
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/295
- Prompt : `docs/prompts/done/PROMPT_ISSUE_294.md`
- Glossaire : `CONTEXT.md` § AppProfile

## Livré

Voir diff PR #295. Points d’entrée :

- Prisma `AppProfile` + migrations Badakan
- `server/badakan/` — login `/services/v3`, `searchNewEmployees`, download RESUME
- `server/app-profile/` — sync / accept / ignore / import CV blob
- UI : onglet **Profils app** (`?tab=app-profiles`), sync manuel, popup accept (GlassModal), adresse + CV

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Emplacement | 3ᵉ onglet candidats (pas inbox candidatures site) |
| Traité | Accept ou Ignorer → exclus resync |
| Sync V1 | bouton manuel |
| Métier | afficher si `activities` (rare ~1 %) |
| CV / adresse | adresse en sync ; CV à l’accept |

## Suite

- Hors scope : `#230` CMS publish, `#231` candidatures site, cron sync
- Phase 5 : cleanup branche `feat/issue-294-profils-app-badakan`

## Suggested skills

- `/caveman`
- `/tdd`
- `docs/API_Site_Offres_Medijob.md` si reprise `#230`
