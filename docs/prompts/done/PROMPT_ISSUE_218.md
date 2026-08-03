# Prompt — Issue #218

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/218  
**Parent** : Epic #210 · CSV V1-066 / V1-067 · Q11 hypo 7j  
**Blocked by** : None

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #218.

KPI accueil + centre d’alertes. Relance en retard = pas d’ActivityLog depuis 7j sur mission ouverte (constante).

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
git checkout -b feat/issue-218-dashboard-kpi-alerts origin/dev
```

---

## Contraintes

- Étendre `dashboard.overview` / HomePage
- Fichiers < 100 lignes, tests router

---

## Fin

PR vers `dev` avec `Closes #218`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Accueil — 4 KPI visibles
- [ ] Mission urgente &lt;48h — compteur urgentes
- [ ] Alertes listent au moins un type pertinent
