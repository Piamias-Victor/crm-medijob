# Prompt — Issue #57

**Titre** : [CANDIDATS] cvSummary IA + dossier anonymisé + export PDF Medijob  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/57  
**Parent** : #19  
**Blocked by** : #56 · **Débloque** : —

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_056.md`, `SPEC_V2.md` §7.2–7.3, `docs/PRD.md` US #17–18, #22, issue #57.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_056.md` (CV upload, `CandidateCvPanel`, provider IA, route `/api/candidates/[id]/cv`)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-57 -b feat/issue-57-candidate-cv-summary-pdf origin/dev
cd ../crm-medijob-issue-57
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

Nouvel onglet **Documents** sur `/candidats/[id]` :

1. **Générer résumé IA** → synthèse markdown → `candidate.cvSummary` (Zod `summaryResponseSchema`)
2. **Générer dossier anonymisé** → markdown sans PII → `candidate.anonymizedProfile` (Zod dédié)
3. **Exporter PDF** → téléchargement PDF brandé Medijob depuis `anonymizedProfile` via `@react-pdf/renderer`

Input résumé (SPEC §7.2) : notes + expérience + métier + logiciels.  
Input anonymisé (SPEC §7.3) : cvSummary + métier + logiciels + mobilité + disponibilité — **zéro** nom/email/tél/adresse.

L’onglet affiche aussi : lien CV (`cvUrl` + route proxy #56), aperçu résumé, aperçu dossier anonymisé, **autres documents** via `EntityDocumentsTab` (`entityType: CANDIDATE`).

**Hors périmètre** : matching (#73), soft delete UI (#80).

**US** : #17, #18, #22

### Critères d'acceptation

- [ ] « Générer résumé IA » → `cvSummary` persisté après validation Zod
- [ ] « Générer dossier anonymisé » → `anonymizedProfile` sans PII
- [ ] « Exporter PDF » → PDF Medijob (logo/couleurs charte) depuis contenu anonymisé
- [ ] Onglet Documents : CV, résumé, dossier anonymisé, autres documents
- [ ] Chemin mock provider pour tests (sans clé OpenRouter)
- [ ] États loading/error sur actions IA

---

## Fichiers impactés

- `components/molecules/CandidateDetailTabs.tsx` — onglet `documents`
- `view-models/candidate-tab-meta.ts` — meta Documents
- `components/organisms/CandidateDetailPage.tsx` — rendu onglet Documents
- `components/organisms/CandidateDocumentsTab.tsx` (nouveau) — actions IA + previews + `EntityDocumentsTab`
- `view-models/candidate-profile-payload.ts` — exposer `cvSummary`, `anonymizedProfile`
- `server/db/repositories/candidate-profile.repo.ts` — persist champs dérivés IA
- `server/routers/candidate.ts` — `generateSummary`, `generateAnonymized` (+ handlers dédiés si > 100 lignes)
- `server/ai/candidate-summary.ts` — prompt + mock (réutiliser `summaryResponseSchema`)
- `server/ai/candidate-anonymized.ts` — prompt + `anonymizedProfileSchema` + garde PII basique
- `server/pdf/anonymized-profile-document.tsx` — template `@react-pdf/renderer` (couleurs `--color-primary` / `--color-accent`)
- `app/api/candidates/[id]/anonymized-pdf/route.ts` — stream PDF authentifié (pattern download #56/#61)
- `app/(dashboard)/candidats/[id]/page.tsx` — RSC fetch documents candidat si absent
- `apps/web/package.json` — ajouter `@react-pdf/renderer`
- Tests : schemas IA, router mock, garde PII anonymized, PDF render smoke

**Conflit git** possible avec #56 sur fiche candidat — merger `dev` depuis branche #56 si pas encore mergée.

---

## Contraintes

- Zod obligatoire avant tout write DB
- `EXTRACTION_PROVIDER=mock` (ou provider assistant existant) en test
- Prisma uniquement en repositories
- Fichiers < 100 lignes — splitter handlers / composants
- PDF : pas de PII dans le rendu ; logo Medijob (réutiliser `MedicalCross` ou asset statique)

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_057.md` + push + PR `Closes #57`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-57
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login RECRUTEUR → fiche Camille Durand → onglet **Documents** → générer résumé / dossier / export PDF (mock)

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Candidat avec notes → « Générer résumé IA » → synthèse FR lisible enregistrée
- [ ] « Générer dossier anonymisé » → aperçu sans nom/email/tél/adresse
- [ ] « Exporter PDF » → PDF avec branding Medijob (logo + couleurs)
- [ ] Onglet liste CV uploadé (#56), résumé, dossier, upload document additionnel
- [ ] Réponse IA invalide → erreur, pas de DB write
- [ ] CI locale verte
