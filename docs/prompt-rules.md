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
2. **Lire les handoffs des issues bloquantes** — pour chaque issue dans `Blocked by`, consulter `docs/handoffs/HANDOFF_ISSUE_{NNN}.md` s'il existe (contexte, dette, points d'attention)
3. Créer la branche : `feat/issue-{N}-{slug}` ou `fix/issue-{N}-{slug}`
4. Créer le worktree Git (un seul worktree par issue)
5. Travailler exclusivement dans le worktree

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

### 6. Fin de session

**Uniquement sur instruction explicite de l'utilisateur** (ex. « push », « ouvre la PR », `/handoff`).

Quand demandé :

1. Si `/handoff` : rédiger `docs/handoffs/HANDOFF_ISSUE_{NNN}.md` et **committer avec le code** (même PR, jamais en local seul)
2. Pusher sur la branche de feature (`origin`)
3. Ouvrir une PR vers `dev` avec `Closes #{N}` dans le body — la PR doit inclure code + handoff

### 7. Tests manuels

Section **obligatoire** listant les étapes exactes pour valider le bon fonctionnement côté utilisateur :

```markdown
## Tests manuels

- [ ] Étape 1 : ...
- [ ] Étape 2 : ...
- [ ] Étape 3 : ...
```

Chaque étape doit être actionnable (navigation, clic, saisie, résultat attendu). Pas de formulations vagues.

### 8. Commande de test pour l'utilisateur

Chaque prompt inclut une section **Commande de test** avec le bloc shell exact à copier-coller.

L'agent **doit** fournir ce même bloc à l'utilisateur en fin de message quand le travail est prêt à tester (ou à chaque point de validation intermédiaire).

Format :

```markdown
## Commande de test

\`\`\`bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-{N}
pnpm install   # première fois uniquement
pnpm dev
\`\`\`
```

- Chemin worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-{N}`
- Adapter `{N}` au numéro d'issue
- Ajouter d'autres commandes si pertinent (`pnpm test`, URL à ouvrir, etc.)

Le prompt référence **toujours** les fichiers impactés listés par `/grill` (ou par exploration ciblée si `/grill` n'a pas été lancé). Format :

```markdown
## Fichiers impactés

- `chemin/vers/fichier` — raison
```

Si la liste évolue en cours de session, mettre à jour le prompt avant le commit final.

## Handoffs

### Lecture (début de session)

Avant d'implémenter, l'agent **doit** lire les handoffs des issues listées dans `Blocked by` :

```
docs/handoffs/HANDOFF_ISSUE_{NNN}.md
```

S'il n'existe pas encore (première issue ou handoff pas déposé), continuer sans bloquer.

### Rédaction (sur demande utilisateur)

Sur instruction explicite (`/handoff`) — **pas automatique en fin de session**.

```
docs/handoffs/HANDOFF_ISSUE_{NNN}.md
```

- Committer et pusher **avec le code** dans la même PR pour assurer le suivi sur `dev`
- L'agent suivant s'appuie sur ce fichier pour comprendre ce qui a été livré

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
