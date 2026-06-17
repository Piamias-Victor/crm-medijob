# Prompt Rules — crm-medijob

Règles que tout agent doit respecter pour générer, stocker et exécuter un prompt lié à une issue.

## Stockage des prompts

Chaque prompt généré pour une issue est sauvegardé dans :

```
docs/prompts/PROMPT_ISSUE_{NNN}.md
```

- `{NNN}` = numéro d'issue GitHub sur 3 chiffres minimum (ex. `002`, `008`, `017`)
- Le fichier est **commité et pushé sur `dev`** avant de commencer le travail sur l'issue
- Un prompt = une issue. Pas de prompt partagé entre plusieurs issues.

## Structure obligatoire d'un prompt

Chaque `PROMPT_ISSUE_{NNN}.md` doit contenir les sections suivantes dans cet ordre :

### 1. En-tête

- Numéro et titre de l'issue
- Lien vers l'issue GitHub
- Issue parente (si applicable, ex. PRD #1)
- Issues bloquantes (`Blocked by`)

### 2. Skills obligatoires

Le prompt doit **obligatoirement** inclure ces instructions en début d'exécution :

```
/caveman
```

Réduction de tokens — lire uniquement les fichiers nécessaires à l'issue, pas le repo entier.

```
/tdd
```

Boucle Red → Green → Refactor. Écrire le test qui échoue, implémenter le minimum pour le faire passer, refactoriser.

### 3. Setup Git (avant tout travail)

Instructions explicites de :

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. Créer la branche : `feat/issue-{N}-{slug}` ou `fix/issue-{N}-{slug}`
3. Créer le worktree Git (un seul worktree par issue)
4. Travailler exclusivement dans le worktree

### 4. Contexte & périmètre

- Résumé de ce qui doit être livré (vertical slice end-to-end)
- Critères d'acceptation de l'issue (copiés depuis GitHub)
- Fichiers impactés listés par `/grill` (ou analyse préalable équivalente)
- ADRs applicables (`docs/adr/`)
- Vocabulaire domaine depuis `CONTEXT.md`

### 5. Contraintes techniques

Rappel des règles non négociables (sans dupliquer `CLAUDE.md` en entier) :

- Prisma uniquement dans repositories
- RSC pour lectures, mutations via `trpc.useMutation()` en Client Components
- Fichiers < 100 lignes, zéro `any`, React Hook Form + Zod
- Atomic design, view-models, Zustand = UI state uniquement

### 6. Fin de session (obligatoire)

Instructions explicites de :

1. Pusher sur la branche de feature (`origin`)
2. Ouvrir une PR vers `dev` avec `Closes #{N}` dans le body
3. Déposer `docs/handoffs/HANDOFF_ISSUE_{NNN}.md` (résumé, décisions, dette, tests manuels effectués)

### 7. Tests manuels

Section **obligatoire** listant les étapes exactes pour valider le bon fonctionnement côté utilisateur :

```markdown
## Tests manuels

- [ ] Étape 1 : ...
- [ ] Étape 2 : ...
- [ ] Étape 3 : ...
```

Chaque étape doit être actionnable (navigation, clic, saisie, résultat attendu). Pas de formulations vagues.

## Référence aux fichiers impactés

Le prompt référence **toujours** les fichiers impactés listés par `/grill` (ou par exploration ciblée si `/grill` n'a pas été lancé). Format :

```markdown
## Fichiers impactés

- `chemin/vers/fichier` — raison
```

Si la liste évolue en cours de session, mettre à jour le prompt avant le commit final.

## Handoffs

En fin de session, chaque agent dépose :

```
docs/handoffs/HANDOFF_ISSUE_{NNN}.md
```

Contenu minimal :

- Ce qui a été livré
- Ce qui reste / dette technique
- Tests manuels effectués (résultat)
- Points d'attention pour l'issue suivante

## Références

- Règles Git : `docs/github-rules.md`
- Workflow agent : `CLAUDE.md`
- Glossaire domaine : `CONTEXT.md`
- Spec technique : `SPEC_V1.md`
