# Prompt — Issue #78

**Titre** : [ADMIN] Utilisateurs — CRUD + rôles RECRUTEUR/ADMIN  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/78  
**Parent** : #19  
**Blocked by** : #77 · **Débloque** : —

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_077.md`, `SPEC_V2.md` §5, issue #78.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_077.md` (adminProcedure, admin nav, auth session fix)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-78 -b feat/issue-78-admin-utilisateurs origin/dev
cd ../crm-medijob-issue-78
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/admin/utilisateurs` — CRUD User ADMIN-only : name, email, password (create/reset), role RECRUTEUR|ADMIN, soft delete.

- Hash Argon2id (réutiliser `server/auth/password.ts` #53)
- Soft-deleted → login refusé (#53 authorize)
- Guard : impossible de supprimer le **dernier ADMIN**

**Hors périmètre** : mot de passe oublié, OAuth.

**US** : #2

### Critères d'acceptation

- [ ] Liste name, email, role, createdAt
- [ ] Create avec Argon2id
- [ ] Edit name/role ; reset password optionnel
- [ ] Soft delete
- [ ] Dernier ADMIN protégé
- [ ] Email unique (Zod + repo)

---

## Fichiers impactés

- `app/(dashboard)/admin/utilisateurs/page.tsx`
- `server/routers/admin/user.ts` — CRUD
- `server/db/repositories/user.repository.ts` — extend list/create/update/softDelete/countAdmins
- UI : UserTable, UserForm (réutiliser AdminSectionCard #77)
- Ajouter lien nav admin si absent

Réutiliser patterns admin #77 (`adminProcedure`, RSC + mutations).

---

## Contraintes

ADMIN only, jamais exposer hash, fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_078.md` + push + PR `Closes #78`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-78
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login **ADMIN** : `admin@medijob.fr` / `admin-medijob-2026` → http://localhost:3000/admin/utilisateurs

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] RECRUTEUR → `/admin/utilisateurs` bloqué
- [ ] Créer RECRUTEUR → login OK sans admin
- [ ] Promouvoir ADMIN → routes admin OK
- [ ] Soft delete → login échoue
- [ ] CI locale verte
