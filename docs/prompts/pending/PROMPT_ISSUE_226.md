# Prompt — Issue #226

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/226  
**Parent** : Epic #210 · ADD Entretien · Q12  
**Blocked by** : #224  
**Type** : HITL (`ready-for-human`) — inventaire champs client avant/pendant implémentation

---

## Avant de coder

**Pose-moi des questions** — notamment statut Q12 et inventaire champs medijob-eval.  
Ne code pas l’inventaire au feeling.

Lis #226 et `docs/grill/QUESTIONS_CLIENT_V1.md` Q12.

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
git checkout -b feat/issue-226-candidate-interview-form origin/dev
```

---

## Contraintes

- Champs dans le CRM (pas iframe)
- Zod + RHF
- Fichiers < 100 lignes

---

## Fin

PR vers `dev` avec `Closes #226`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Section entretien sur fiche candidat
- [ ] Sauvegarde met à jour le profil
- [ ] Création avec entretien — données persistées
