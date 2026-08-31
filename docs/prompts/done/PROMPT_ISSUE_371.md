# Prompt — Issue #371

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/371  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : #367  
**Slug branche** : `feat/issue-371-badakan-comments`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #365. GET comments/target. Pas de POST Badakan.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs `#366` `#367`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-371-badakan-comments origin/dev
```

---

## Périmètre

Afficher **Badakan comments** sur AppProfile CREATED et Candidate App-validated. Nouvelles notes recruteur = **ActivityLog**. Aucun POST `/comments`.

### Acceptance criteria

- [ ] Comments visibles sur Profils app (CREATED)
- [ ] Comments visibles sur Candidate origine App
- [ ] Nouvelle note → ActivityLog, pas de POST Badakan
- [ ] Tests lecture injectée + mutation ActivityLog

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- **Interdit : `git worktree`** · **interdit POST comments Badakan**

Vocabulaire : Badakan comment ≠ ActivityLog. ADR 0024.

## Fichiers impactés

- `apps/web/src/server/badakan/client.ts` — GET comments/target/{id}
- `apps/web/src/server/badakan/map-comment.ts` — Zod map texte / auteur / date
- `apps/web/src/server/routers/app-profile.ts` — `listComments` CREATED
- `apps/web/src/server/routers/candidate-comments.ts` — `listComments` si `badakanId`
- `apps/web/src/server/routers/activity-log.ts` — notes CRM (inchangé, test NOTE Candidate)
- fiche AppProfile + Candidate historique — `BadakanCommentList`

---

## Fin

PR vers `dev` avec `Closes #371`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Profils app : un CREATED avec comment fixture affiche le texte (auteur + date)
- [ ] Candidate origine App : mêmes comments après sync
- [ ] Ajouter une note CRM → ActivityLog ; rien n’est POSTÉ vers Badakan
