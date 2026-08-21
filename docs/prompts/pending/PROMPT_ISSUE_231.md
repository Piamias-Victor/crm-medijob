# Prompt — Issue #231

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/231  
**Parent** : Epic #210 · CSV V1-057–V1-060  
**Blocked by** : #230 · #224

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #231. Handoffs #230/#224.

Webhook → Application ; inbox tableau ; accept/refus/dédup.

Glossaire : **Application**.

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
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-231-applications-inbox origin/dev
```

---

## Contraintes

- Webhook HMAC / secret
- Réutiliser intake + duplicate patterns
- Fichiers < 100 lignes, TDD

---

## Fin

PR vers `dev` avec `Closes #231`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Webhook simulé → inbox
- [ ] Accept sans doublon
- [ ] Accept avec doublon → rattache/fusion
- [ ] Refus → plus en attente
