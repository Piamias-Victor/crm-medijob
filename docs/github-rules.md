# GitHub Rules — crm-medijob

Règles Git non négociables pour ce projet. Tout agent et tout contributeur doit les respecter.

## Branches protégées

- **Ne jamais push directement sur `main`**
- **Ne jamais push directement sur `dev`**
- Toute modification passe par une branche de travail et une Pull Request

## Pull Requests

- **Base obligatoire** : toutes les PRs ciblent la branche `dev`
- **Body obligatoire** : chaque PR doit contenir `Closes #X` (ou `Closes #X, #Y` si plusieurs issues) pour auto-fermer l'issue au merge
- **Review** : attendre l'approbation avant merge (pas de self-merge sans validation)
- **CI** : tous les checks doivent passer avant merge

## Naming des branches

| Type | Format | Exemple |
|------|--------|---------|
| Feature | `feat/issue-{numero}-{slug}` | `feat/issue-2-app-bootstrap` |
| Fix | `fix/issue-{numero}-{slug}` | `fix/issue-8-candidat-referent` |

Le `{slug}` est un résumé court en kebab-case, aligné sur le titre de l'issue.

## Worktrees

### Quand utiliser un worktree ?

| Situation | Mode recommandé |
|-----------|-----------------|
| **1 issue à la fois**, pas d'autre agent sur le repo | **Mode simple** — branche dans le repo principal, pas de dossier supplémentaire |
| **Plusieurs issues en parallèle** (agents ou sessions simultanées) | **Mode parallèle** — un worktree par issue |

Le worktree **n'est pas obligatoire**. Il sert uniquement à isoler les checkouts parallèles. Si tu travailles seul sur une issue, reste dans le repo principal :

```bash
git fetch origin
git checkout -b feat/issue-{N}-{slug} origin/dev
# travailler ici — pas de dossier ../crm-medijob-issue-{N}
```

### Mode parallèle (worktree)

- **Un seul worktree par issue**
- Ne pas réutiliser un worktree d'une issue précédente
- Chemin centralisé (préféré aux dossiers éparpillés) :

```bash
WORKTREES_ROOT="${WORKTREES_ROOT:-$HOME/Desktop/Dev/ia/.worktrees}"
mkdir -p "$WORKTREES_ROOT"
git worktree add "$WORKTREES_ROOT/crm-medijob-issue-{N}" -b feat/issue-{N}-{slug} origin/dev
cd "$WORKTREES_ROOT/crm-medijob-issue-{N}"
```

- Symlink `.env` si nécessaire (cf. handoffs #53)
- `pnpm install` à la première utilisation

### Cleanup worktree (obligatoire — phase 5)

L'agent **doit** exécuter le cleanup après handoff (phase 4) ou quand l'utilisateur confirme le merge — **ne pas laisser de dossiers orphelins**.

```bash
# Depuis le repo principal (pas depuis le worktree)
WORKTREES_ROOT="${WORKTREES_ROOT:-$HOME/Desktop/Dev/ia/.worktrees}"
git worktree remove "$WORKTREES_ROOT/crm-medijob-issue-{N}" --force 2>/dev/null \
  || git worktree remove "../crm-medijob-issue-{N}" --force
git worktree prune
git branch -d feat/issue-{N}-{slug}    # après merge sur dev
git push origin --delete feat/issue-{N}-{slug}  # après merge, si branche remote encore présente
```

Lister les worktrees actifs : `git worktree list`

## Cycle de vie des branches

1. Choisir mode simple ou worktree (cf. § Worktrees)
2. Créer la branche depuis `dev` à jour
3. Travailler, committer sur la branche de feature
4. **Phase 3** : pusher + PR + poster commande de test + tests manuels (`docs/prompt-rules.md`)
5. **Phase 4** : handoff sur demande (`/handoff`)
6. Merger la PR dans `dev`
7. **Phase 5** : cleanup worktree + branche (agent) · déplacer prompt `pending/` → `done/`

## Références

- Issue tracker : `docs/agents/issue-tracker.md`
- Workflow agent : `CLAUDE.md`
- Prompts agents : `docs/prompt-rules.md`
