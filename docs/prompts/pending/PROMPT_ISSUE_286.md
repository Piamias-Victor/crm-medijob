# Prompt — Issue #286

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/286  
**Blocked by** : None  
**Type** : AFK (`ready-for-agent`)

---

## Avant de coder

**Pose-moi des questions** si le seuil exact de clustering (~50) doit être une constante nommée / configurable. Lis #286 et ADR-0013 (Leaflet + OSM — **ne pas** migrer MapLibre/Mapbox).

Cible : zoom rapide + moins steppy + clustering au-delà du seuil. Molette zoom **immédiat**.

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
git checkout -b feat/issue-286-map-zoom-clustering origin/dev
```

---

## Décisions produit (grill)

- Rester Leaflet + OSM (pas de changement ADR provider)
- Feeling type Google Maps autant que Leaflet le permet (sensibilité + fractions)
- Zoom molette immédiat (pas Ctrl+scroll)
- Clustering si pins > ~50 ; sinon markers individuels
- Même comportement pharmacies / candidats / missions

---

## Contraintes

- Fichiers < 100 lignes
- Zéro `any`
- Client-only map (`dynamic` / `ssr: false`) inchangé
- Constante seuil clustering — zéro magic number hardcodé dans le JSX

---

## Fin

PR vers `dev` avec `Closes #286`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm typecheck
pnpm lint
pnpm dev
```

## Tests manuels

- [ ] Map pharmacies : zoom molette / trackpad rapide et moins collant
- [ ] Pan/drag toujours OK
- [ ] Peu de pins : pas de clusters
- [ ] Beaucoup de pins (filtre large) : clusters, zoom révèle les points
- [ ] Même comportement map candidats et missions
