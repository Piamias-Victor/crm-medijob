# Prompt — Issue #232

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/232  
**Parent** : Epic #210 · CSV V1-053–V1-056 · Q10 hypo A  
**Blocked by** : #224 · #227

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #232.

Matching + prétentions ; multi-select contact deep links (mailto/sms/wa.me) tant que Q10 non tranché autrement.

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
git checkout -b feat/issue-232-matching-contact-multiselect origin/dev
```

---

## Contraintes

- Pas de Twilio sauf décision Q10-C
- Réutiliser MissionMatchingTab
- Fichiers < 100 lignes

---

## Fin

PR vers `dev` avec `Closes #232`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Matching avec prétentions
- [ ] Multi-select + mailto
- [ ] sms: / wa.me
- [ ] Positionner pipeline
