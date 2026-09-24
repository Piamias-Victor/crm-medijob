# Prompt — Issue #481

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/481  
**Parent** : PRD #480 — Entrées app  
**Blocked by** : none  
**Slug branche** : `feat/issue-481-entrees-app-liste`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #480 · ADR-0032 · `CONTEXT.md` (App intake follow-up).

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-481-entrees-app-liste origin/dev
```

Lire `docs/PRD_APP_INTAKE_FOLLOW_UP.md`, `docs/adr/0032-app-intake-follow-up-entrees-app.md`, `docs/ISSUE_DEPENDENCIES_ENTREES_APP.md`.

---

## Périmètre

Onglet Intérim **« Entrées app »** → `/interim/entrees-app`. Liste lecture seule des AppProfiles **pas** App-validated et **pas** Ignore. Colonnes identité : tél, prénom, nom, email, métier/profil, ville, CP, inscrit le. Ne pas retirer Profils app. Pas de champs ops intake. `/interim/candidats` inchangé.

### Acceptance criteria

- [ ] Subnav « Entrées app » → `/interim/entrees-app`
- [ ] Liste = population défaut (hors App-validated, hors Ignore)
- [ ] Colonnes identité lecture seule
- [ ] Tests nav + list (createCaller / repo)
- [ ] Fichiers < 100 lignes, TDD, Prisma seulement repositories

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories · RSC lectures · atomic design · view-models
- **Interdit : `git worktree`**
- Vocabulaire : App intake follow-up, AppProfile, App-validated — pas Candidate status

## Fichiers impactés (indicatifs)

- `apps/web/src/lib/navigation.ts` — interimSubNav
- `apps/web/src/app/(dashboard)/interim/entrees-app/` — page RSC
- `apps/web/src/server/routers/app-profile.ts` — list query si besoin
- tests nav / list

---

## Fin

PR vers `dev` avec `Closes #481`. Phase 3 : commande de test + checklist manuelle. Handoff seulement si demandé.

## Commande de test

```bash
cd apps/web && pnpm test -- navigation.test.ts app-profile
```
