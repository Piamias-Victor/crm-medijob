# Handoff — Issue #212 (Reset password + idle logout 30 min)

## État

**Mergé / à merger sur `dev`.** Branche `feat/issue-212-auth-reset-idle`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/212
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/237
- Parent : Epic #210 · CSV V1-001
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_212.md` → `done/` après merge
- Plan canvas (session) : `~/.cursor/projects/.../canvases/issue-212-auth-plan.canvas.tsx`

## Livré

- Reset one-shot : `VerificationToken` + tRPC public `auth.requestPasswordReset` / `auth.confirmPasswordReset`
- Sender pluggable : log console `[auth] password reset link` (pas Resend encore)
- Pages `/forgot-password`, `/reset-password` + lien login
- Idle 30 min : JWT `lastActivity` (`applyJwtIdle`) + `IdleSessionGuard` ; override `AUTH_IDLE_MS`
- Tests service/router/idle (TDD)

## Décisions user

| Sujet | Choix |
|-------|-------|
| Email | Pluggable sender, log default |
| Token store | `VerificationToken` existant |
| TTL lien | 1h |
| Idle | JWT maxAge + activity refresh + client timer |
| Activity | mouse/key/scroll/touch + update session |
| API | tRPC public |
| Unknown email | Même `{ ok: true }` (no enum) |
| Test idle | `AUTH_IDLE_MS` |

## Suite

Issue suivante naturelle (socle V1) : **#213** — 4 UserRoles + permission matrix + gate CA/Marge.  
Prompt : `docs/prompts/pending/PROMPT_ISSUE_213.md` (si présent)

## Suggested skills

- `/caveman`
- `/tdd`
- Auth stack = **NextAuth v5** (étendre, ne pas remplacer)
- Prisma migrate skill si schéma rôles change (#213)
