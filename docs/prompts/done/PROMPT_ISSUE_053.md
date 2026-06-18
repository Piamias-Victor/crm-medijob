# Prompt — Issue #53

**Titre** : [FONDATIONS] Auth NextAuth v5 — login Argon2id + middleware + rôles  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/53  
**Parent** : #19  
**Blocked by** : #52 · **Débloque** : #54, #59, #76, #77

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_052.md`, `SPEC_V2.md` §5, issue #53.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_052.md` (repos, User model, `.env`, scripts db)
3. Créer le worktree (travailler **exclusivement** dedans) :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-53 -b feat/issue-53-auth-nextauth-v5 origin/dev
cd ../crm-medijob-issue-53
```

---

## Périmètre

NextAuth v5 credentials (email/password Argon2id), sessions DB, page `/login`, middleware dashboard, rôles `RECRUTEUR | ADMIN`.

- Tous les RECRUTEUR voient tout — `referentId` informatif (SPEC_V2 §5)
- Nav **Admin** visible/accessible **ADMIN uniquement**
- Seed : 1 user ADMIN + 1 user RECRUTEUR (mot de passe documenté dans handoff, pas en clair dans le repo)
- Soft-deleted User → login refusé

**Hors périmètre** : CRUD utilisateurs (#78), modules métier (#54+).

**US** : #1, #2

### Critères d'acceptation

- [ ] `/login` — formulaire RHF + Zod (email, password)
- [ ] Argon2id hash ; sessions en DB (Account/Session déjà en schéma #52)
- [ ] Middleware : non-auth → redirect `/login` ; `(dashboard)/*` protégé
- [ ] RECRUTEUR : CRM OK, `/admin/*` → 403 ou redirect
- [ ] ADMIN : `/admin/*` accessible (placeholders OK)
- [ ] tRPC context : `session.user` + `role`
- [ ] Test intégration : login + role gate

---

## Fichiers impactés

Modèles Prisma déjà en place (#52). Créations probables :

- `apps/web/src/server/auth/config.ts` — NextAuth v5 config + credentials provider
- `apps/web/src/server/auth/index.ts` — exports `auth`, `signIn`, `signOut`
- `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- `apps/web/src/middleware.ts` — protection routes + gate admin
- `apps/web/src/app/(auth)/login/page.tsx` + form molecule
- `apps/web/src/server/db/repositories/user.repository.ts` — lookup by email, respect `deletedAt`
- `apps/web/src/server/trpc.ts` — context session
- `apps/web/prisma/seed.ts` — ajout users ADMIN/RECRUTEUR
- `apps/web/.env.example` — `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `apps/web/src/lib/navigation.ts` / `AppSidebar.tsx` — masquer Admin si non-ADMIN
- Test : `auth.integration.test.ts` ou router test

Handoff #52 : Prisma **uniquement** via repositories ; `.env` dans `apps/web/`.

---

## Contraintes

Voir `CLAUDE.md` : Argon2id (pas bcrypt), NextAuth v5 App Router pattern, fichiers < 100 lignes, zéro `any`.

Ne pas importer `@prisma/client` hors `repositories/`. Passwords jamais loggés.

---

## Fin de session

**Uniquement quand l'utilisateur le demande** :

1. Si `/handoff` : `docs/handoffs/HANDOFF_ISSUE_053.md` commité **avec le code**
2. Push : `git push -u origin feat/issue-53-auth-nextauth-v5`
3. PR vers `dev` avec `Closes #53`

**En fin de message** (prêt à tester) : donner le bloc « Commande de test » copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-53
pnpm install   # première fois uniquement
cp apps/web/.env.example apps/web/.env   # DATABASE_URL + NEXTAUTH_SECRET + NEXTAUTH_URL
pnpm --filter web db:seed
pnpm dev
```

Ouvrir http://localhost:3000 → redirect `/login`. Tester RECRUTEUR puis ADMIN (identifiants dans handoff).

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Non connecté → `/candidats` redirect `/login`
- [ ] Login RECRUTEUR → dashboard OK ; `/admin` bloqué ; Admin absent de la sidebar
- [ ] Login ADMIN → `/admin` OK ; entrée Admin visible
- [ ] Mauvais mot de passe → erreur, pas de session
- [ ] Logout → redirect `/login`
- [ ] `pnpm test && pnpm lint && pnpm typecheck` → vert
