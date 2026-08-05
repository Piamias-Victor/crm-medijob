# Prompt — Issue #287

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/287  
**Blocked by** : None  
**Type** : AFK (`ready-for-agent`)

---

## Avant de coder

**Pose-moi des questions** sur le shape Zod exact des 6 sections si besoin. Lis #287 et le terme **Anonymized dossier** dans `CONTEXT.md`.

Remplace le markdown libre par sections structurées + edit Documents + PDF sections + PII gen/save. Pas de migration des anciens blobs — régénérer.

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
git checkout -b feat/issue-287-anonymized-dossier-sections origin/dev
```

---

## Décisions produit (grill)

Sections fixes :
1. Accroche
2. Métier & expérience
3. Compétences & logiciels
4. Mobilité
5. Disponibilité & contrat
6. Points forts

- Régénération = overwrite total après confirm ; edit possible après
- Autosave édition (Documents only)
- Sections vides masquées aperçu + PDF
- PII guard identique gen + save manuel
- Barre Profil = raccourci seulement (pas 2e éditeur)
- Anciens markdown : ignorer / forcer régénération

---

## Contraintes

- Prisma repositories only
- Fichiers < 100 lignes
- Zéro `any`
- Zod strict sur schéma sections + garde PII
- PDF `@react-pdf/renderer` brandé Medijob
- Prérequis `cvSummary` inchangé

---

## Fin

PR vers `dev` avec `Closes #287`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm typecheck
pnpm lint
pnpm dev
```

## Tests manuels

- [ ] Générer dossier (après résumé IA) → 6 sections éditables Documents
- [ ] Éditer une section → autosave ; refresh → contenu conservé
- [ ] Taper un nom/email → save refusé
- [ ] Vider une section → absente du PDF
- [ ] Régénérer → confirm → overwrite ; ré-éditer OK
- [ ] PDF sections lisibles (pas markdown brut)
- [ ] Barre Profil : raccourci sans éditeur dupliqué
