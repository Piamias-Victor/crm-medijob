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

- **Un seul worktree par issue** — créé avant tout travail sur l'issue
- Ne pas réutiliser un worktree d'une issue précédente pour une nouvelle issue
- Le worktree est créé depuis la branche `feat/issue-{N}-{slug}` ou `fix/issue-{N}-{slug}`

```bash
# Exemple
git worktree add ../crm-medijob-issue-2 -b feat/issue-2-app-bootstrap origin/dev
```

## Cycle de vie des branches

1. Créer la branche + worktree depuis `dev` à jour
2. Travailler, committer sur la branche de feature
3. Pusher la branche de feature sur `origin`
4. Ouvrir une PR vers `dev` avec `Closes #N`
5. Merger la PR dans `dev`
6. **Cleanup de la branche après merge** — pas avant (la branche reste disponible jusqu'au merge)

```bash
# Cleanup après merge (local + remote)
git branch -d feat/issue-{N}-{slug}
git push origin --delete feat/issue-{N}-{slug}
git worktree remove ../crm-medijob-issue-{N}
```

## Références

- Issue tracker : `docs/agents/issue-tracker.md`
- Workflow agent : `CLAUDE.md`
- Prompts agents : `docs/prompt-rules.md`
