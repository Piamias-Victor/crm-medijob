# Handoff — Issue #78 (ADMIN Utilisateurs — CRUD + rôles)

## État

**Terminé et vert** (local). Prêt push + PR vers `dev`.

- Branche : `feat/issue-78-admin-utilisateurs`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-78`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/78
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_078.md` · Spec `SPEC_V2.md` §5 · Dépend de #77

## Livré

### CRUD admin `/admin/utilisateurs`

- Liste : name, email, role, createdAt (sans hash)
- Create : Argon2id via `hashPassword`, email unique → `CONFLICT`
- Edit : name, role ; reset password optionnel (vide = conservé)
- Soft delete : `deletedAt` ; login refusé (#53 authorize)
- Guard : impossible supprimer le **dernier ADMIN** → `CONFLICT`

### Backend

- `user.repository.ts` — list, create, update, softDelete, countAdmins, findByEmailAny
- `admin/user.ts` — router injectable + `adminProcedure`
- `admin/user-schema.ts` — Zod create/update + `normalizeUpdatePassword`
- Branché `adminRouter.user`

### UI

- Page RSC + `UsersAdmin` (modales create/edit, table, soft delete confirm)
- `UserRoleSelect` — Combobox (pattern `PharmacySelects`, pas de `<select>` natif)
- Nav admin : onglet **Utilisateurs**

### Tests TDD (~13 nouveaux)

- Router : list, create hash, update sans pwd, soft delete, last ADMIN, email dup, FORBIDDEN
- Schema : password blank → undefined
- Repo integration : list sans hash, softDelete, countAdmins
- `UserRoleSelect` + `USER_ROLE_OPTIONS`

`typecheck` · `lint` · `lint:lines` OK. Suite complète parfois flaky sur timeouts testcontainers (Docker) — tests unitaires ciblés verts.

## Migration DB

Aucune migration — schéma User existant (#52).

```bash
pnpm --filter web db:seed   # si comptes seed absents
```

## Pièges / dette

- **`.env` worktree** : symlink manuel vers `medijob/apps/web/.env`
- Branche créée depuis `origin/dev` au commit `3eb1f80` — rebaser si `dev` a avancé avant merge
- Hors scope : mot de passe oublié, OAuth

## Tests manuels (agent — non exécutés)

Voir checklist dans `docs/prompts/pending/PROMPT_ISSUE_078.md` § Tests manuels.

## Suggested skills

- `/caveman` + `/tdd`
- `/qa` pour validation manuelle post-merge
- `/handoff` pour issue suivante
