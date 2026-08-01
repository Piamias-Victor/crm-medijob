# Prompt — Issue #211

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/211  
**Parent** : Epic #210 · `docs/PRD_V1_OPERATIONNEL.md` · CSV V1-004  
**Blocked by** : None

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#211) — périmètre, AC, tests manuels.

Contexte : remapper tokens CSS sur palette CSV (teal #0C2F37, mint #5AE2A1, sky #73C6EF, rose #FE7CCA) + logo. Réutiliser atomic design existant.

Vocabulaire : `CONTEXT.md`.

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-211-medijob-palette origin/dev
```

Mode simple (pas de worktree sauf parallèle).

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`
- Tokens via `--color-*` uniquement (pas de couleurs hardcodées dans composants)
- Prisma uniquement dans repositories (N/A ici)

---

## Fin

PR vers `dev` avec `Closes #211`.  
Quand prêt : poster **Commande de test** + **Tests manuels** (phase 3).

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm dev
```

Ouvrir `/design-system` et le shell CRM.

## Tests manuels

- [ ] `/design-system` — palette teal/mint/sky/rose visible
- [ ] Sidebar — logo Medijob visible
- [ ] Accueil + une liste — contraste texte OK
