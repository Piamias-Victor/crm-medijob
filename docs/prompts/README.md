# Prompts agent — CRM MediJob

```
docs/prompts/
├── pending/   ← à lancer ou en cours
├── done/      ← issue mergée sur dev
└── README.md
```

## Workflow

1. **Créer** → `pending/PROMPT_ISSUE_{NNN}.md` (commit + push direct sur `dev`)
2. **Lancer** → `Lis et exécute docs/prompts/pending/PROMPT_ISSUE_{NNN}.md`
3. **Merger la PR issue** → déplacer `pending/` → `done/`

## État actuel

| Dossier | Issues |
|---------|--------|
| `done/` | #50–#55 · #59–#62 · #64 · #76–#78 |
| `pending/` | #56 · #58 · #61 · #63 · #65 |

> **Note** : #60 prompt en `done/` — code fiche pharmacy pas encore sur `dev` ; #61/#63 peuvent nécessiter shell `/pharmacies/[id]`.

Voir : `docs/ISSUE_DEPENDENCIES.md`

## Workflow agent (5 phases)

| Phase | Action |
|-------|--------|
| 1 Setup | Lire règles · branche · worktree si parallèle · `/caveman` |
| 2 Implémentation | `/tdd` |
| 3 Prêt à tester | Push + PR + **commande de test + tests manuels** (obligatoire) |
| 4 Handoff | `/handoff` → commit handoff dans la PR |
| 5 Cleanup | Supprimer worktree · `pending/` → `done/` après merge |

Détail : `docs/prompt-rules.md`
