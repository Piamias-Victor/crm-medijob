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

## Checkout — repo principal seulement

**Interdit : `git worktree`.** Jamais. Pas de dossier `crm-medijob-issue-*`, pas de `$HOME/Desktop/Dev/ia/.worktrees`.

Toujours dans le clone principal :

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-{N}-{slug} origin/dev
```

Une issue à la fois. Changements non commités → stash ou commit **avant** de changer de branche.

## Cycle de vie des branches

1. Créer la branche depuis `dev` à jour **dans le repo principal**
2. Travailler, committer sur la branche de feature
3. **Phase 3** : pusher + PR + poster commande de test + tests manuels (`docs/prompt-rules.md`)
4. **Phase 4** : handoff sur demande (`/handoff`)
5. Merger la PR dans `dev`
6. **Phase 5** : supprimer la branche locale (après merge) · déplacer prompt `pending/` → `done/`

Après merge :

```bash
git checkout dev
git pull origin dev
git branch -d feat/issue-{N}-{slug}
git push origin --delete feat/issue-{N}-{slug}  # si la remote est encore là
```

## Références

- Issue tracker : `docs/agents/issue-tracker.md`
- Workflow agent : `CLAUDE.md`
- Prompts agents : `docs/prompt-rules.md`
