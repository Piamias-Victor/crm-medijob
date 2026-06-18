# Handoff — Issue #53 (Auth NextAuth v5 — login Argon2id + middleware + rôles)

`/caveman` + `/tdd` actifs.

## État

**Terminé et vert.** Login email/password Argon2id, sessions JWT, middleware de protection + gate admin, rôles `RECRUTEUR | ADMIN`, page `/login` redessinée.

- Branche : `feat/issue-53-auth-nextauth-v5`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-53`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/53
- Prompt : `docs/prompts/PROMPT_ISSUE_053.md` · Spec : `SPEC_V2.md` §5 + §6
- Dépend de #52 (schéma, `repositories/client.ts`, modèles User/Account/Session)

## Décision clé : sessions **JWT** (pas DB)

Le provider Credentials d'Auth.js v5 ne supporte **que** la stratégie JWT (DB sessions incompatibles sans workaround fragile). Choix validé avec l'utilisateur. `role` + `id` portés dans le token. Tables `Account`/`Session` conservées au schéma pour OAuth/DB-session futur.

## Livré (voir diff PR)

- `src/server/auth/password.ts` — Argon2id via `@node-rs/argon2` (`hashPassword`/`verifyPassword`)
- `src/server/auth/access.ts` — gate **pur** : `evaluateAccess`, `isAdminPath`, `LOGIN_PATH`/`HOME_PATH`
- `src/server/auth/authorize.ts` — check creds (deps injectables), soft-deleted → `null`, jamais le hash exposé
- `src/server/auth/schema.ts` — `loginSchema` (Zod)
- `src/server/auth/config.ts` — config edge-safe : `authorized` callback (protection + gate admin), `secret` (AUTH_SECRET ?? NEXTAUTH_SECRET), `trustHost`
- `src/server/auth/index.ts` — NextAuth (jwt, Credentials, callbacks `jwt`/`session`) ; exports `auth`/`handlers`/`signIn`/`signOut`
- `src/server/auth/types.d.ts` — augmentation `Session`/`User` (role)
- `src/app/api/auth/[...nextauth]/route.ts` — handlers GET/POST
- `src/middleware.ts` — matcher hors `api`/`_next`/`login`/`design-system`/static ; non-auth → `/login`, non-ADMIN sur `/admin/*` → redirect `/candidats`
- `src/app/(dashboard)/admin/layout.tsx` — garde serveur (défense en profondeur)
- `src/server/trpc.ts` — context `{ session }` (auth importé en **dynamic import** + try/catch pour vitest) + `protectedProcedure`
- `src/app/(auth)/login/page.tsx` — page redessinée (carte centrée, logo MedicalCross, fond `bg-surface`)
- `src/components/molecules/LoginForm.tsx` — RHF + Zod + `signIn('credentials')`
- `src/components/molecules/PasswordInput.tsx` — toggle œil afficher/masquer (ref RHF via props, React 19)
- `src/components/molecules/LogoutButton.tsx` — `signOut({ callbackUrl: '/login' })`
- `src/components/organisms/AppSidebar.tsx` + `DashboardShell` + `(dashboard)/layout.tsx` — entrée Admin visible **ADMIN only**, role passé via `auth()`
- `src/server/db/repositories/user.repository.ts` — `findByEmail`/`findById`, respecte `deletedAt`
- `prisma/seed-users.ts` — upsert ADMIN + RECRUTEUR ; `pickSeedPassword` (fallback si env vide)
- `.env.example` — `AUTH_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `SEED_*_PASSWORD`

### Tests (TDD red→green)

- `password.test.ts`, `access.test.ts`, `authorize.test.ts`, `auth.integration.test.ts` (login + role gate), `seed-users.test.ts`, `PasswordInput.test.tsx`, `AppSidebar.test.tsx` (gating admin)
- `user.repository.integration.test.ts` — **Testcontainers** (Docker requis, CI)
- Total **40 tests** verts hors intégration DB ; `lint` · `typecheck` · `lint:lines` verts ; `next build` OK (middleware 86.9 kB, zéro argon2/prisma en edge)

## Identifiants seed (dev)

- ADMIN : `admin@medijob.fr` / `admin-medijob-2026`
- RECRUTEUR : `recruteur@medijob.fr` / `recruteur-medijob-2026`
- Override via `SEED_ADMIN_PASSWORD` / `SEED_RECRUTEUR_PASSWORD` (sinon fallback ci-dessus)

## Pièges / dette

- **Seed mot de passe vide** : `SEED_*=` (vide) donne `''`, et `'' ?? fallback` garde `''` → `pickSeedPassword` utilise `|| `+ longueur. Si tu changes, garde ce comportement.
- **Augmentation JWT** : `next-auth/jwt` ne résout pas via pnpm (re-export `@auth/core/jwt`) → pas d'augmentation, narrowing runtime dans le `session` callback (sans `any`).
- **`.env` partagé entre worktrees** : `apps/web/.env` du worktree est un **symlink** vers `medijob/apps/web/.env` (source unique : DATABASE_URL Neon + AUTH_SECRET). Pour un nouveau worktree : `ln -s /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env`.
- Vieux cookie de session → `JWTSessionError: no matching decryption secret` au 1er chargement, sans gravité (traité comme déconnecté).
- `package.json#prisma` deprecated (warning Prisma 7) — dette héritée de #52.

## Hors scope (pour la suite)

- CRUD utilisateurs (#78), mot de passe oublié / reset, pages `/admin/*` réelles (#54+).

## Suggested skills

- `/caveman` + `/tdd` pour toute issue
- Plugin Prisma (`prisma-client-api-*`) pour le travail DB
