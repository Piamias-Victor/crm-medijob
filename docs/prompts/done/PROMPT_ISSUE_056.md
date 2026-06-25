# Prompt — Issue #56

**Titre** : [CANDIDATS] Upload CV — extraction IA + revue humaine obligatoire  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/56  
**Parent** : #19  
**Blocked by** : #55 · **Débloque** : #57

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_055.md`, `SPEC_V2.md` §7.1, issue #56.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_055.md` (fiche candidat, Combobox, referentials)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-56 -b feat/issue-56-upload-cv-extraction origin/dev
cd ../crm-medijob-issue-56
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

Upload PDF → Vercel Blob → `EXTRACTION_PROVIDER` (gemini|mock) → Zod `CvExtractionSchema` → **écran revue humaine** → confirm met à jour Candidate.

Pas de save auto sans validation humaine. JobTitle résolu vers référentiel à la revue.

**Hors périmètre** : cvSummary/PDF (#57).

**US** : #12–14

### Critères d'acceptation

- [ ] Upload depuis fiche candidat
- [ ] `cvUrl` persisté ; mock provider en test
- [ ] Zod rejette JSON IA invalide
- [ ] Revue éditable : tous champs CvExtractionSchema + JobTitle/Software/contracts
- [ ] Integration test mock end-to-end

---

## Fichiers impactés

- `server/routers/candidate.ts` — extractCv, confirmExtraction
- `server/ai/` — provider + `CvExtractionSchema`
- UI : upload + review screen sur fiche candidat
- `.env.example` — `BLOB_READ_WRITE_TOKEN`, `EXTRACTION_PROVIDER`

---

## Contraintes

Zod obligatoire sur sortie IA, Blob mock en test, fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff + push + PR `Closes #56`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-56
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm dev
```

Login RECRUTEUR → fiche Camille Durand → upload CV (mock si pas de clé Gemini)

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Upload PDF → écran revue pré-rempli
- [ ] Éditer champs → confirm → Candidate mis à jour
- [ ] Réponse IA invalide → erreur, pas de DB write
- [ ] CI locale verte
