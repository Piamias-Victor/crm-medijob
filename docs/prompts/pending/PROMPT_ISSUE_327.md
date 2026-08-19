# Prompt — Issue #327

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/327  
**Parent** : PRD #325 — Finance Devis + suivi  
**Blocked by** : #326  
**Slug branche** : `feat/issue-327-devis-send-pdf-gmail`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : **Envoyer** fige le Devis (il devient **courant**). Un nouveau brouillon n’écrase pas. On génère un PDF (destinataire = Pharmacy / Contact), on le range en **Document** DEVIS sur la Mission (visible aussi sur la Pharmacy, **un** fichier), on ouvre **Gmail** prérempli. Léa joint le PDF à la main. ActivityLog type DEVIS.
2. **Pose 2 à 4 questions** + **reco** :
   - PDF = React-PDF (comme Interview) vs jsPDF du zip ? **Reco : React-PDF CRM**, pas jsPDF.
   - Liste Pharmacy Documents : même `Document` Mission vs copie ? **Reco : même blob**, agrégation à la lecture.
3. **Attends validation** avant de coder.
4. Lire handoff #326 s’il existe. ADR 0012 (Gmail compose). `CONTEXT.md` Document / Devis.

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff `#326` si présent.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-327-devis-send-pdf-gmail origin/dev
```

---

## Périmètre

- Send → SENT ; courant = dernier SENT/ACCEPTED
- DRAFT suivant ≠ courant
- PDF + Document Mission catégorie DEVIS + liste Pharmacy
- Gmail compose Contact ; pas d’envoi serveur
- Soft-delete DRAFT only

Hors slice : Accept/CA (#328).

### Acceptance criteria

- [ ] Send → SENT ; ancien courant retiré
- [ ] Nouveau DRAFT n’est pas courant
- [ ] PDF destinataire Pharmacy (+ Contact)
- [ ] Document DEVIS Mission ; visible fiche Pharmacy
- [ ] Gmail prérempli
- [ ] ActivityLog DEVIS ; DRAFT soft-deletable

---

## Contraintes

- Fichiers < 100 lignes, TDD
- Prisma repositories ; pas d’email SMTP
- Un Document = une entité (Mission) ; Pharmacy **liste** sans 2e blob

## Fichiers impactés

- PDF Interview / dossier anonymisé — pattern à réutiliser
- `EmailButton` / `buildComposeUrl` — Gmail
- Documents Pharmacy tab — agrégation

---

## Fin

PR vers `dev` avec `Closes #327`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Envoyer un DRAFT → SENT, PDF téléchargé, Gmail s’ouvre avec l’email Contact
- [ ] Créer un 2e brouillon → le SENT reste le courant
- [ ] Fiche Pharmacy → Documents : le PDF DEVIS apparaît (pas un doublon)
- [ ] Historique Mission : ligne Devis
