# Prompt — Issue #486

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/486  
**Parent** : PRD #480 — Entrées app  
**Blocked by** : #485  
**Slug branche** : `feat/issue-486-retire-profils-app`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #480 · **ADR-0032**. Ne pas changer Intake booking SMS.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-486-retire-profils-app origin/dev
```

Rebaser sur #485 mergé (Ignore déjà sur Entrées app).

---

## Périmètre

Retirer l’onglet Candidats **Profils app**, fiches détail / convert / **ACCEPTE**, UI Hireflix invitation sur cette surface. Redirect ou 404 des URLs legacy vers `/interim/entrees-app`. Mutation `accept` retirée ou hard-fail. Table-only = seule UI intake. **SMS booking inchangé.**

### Acceptance criteria

- [ ] Tab « Profils app » disparu
- [ ] Routes détail / convert / ACCEPTE retirées ou redirect → Entrées app
- [ ] `accept` retiré ou erreur ; pas d’UI ACCEPTE
- [ ] UI Hireflix invite retirée de cette surface
- [ ] Intake booking SMS inchangé
- [ ] Tests nav + router
- [ ] ADR-0032 / CONTEXT respectés ; fichiers < 100 lignes, TDD

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD · **interdit worktree**
- Ne pas casser le SMS Google Calendar existant
- Vocabulaire : plus de Hireflix invitation / ACCEPTE comme porte CVthèque

## Fichiers impactés (indicatifs)

- `CandidatTabs` / `AppProfilesSection` / pages `profils-app`
- `app-profile` router — accept
- Hireflix UI molecules liées à Profils app uniquement

---

## Fin

PR vers `dev` avec `Closes #486`. Dernière slice de l’epic #480.

## Commande de test

```bash
cd apps/web && pnpm test -- app-profile navigation CandidatTabs
```
