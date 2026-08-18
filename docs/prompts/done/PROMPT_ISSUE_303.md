# Prompt — Issue #303

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/303  
**Parent** : PRD #226 — Entretiens CRM  
**Blocked by** : #301  
**Slug branche** : `feat/issue-303-interview-ai`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : optionnellement, l’IA (via OpenRouter comme le reste du CRM) peut proposer un score ou un court résumé pour aider le recruteur ; on peut toujours clôturer sans l’appeler ; si l’IA plante ou répond n’importe quoi, on ignore / on refuse proprement.
2. **Pose 2 à 4 questions** + **reco** (quoi exactement proposer : scores vs résumé vs les deux).
3. **Attends validation** avant de coder.
4. Lire handoff #301. Réutiliser provider OpenRouter + mock tests existants. **Pas Claude direct** du proto eval.

---

## Skills

```
/caveman
/tdd
```

---

## Setup

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-303-interview-ai origin/dev
```

---

## Périmètre

- Action optionnelle « suggérer score / résumé »
- OpenRouter + mock en test
- Validation Zod de la sortie IA
- Échec IA ≠ blocage clôture

### Acceptance criteria

- [ ] Suggest OK (mock / OpenRouter)
- [ ] Clôture sans appeler l’IA
- [ ] Payload IA invalide rejeté

Parallel OK avec #302 après #301.

---

## Contraintes

- Pas de T4S
- Fichiers < 100 lignes, TDD sur seam provider

---

## Fin

PR vers `dev` avec `Closes #303`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Sur un DRAFT / avant clôture → bouton suggestion IA → proposition affichée
- [ ] Modifier à la main après suggestion → clôturer OK
- [ ] Clôturer sans jamais appeler l’IA → OK
- [ ] (Si possible) simuler échec IA → message clair, clôture toujours possible
