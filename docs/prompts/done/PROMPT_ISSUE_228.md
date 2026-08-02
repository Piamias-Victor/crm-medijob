# Prompt — Issue #228

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/228  
**Parent** : Epic #210 · ADD Maps · Q8 hypo  
**Blocked by** : #220 · #224 · #227

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter (provider Mapbox vs Leaflet). Lis #228.

3 maps + geocode lat/lng. Filtres pharmacies = Client/Prospect/Inactif.

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
git checkout -b feat/issue-228-crm-maps origin/dev
```

---

## Contraintes

- Geocode en service pur testable
- ADR provider si choix non trivial
- Fichiers < 100 lignes
- Clés API via env uniquement

---

## Fin

PR vers `dev` avec `Closes #228`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Map pharmacies — points + filtre Client
- [ ] Map candidats
- [ ] Map missions
