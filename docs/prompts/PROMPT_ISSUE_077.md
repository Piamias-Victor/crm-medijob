# Prompt — Issue #77

**Titre** : [ADMIN] Référentiels — Pipeline, Software, Groupement, JobTitle + matrice  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/77  
**Parent** : #19  
**Blocked by** : #53 · **Débloque** : #78

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_053.md`, ADR 0005/0009, `SPEC_V2.md` §6.690–695 + §10, issue #77.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_053.md` (gate ADMIN, `admin/layout.tsx`)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-77 -b feat/issue-77-admin-referentiels origin/dev
cd ../crm-medijob-issue-77
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

CRUD **ADMIN-only** sur 4 référentiels :

| Route | Entité |
|-------|--------|
| `/admin/pipeline` | PipelineStage + drag reorder (`position`) |
| `/admin/logiciels` | Software (LGO) |
| `/admin/groupements` | Groupement |
| `/admin/metiers` | JobTitle + **matrice compatibilité** (mission → candidats acceptés) |

Seeds #52 = defaults ; admin peut étendre. **ADR 0005** : noms PipelineStage libres. **ADR 0009** : matrice JobTitle.

Garde ADMIN déjà en place (#53) — réutiliser `admin/layout.tsx`.

**Hors périmètre** : CRUD utilisateurs (#78), kanban candidats (#54).

**US** : #78–85

### Critères d'acceptation

- [ ] 4 pages admin fonctionnelles (ADMIN only)
- [ ] Pipeline : CRUD + drag-and-drop reorder
- [ ] Suppression PipelineStage en usage → guard/erreur
- [ ] Matrice métiers : grille checkboxes mission × candidate JobTitles
- [ ] Formulaires RHF + Zod
- [ ] Changements visibles immédiatement pour matching futur (#73)

---

## Fichiers impactés

- `apps/web/src/app/(dashboard)/admin/pipeline/page.tsx`
- `apps/web/src/app/(dashboard)/admin/logiciels/page.tsx`
- `apps/web/src/app/(dashboard)/admin/groupements/page.tsx`
- `apps/web/src/app/(dashboard)/admin/metiers/page.tsx`
- `apps/web/src/server/routers/admin/*.ts` — pipeline, software, groupement, jobTitle
- Réutilise repos : `pipeline-stage`, `software`, `groupement`, `job-title` (#52)
- Nav admin sub-routes si besoin (molecule)

**Conflit git** avec #54/#59 sur routers — merger `dev` souvent.

---

## Contraintes

ADMIN gate (middleware + layout), repositories only, fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_077.md` + push + PR `Closes #77`.

**En fin de message** : bloc « Commande de test » copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-77
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login **ADMIN** : `admin@medijob.fr` / `admin-medijob-2026` → http://localhost:3000/admin/pipeline

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] RECRUTEUR → `/admin/pipeline` bloqué
- [ ] ADMIN → CRUD PipelineStage + reorder drag
- [ ] Ajouter stage « Test » → visible en DB
- [ ] Matrice : décocher compatibilité → ligne supprimée
- [ ] Supprimer stage utilisé → erreur explicite
- [ ] CI locale verte
