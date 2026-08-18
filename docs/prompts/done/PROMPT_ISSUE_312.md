# Prompt — Issue #312

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/312  
**Parent** : PRD #226 — Entretiens CRM  
**Blocked by** : None  
**Slug branche** : `feat/issue-312-interview-template-pin`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : aujourd’hui si on change le questionnaire, un entretien *en cours* peut changer au milieu de l’appel. On fige le questionnaire au *lancement* : le recruteur garde la même grille jusqu’à la clôture. Les fichiers « d’usine » (seed) ne doivent plus écraser ce qui est déjà en base.
2. **Pose 2 à 4 questions** + **reco** :
   - Pin = id de la trame publiée vs copie JSON figée dans l’Interview ? **Reco : id** (`InterviewTemplate` déjà versionné). Pas de hard-delete des versions.
   - Seed fill-only : toutes les versions ou seulement « s’il n’existe aucune trame pour ce métier × mode » ? **Reco : aucune ligne pour ce couple → insert version 1. Sinon no-op.**
3. **Attends validation** avant de coder.
4. Lire `docs/adr/0015-interview-template-admin.md` + `CONTEXT.md` (Interview, InterviewTemplate). **Pas d’UI admin** dans cette slice.

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
git checkout -b feat/issue-312-interview-template-pin origin/dev
```

---

## Périmètre

- Interview pin la version **publiée** au start
- load-run / close / PDF = version pinnée, pas « latest »
- Seed : insert si couple profileKey × mode absent ; jamais d’upsert écrasant
- Recruteur parcours entretien inchangé (pas d’écran `/admin/trames`)

### Acceptance criteria

- [ ] Start stocke la version de trame publiée
- [ ] DRAFT + version plus récente publiée → reload = encore l’ancienne grille
- [ ] Close + PDF utilisent la version pinnée
- [ ] Seed ×2 n’écrase pas les trames existantes

Hors slice : éditeur admin (#313), créer/archiver (#314), dupliquer questions (#315).

---

## Contraintes

- Prisma uniquement dans repositories
- Fichiers < 100 lignes, TDD
- Pas de T4S
- Vocabulaire : **brouillon** = Interview DRAFT, pas la copie de travail admin

---

## Fin

PR vers `dev` avec `Closes #312`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Lancer un entretien → répondre à une question → (via seed test / 2e version en base si dispo) recharger → la question est toujours là
- [ ] Clôturer cet entretien → OK, PDF OK
- [ ] Relancer seed (staging/dev) → les trames déjà en base ne reviennent pas à l’usine
