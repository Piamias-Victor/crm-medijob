# Prompts agent — CRM MediJob

```
docs/prompts/
├── pending/   ← à lancer ou en cours (une issue max)
├── done/      ← issue mergée sur dev
└── README.md
```

## Workflow

1. **Créer** → `pending/PROMPT_ISSUE_{NNN}.md` (commit + push direct sur `dev`)
2. **Lancer** → `Lis et exécute docs/prompts/pending/PROMPT_ISSUE_{NNN}.md`
3. **Merger la PR issue** → `git mv pending/ → done/` puis commit + push direct sur `dev`

## Règle anti-doublon (CI)

Une issue **ne doit jamais** exister dans `pending/` **et** `done/` en même temps.

```bash
pnpm lint:prompts   # local — échoue si doublon
```

**Ne jamais** exécuter `git checkout origin/dev -- docs/prompts/pending/` — ça remet des prompts déjà archivés dans `done/`.

Si des fichiers réapparaissent dans `pending/` après un merge : supprimer les doublons (`git rm docs/prompts/pending/PROMPT_ISSUE_{NNN}.md` quand la version `done/` existe).

## Workflow agent (5 phases)

| Phase | Action |
|-------|--------|
| 1 Setup | Lire règles · branche · worktree si parallèle · `/caveman` |
| 2 Implémentation | `/tdd` |
| 3 Prêt à tester | Push + PR + **commande de test + tests manuels** (obligatoire) |
| 4 Handoff | `/handoff` → commit handoff dans la PR |
| 5 Cleanup | Supprimer worktree · `pending/` → `done/` après merge |

Détail : `docs/prompt-rules.md`
