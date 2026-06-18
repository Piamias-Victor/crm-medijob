# Prompts agent — CRM MediJob

```
docs/prompts/
├── pending/   ← à lancer ou en cours
├── done/      ← issue mergée sur dev
└── README.md
```

## Workflow

1. **Créer** → `pending/PROMPT_ISSUE_{NNN}.md` (commit sur `dev` avant de lancer l'agent)
2. **Lancer** → `Lis et exécute docs/prompts/pending/PROMPT_ISSUE_{NNN}.md`
3. **Merger la PR** → déplacer `pending/` → `done/` (même nom de fichier)

Ne pas renommer les fichiers — le numéro d'issue reste stable, seul le dossier change.

## État actuel

| Dossier | Issues |
|---------|--------|
| `done/` | #50 · #51 · #52 · #53 |
| `pending/` | #54 · #59 · #76 · #77 |

Voir aussi : `docs/ISSUE_DEPENDENCIES.md` pour le graphe complet.
