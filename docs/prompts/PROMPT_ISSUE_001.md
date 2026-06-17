# PROMPT_ISSUE_001 — PRD Module Opérationnel V1

## En-tête

| Champ | Valeur |
|-------|--------|
| **Issue** | [#1 — PRD Module Opérationnel V1](https://github.com/Piamias-Victor/crm-medijob/issues/1) |
| **Type** | Épic parente (documentation + orchestration) |
| **Parent** | Aucun |
| **Blocked by** | Aucun — peut démarrer immédiatement |

> **⚠️ Nature de cette issue** : #1 est l'épic PRD — elle ne se livre **pas** en une slice de code. L'implémentation applicative se fait via les issues enfants **#2 à #17**. Ce prompt oriente les agents et définit les critères de clôture de l'épic.

---

## Skills obligatoires (début de session)

```
/caveman
```

Lire uniquement les fichiers nécessaires :
- `docs/PRD_MODULE_OPERATIONNEL_V1.md`
- `CONTEXT.md`
- `SPEC_V1.md` (sections pertinentes uniquement)
- `docs/adr/0001` à `0004`
- Issue GitHub #1 + issues enfants #2–#17

```
/tdd
```

S'applique aux **issues enfants** (#2–#17), pas à #1 directement. Sur cette épic : valider la couverture des 7 cas de test métier critiques du PRD par les issues enfants (mapping ci-dessous).

---

## Setup Git (avant tout travail)

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. Si mise à jour documentaire nécessaire sur l'épic :
   ```bash
   git fetch origin dev
   git worktree add ../crm-medijob-issue-1 -b feat/issue-1-prd-epic origin/dev
   cd ../crm-medijob-issue-1
   ```
3. Travailler exclusivement dans le worktree
4. **Ne pas implémenter de code applicatif** sur cette issue — router le travail vers l'issue enfant appropriée

---

## Contexte & périmètre

### Objectif de l'épic #1

Livrer le **Module Opérationnel V1** du CRM MediJob : gestion des Candidats, Pharmacies, Contacts et Missions pour l'agence de recrutement pharmacie Medijob, avec pipeline de recrutement, IA (extraction CV, résumé, dossier anonymisé), enrichissement SIRET et tarification des Missions.

### Ce que l'agent fait sur #1

- Utiliser ce PRD comme **source de vérité** pour toutes les issues enfants
- Vérifier l'alignement `SPEC_V1.md` ↔ `CONTEXT.md` ↔ `docs/PRD_MODULE_OPERATIONNEL_V1.md` ↔ ADRs
- Suivre l'avancement des issues #2–#17
- **Fermer #1 uniquement** quand toutes les issues enfants sont mergées et les critères d'acceptation globaux validés

### Ce que l'agent ne fait PAS sur #1

- Implémenter l'application entière sur une seule branche
- Ouvrir une PR `Closes #1` depuis du code applicatif (sauf mise à jour doc épique)

### Roadmap — issues enfants (ordre de dépendance)

| Issue | Titre | Label | Blocked by |
|-------|-------|-------|------------|
| [#2](https://github.com/Piamias-Victor/crm-medijob/issues/2) | App bootstrap + tokens + sidebar | `ready-for-agent` | — |
| [#3](https://github.com/Piamias-Victor/crm-medijob/issues/3) | Page `/design-system` | `ready-for-human` | #2 |
| [#4](https://github.com/Piamias-Victor/crm-medijob/issues/4) | Schéma Prisma + seeds + repositories | `ready-for-agent` | #3 |
| [#5](https://github.com/Piamias-Victor/crm-medijob/issues/5) | Auth login + sessions | `ready-for-agent` | #4 |
| [#6](https://github.com/Piamias-Victor/crm-medijob/issues/6) | Reset password Resend | `ready-for-agent` | #5 |
| [#7](https://github.com/Piamias-Victor/crm-medijob/issues/7) | Admin pipeline/logiciels/users | `ready-for-agent` | #5 |
| [#8](https://github.com/Piamias-Victor/crm-medijob/issues/8) | Candidats CRUD profil | `ready-for-agent` | #7 |
| [#9](https://github.com/Piamias-Victor/crm-medijob/issues/9) | Candidats Événements | `ready-for-agent` | #8 |
| [#10](https://github.com/Piamias-Victor/crm-medijob/issues/10) | Upload CV + extraction IA | `ready-for-agent` | #8 |
| [#11](https://github.com/Piamias-Victor/crm-medijob/issues/11) | Pharmacies + SIRET | `ready-for-agent` | #5 |
| [#12](https://github.com/Piamias-Victor/crm-medijob/issues/12) | Contacts N-N | `ready-for-agent` | #11 |
| [#13](https://github.com/Piamias-Victor/crm-medijob/issues/13) | Missions + tarification | `ready-for-agent` | #11, #12, #8 |
| [#14](https://github.com/Piamias-Victor/crm-medijob/issues/14) | Pipeline kanbans | `ready-for-agent` | #13, #8 |
| [#15](https://github.com/Piamias-Victor/crm-medijob/issues/15) | Placement + mobilité | `ready-for-agent` | #14 |
| [#16](https://github.com/Piamias-Victor/crm-medijob/issues/16) | IA documents + PDF + email | `ready-for-agent` | #10, #15 |
| [#17](https://github.com/Piamias-Victor/crm-medijob/issues/17) | Soft delete + recherche | `ready-for-agent` | #8, #11, #12, #13 |

**Point d'entrée développement** : issue [#2](https://github.com/Piamias-Victor/crm-medijob/issues/2) → `docs/prompts/PROMPT_ISSUE_002.md`

### Critères d'acceptation globaux (clôture épic #1)

- [ ] Issues #2 à #17 toutes fermées (mergées)
- [ ] 83 user stories du PRD couvertes par les slices livrées
- [ ] ADRs 0001–0004 respectés dans le schéma Prisma final
- [ ] 7 cas de test métier critiques validés (voir mapping ci-dessous)
- [ ] `SPEC_V1.md`, `CONTEXT.md` et PRD alignés post-livraison
- [ ] Aucun item Out of Scope introduit par erreur

### Mapping cas de test métier → issues

| Cas critique | Issue responsable |
|--------------|-------------------|
| Placement (Placé + EN_MISSION + EN_COURS) | #15 |
| Soft delete Pharmacie → cascade Missions | #17 |
| ContactPharmacy N-N + isPrimary | #12 |
| Extraction CV Zod + alerte doublon | #10 |
| Marge calculée (clientRate − candidateRate) | #13 |
| Suggestion mobilité | #15 |
| SIRET confirmation champ par champ | #11 |

### ADRs applicables (toute l'épic)

- `docs/adr/0001-contact-many-pharmacies.md` — ContactPharmacy N-N
- `docs/adr/0002-contract-type-no-vacation.md` — CDI/CDD/REMPLACEMENT
- `docs/adr/0003-candidate-status-enum.md` — CandidateStatus
- `docs/adr/0004-mission-status-ouverte.md` — MissionStatus OUVERTE

### Vocabulaire domaine (`CONTEXT.md`)

Candidat, Pharmacie, Contact, Mission, Pipeline, Placement, Référent, CandidateStatus, MissionStatus, Dossier anonymisé, Extraction CV, Enrichissement SIRET, Soft delete, Événement, Logiciel, Mobilité, Emails transactionnels.

---

## Fichiers impactés

> Issue épique — pas de code applicatif. Fichiers de référence et suivi :

- `docs/PRD_MODULE_OPERATIONNEL_V1.md` — PRD local (miroir issue #1)
- `CONTEXT.md` — glossaire domaine (lecture seule sauf `/grill-with-docs`)
- `SPEC_V1.md` — spec technique complète
- `docs/adr/0001` à `0004` — décisions architecture
- `docs/handoffs/HANDOFF_ISSUE_001.md` — suivi avancement épic (à créer en fin de session)
- `docs/prompts/PROMPT_ISSUE_002.md` à `017.md` — prompts des slices enfants

---

## Contraintes techniques (rappel pour toute l'épic)

- Stack : Next.js 15, tRPC v11, Prisma + Neon, NextAuth v5, Tailwind v4, Vitest + Testcontainers
- Prisma uniquement dans repositories
- RSC pour lectures, mutations via `trpc.useMutation()` en Client Components
- Fichiers < 100 lignes, zéro `any`, React Hook Form + Zod
- Atomic design, view-models, Zustand = UI state uniquement
- Resend obligatoire (dossier anonymisé + reset password)
- Pas de kanban global `/candidats`

---

## Fin de session (obligatoire)

1. Si docs mises à jour : pusher sur `feat/issue-1-prd-epic`
2. Ouvrir PR vers `dev` — body : `Relates to #1` (ne pas `Closes #1` tant que l'épic n'est pas terminée)
3. Déposer `docs/handoffs/HANDOFF_ISSUE_001.md` avec :
   - Tableau statut issues #2–#17 (ouverte / en cours / mergée)
   - Écarts doc détectés
   - Prochaine issue enfant recommandée

---

## Tests manuels

Validation de l'épic (à exécuter avant clôture de #1) :

- [ ] `gh issue list --state open` — vérifier que #2–#17 sont toutes fermées
- [ ] Ouvrir l'app déployée (ou `npm run dev`) — sidebar affiche Candidats, Pharmacies, Contacts, Missions
- [ ] Parcours complet : login → créer Candidat → créer Pharmacie → créer Mission → positionner Candidat → Placer → générer dossier anonymisé → envoyer email
- [ ] Vérifier qu'aucune route `/candidats` n'a d'onglet Kanban global
- [ ] Vérifier Contact lié à 2 Pharmacies avec isPrimary différent
- [ ] Vérifier marge affichée sur fiche Mission (clientRate − candidateRate)
- [ ] Vérifier soft delete Pharmacie masque ses Missions associées
- [ ] Vérifier reset password envoie un email (Resend)
- [ ] Relire `CONTEXT.md` — aucun terme en conflit avec l'UI livrée

---

## Références

- [Issue #1 GitHub](https://github.com/Piamias-Victor/crm-medijob/issues/1)
- `docs/prompt-rules.md` · `docs/github-rules.md` · `CLAUDE.md`
- Premier slice implémentable : [#2](https://github.com/Piamias-Victor/crm-medijob/issues/2)
