# Prompt — Issue #367

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/367  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : #366  
**Slug branche** : `feat/issue-367-app-validated-candidate`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #365. Origine App ≠ Qualifié. ACCEPTE Profils app reste possible.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff `#366`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-367-app-validated-candidate origin/dev
```

---

## Périmètre

App-validated (`COMPLETED` / `valid`) → create ou link **Candidate** origine App, status **Nouveau**. Fusion email puis tél. Sortie inbox Profils app (pas Ignore). Hireflix pending annulé. CREATED reste Profils app.

### Acceptance criteria

- [ ] COMPLETED → Candidate origine App, status Nouveau si création
- [ ] Lien par email, sinon téléphone ; pas de second Candidate
- [ ] Fusion : status existant conservé (Qualifié reste Qualifié)
- [ ] AppProfile correspondant quitte l’inbox (pas IGNORE)
- [ ] Hireflix pending annulé si encore EN_ATTENTE
- [ ] CREATED inchangé dans Profils app
- [ ] Tests createCaller / sync injecté, pas d’appel live Badakan

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- RSC lectures / `trpc.useMutation()` client
- Réutiliser `duplicate-identity-match` / `phonesMatch` (email d’abord, puis tél)
- **Interdit : `git worktree`**

Vocabulaire : App-validated, Candidate origin, AppProfile, Hireflix invitation. ADR 0026.

## Fichiers impactés

- `apps/web/src/server/app-profile/sync-validated.ts` — COMPLETED → create/link Candidate origine App
- `apps/web/src/server/app-profile/run-cycle.ts` — searchEmployees → syncValidated puis inviteDue
- `apps/web/src/server/db/repositories/candidate-app-origin.repo.ts` — origin APP / badakanId, status inchangé au link
- `apps/web/src/server/candidate/duplicate-identity-match.ts` — email puis tél (`pickPhoneMatch`)
- `apps/web/src/server/app-profile/invite-due.ts` — cancel si plus EN_ATTENTE (APP_VALIDATED)
- `apps/web/prisma/schema.prisma` — `AppProfileStatus.APP_VALIDATED`

---

## Fin

PR vers `dev` avec `Closes #367`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Après sync (ou fixture COMPLETED) : Candidate Nouveau origine App dans CVthèque
- [ ] Même email qu’un Qualifié existant → un seul Candidate, toujours Qualifié
- [ ] Le profil a quitté Profils app ; un CREATED y reste
