# Prompt — Issue #230

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/230  
**Parent** : Epic #210 · CSV V1-050 · Q9  
**Blocked by** : #229  
**Type** : HITL (`ready-for-human`) — confirmer CMS (Q9) + credentials

---

## Avant de coder

**Pose-moi des questions** — Q9 Webflow confirmé ? env vars ?  
Lis #230 et `docs/grill/QUESTIONS_CLIENT_V1.md` Q9.

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff #229.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-230-job-offer-cms-sync origin/dev
```

---

## Contraintes

- Client CMS derrière seam mockable
- Secrets en env uniquement
- Fichiers < 100 lignes

---

## Fin

PR vers `dev` avec `Closes #230`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Publier — item CMS / mock documenté
- [ ] Dépublier
- [ ] Erreur API → message UI
