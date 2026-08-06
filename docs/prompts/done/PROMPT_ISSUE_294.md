# Prompt — Issue #294

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/294  
**Parent** : Epic #210 · Badakan lecture → Profils app  
**Blocked by** : (aucun)

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Plan : Profils app Badakan.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-294-profils-app-badakan origin/dev
```

---

## Scope

- Entité `AppProfile` + onglet **Profils app**
- Sync manuelle `searchNewEmployees`
- Accepter (popup) / Ignorer
- Doublon → fusion classique
- Pas d’auto-CVthèque ; ≠ Application site

---

## Fin

PR vers `dev` avec `Closes #294`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Sync → profils EN_ATTENTE
- [ ] Accepter → popup → candidat créé, reste sur onglet
- [ ] Ignorer → disparait, resync ne ramène pas
- [ ] Doublon → fusion
