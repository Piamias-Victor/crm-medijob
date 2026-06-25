# État des lieux fonctionnel — CRM MediJob V2

> **Date** : 2026-06-24  
> **Branche** : `dev` (commit `fe8320d`)  
> **Références lues** : `CLAUDE.md`, `CONTEXT.md`, `docs/PRD.md`  
> **Périmètre** : `apps/web` — pages App Router, routers tRPC, repositories, services externes  
> **Mode** : audit lecture seule — aucune modification de code applicatif

---

## Méthodologie

| Source | Usage |
|--------|-------|
| `docs/PRD.md` | User stories et périmètre cible (référence fonctionnelle) |
| `CONTEXT.md` | Vocabulaire domaine et bounded contexts |
| Routes `apps/web/src/app/**/page.tsx` | Inventaire pages réelles vs placeholders |
| Routers `apps/web/src/server/routers/**` | Contrats API exposés |
| Organisms / molecules | Comportements UI câblés aux mutations |
| `docs/audits/AUDIT_COHERENCE_2026-06-20.md` | Contexte cohérence transversale (complémentaire) |

Légende des statuts :

| Statut | Signification |
|--------|---------------|
| **Fonctionnel** | Parcours utilisateur bout-en-bout opérationnel |
| **Partiel** | Backend et/ou UI existants, mais workflow incomplet |
| **Non commencé** | Absent du code ou placeholder explicite |

---

## Résumé exécutif

CRM MediJob V2 est une application Next.js 15 mono-instance en cours de construction. Les **quatre piliers opérationnels** (Candidats, Pharmacies, Contacts, Missions) sont **largement implémentés** avec listes, fiches détail, kanbans, activity logs et documents. L'**auth**, l'**accueil**, l'**admin des référentiels** et l'**assistant IA chat** sont fonctionnels.

Les **lacunes majeures** par rapport au PRD concernent surtout la **chaîne vitrine → candidatures** (module Offres, webhook Webflow, accept/merge des Applications) et plusieurs **finitions transverses** (soft delete UI entités CRM, recherche globale, matching inversé, envoi email Resend depuis le matching).

| Module | Maturité globale | Blocage principal |
|--------|------------------|-------------------|
| Candidats | ~85 % | Inbox candidatures en lecture seule ; pas de soft delete |
| Pharmacies | ~90 % | Soft delete UI absent |
| Contacts | ~85 % | Soft delete UI absent ; onglet missions en lecture seule |
| Missions | ~80 % | Onglet Offre placeholder ; contact matching (email/tel) absent |
| Offres | ~15 % | Page placeholder ; API write/Webflow absents |
| Candidatures | ~30 % | Liste OK ; workflows accept/refuse/merge non câblés UI |
| Assistant IA | ~75 % | Chat + raccourcis OK ; pas d'envoi email réel |
| Admin | ~95 % | Complet pour référentiels et utilisateurs |

---

## Inventaire des routes

### Routes applicatives

| Route | Statut | Composant / remarque |
|-------|--------|----------------------|
| `/` | Fonctionnel | Redirect → `/accueil` |
| `/login` | Fonctionnel | `LoginView` — NextAuth v5 email/mot de passe |
| `/accueil` | Fonctionnel | `HomePage` — stats, nav modules, création rapide |
| `/candidats` | Fonctionnel | CVthèque (liste + kanban) + onglet Candidatures reçues |
| `/candidats/[id]` | Fonctionnel | Fiche candidat — profil, historique, missions, documents |
| `/pharmacies` | Fonctionnel | Liste + création |
| `/pharmacies/[id]` | Fonctionnel | 5 onglets (infos, contacts, besoins, historique, documents) |
| `/contacts` | Fonctionnel | Liste + création |
| `/contacts/[id]` | Fonctionnel | 4 onglets (infos, historique, missions, documents) |
| `/missions` | Fonctionnel | Liste + kanban statuts mission |
| `/missions/[id]` | Partiel | 5/6 onglets fonctionnels ; **onglet Offre = placeholder** |
| `/offres` | **Placeholder** | `PagePlaceholder` — « arriveront dans un prochain lot » |
| `/offres/[id]` | Non commencé | Route absente |
| `/assistant` | Fonctionnel | Chat IA + raccourcis + contexte entité |
| `/admin` | Fonctionnel | Redirect → `/admin/pipeline` |
| `/admin/pipeline` | Fonctionnel | CRUD + réordonnancement drag-and-drop |
| `/admin/logiciels` | Fonctionnel | CRUD Software (LGO) |
| `/admin/groupements` | Fonctionnel | CRUD Groupement |
| `/admin/metiers` | Fonctionnel | CRUD JobTitle + matrice compatibilité |
| `/admin/utilisateurs` | Fonctionnel | CRUD utilisateurs + rôles + soft delete |
| `/design-system` | Fonctionnel (dev) | Showcase composants — hors nav CRM |

### Routes API

| Route | Statut |
|-------|--------|
| `/api/auth/[...nextauth]` | Fonctionnel |
| `/api/trpc/[trpc]` | Fonctionnel |
| `/api/candidates/[id]/cv` | Fonctionnel — téléchargement CV |
| `/api/candidates/[id]/anonymized-pdf` | Fonctionnel — export PDF profil anonymisé |
| `/api/documents/[id]/download` | Fonctionnel |
| `/api/webhooks/webflow` | **Non commencé** (spécifié PRD, absent du code) |

Toutes les pages dashboard listées disposent d'un `loading.tsx` (skeletons).

---

## Module Candidats

### Implémenté et fonctionnel

- **CVthèque liste** : grille de cartes avec métier, ville, référent (`CvthequeList`).
- **CVthèque kanban** : colonnes par `PipelineStage` ; cartes candidat avec missions actives uniquement ; drag d'une mission pour changer son stage (`CvthequeKanban` → `missionCandidate.updateStage`).
- **Création rapide** : modal depuis liste et accueil (`candidate.create`).
- **Fiche détail** (`/candidats/[id]`) :
  - **Profil** : édition complète (métier, LGO, contrats préférés, mobilité, disponibilité, référent) via `candidate.update`.
  - **Bandeau profil incomplet** : `CandidateProfileBanner` quand champs matching critiques manquants (ADR-0010).
  - **CV** : upload PDF/PNG → extraction IA (`extractCv`) → revue formulaire → confirmation (`confirmExtraction`) ; résolution métiers vers référentiel.
  - **Résumé IA** : génération (`generateSummary`) + édition manuelle (`saveCvSummary`).
  - **Profil anonymisé** : génération IA (`generateAnonymized`) + export PDF via route API dédiée.
  - **Historique** : `ActivityLog` filtré par type, création d'entrées.
  - **Missions** : kanban des positionnements du candidat avec drag stage.
  - **Documents** : upload/suppression polymorphe.
- **Recherche candidats** : `candidate.search` utilisée dans le picker de positionnement mission (pas de recherche globale shell).

### Partiellement implémenté

| Élément | Existant | Manque |
|---------|----------|--------|
| **Onglet Candidatures reçues** | Liste inbox (`application.listInbox`), cartes read-only | Actions accepter / refuser / fusionner ; écran diff merge ; alerte doublon candidature |
| **Soft delete** | `candidateRepository.softDelete` | Procédure tRPC + UI suppression |
| **Matching inversé** (US #21) | Affichage missions positionnées | Scoring IA missions compatibles depuis un candidat |

### Non commencé

- Restauration soft-deleted (hors scope V2 — script CLI uniquement).
- Recherche globale cross-entités depuis le shell.

### Routes

| Route | Statut |
|-------|--------|
| `/candidats` | Fonctionnel |
| `/candidats/[id]` | Fonctionnel |

### Couverture PRD (user stories #8–#23, #24–#32 via onglet inbox)

| US | Statut |
|----|--------|
| #8–#11 Kanban CVthèque | ✅ |
| #12–#15 Extraction CV + référentiel métiers | ✅ |
| #16 Bandeau profil incomplet | ✅ |
| #17–#18 Résumé + profil anonymisé PDF | ✅ |
| #19–#20 ActivityLog + missions positionnées | ✅ |
| #21 Matching inversé | ❌ |
| #22 CV, résumé, anonymisé, documents | ✅ |
| #23 Soft delete | ❌ (repo seulement) |
| #24–#32 Applications inbox | ⚠️ Liste seule |

---

## Module Pharmacies

### Implémenté et fonctionnel

- **Liste** : nom, ville, groupement, statut, contact principal, nombre de missions (`pharmacy.list`).
- **Création / édition** : SIRET, adresse, type, statut commercial, LGO, groupement, conditions paiement, notes.
- **Recherche SIRET** : API `recherche-entreprises.api.gouv.fr` via `pharmacy.searchSiret` ; auto-remplissage adresse.
- **TVA intracommunautaire** : calcul automatique depuis SIREN (`lib/tva.ts`) à la saisie SIRET.
- **Fiche détail** (`/pharmacies/[id]`) — 5 onglets :
  - Infos (édition complète + bandeau champs manquants).
  - Contacts (création contact rattaché).
  - Besoins en cours (liste missions + quick-create mission).
  - Historique (ActivityLog).
  - Documents.
- **Création inline** groupement / logiciel depuis formulaires.
- **Soft delete backend** : `pharmacy.softDelete` exposé tRPC.

### Partiellement implémenté

| Élément | Existant | Manque |
|---------|----------|--------|
| **Soft delete UI** | Mutation tRPC + repo | Bouton suppression liste ou fiche |

### Non commencé

- Aucune fonctionnalité PRD majeure absente hors soft delete UI.

### Routes

| Route | Statut |
|-------|--------|
| `/pharmacies` | Fonctionnel |
| `/pharmacies/[id]` | Fonctionnel |

### Couverture PRD (#33–#40)

| US | Statut |
|----|--------|
| #33–#39 | ✅ |
| #40 Soft delete | ⚠️ Backend seulement |

---

## Module Contacts

### Implémenté et fonctionnel

- **Liste** : nom, rôle, pharmacie, téléphone, email, date ajout (`contact.list`).
- **Création** : depuis liste, accueil, ou onglet pharmacie ; rattachement obligatoire à une pharmacie.
- **Fiche détail** (`/contacts/[id]`) :
  - Infos : édition + bouton « Définir titulaire principal » (`contact.setPrimary`).
  - Historique : ActivityLog complet.
  - Missions : liste des missions où le contact est interlocuteur (liens).
  - Documents : upload/suppression.
- **Titulaire principal** : `isPrimary` géré ; anciens titulaires conservés actifs.

### Partiellement implémenté

| Élément | Existant | Manque |
|---------|----------|--------|
| **Soft delete UI** | `contact.softDelete` tRPC | Bouton suppression |
| **Onglet Missions** | Lecture seule | Actions depuis la fiche contact (création mission) |

### Non commencé

- Rien de bloquant hors éléments partiels ci-dessus.

### Routes

| Route | Statut |
|-------|--------|
| `/contacts` | Fonctionnel |
| `/contacts/[id]` | Fonctionnel |

### Couverture PRD (#41–#47)

| US | Statut |
|----|--------|
| #41–#46 | ✅ |
| #47 Soft delete | ⚠️ Backend seulement |

---

## Module Missions

### Implémenté et fonctionnel

- **Liste** : titre, métier, pharmacie, ville, statut, référent, date début.
- **Kanban statuts** : `A_POURVOIR` → … → `POURVU` / `ANNULEE` ; drag via `mission.updateStatus` ; missions terminales exclues des vues actives.
- **Création** : modal depuis liste, accueil, onglet pharmacie (`mission.create`).
- **Fiche détail** (`/missions/[id]`) :
  - **Infos** : formulaire complet + `MissionStatusActions` (marquer annulée).
  - **Pipeline** : picker candidats (`missionCandidate.position`), kanban par stage, drag stage, retrait, marquage POURVU via stage « Placé » (`mission.markPourvu` + transitions ADR-0008).
  - **Matching** : pré-filtre déterministe (métier, geo, mobilité 30 km défaut, dispo, contrat) + scoring IA Gemini/OpenRouter/mock (`matching.scoreMissionCandidates`) ; positionnement direct depuis résultats.
  - **Historique** : ActivityLog.
  - **Documents** : upload/suppression.
- **Transitions POURVU/ANNULEE** : logique serveur (`runMissionStatusTransition`) — placé / pas retenu sur pipeline.

### Partiellement implémenté

| Élément | Existant | Manque |
|---------|----------|--------|
| **Onglet Offre** | Tab visible dans navigation | Contenu `EmptyState` « Bientôt disponible » — pas de lien JobOffer |
| **Contact matching** (US #57–#58) | Positionnement pipeline | Email Resend, liens tel/WhatsApp, double ActivityLog email |
| **Soft delete** | `missionRepository.softDelete` | tRPC + UI |
| **Marquer POURVU** | Via stage « Placé » dans pipeline | Action dédiée hors pipeline (optionnel PRD) |

### Non commencé

- Génération/publication JobOffer depuis fiche mission (délégué au module Offres).
- Matching inversé depuis candidat.

### Routes

| Route | Statut |
|-------|--------|
| `/missions` | Fonctionnel |
| `/missions/[id]` | Partiel (onglet Offre placeholder) |

### Couverture PRD (#48–#64)

| US | Statut |
|----|--------|
| #48–#56 Matching mission → candidats | ✅ |
| #57–#58 Contact email matching | ❌ |
| #59–#62 Transitions POURVU/ANNULEE | ✅ |
| #63 Documents + ActivityLog | ✅ |
| #64 Soft delete | ❌ |
| #51 Onglet JobOffer | ❌ (placeholder) |

---

## Module Offres d'emploi

### Implémenté et fonctionnel

- **Schéma Prisma** : modèle `JobOffer` (missionId unique, title, content, status, webflowItemId, publishedAt).
- **Repository** : `listForTable`, `findById`, `create`, `softDelete`.
- **Router tRPC (lecture)** : `jobOffer.list`, `jobOffer.getById`.
- **Raccourci assistant** : « Générer offre » produit un brouillon texte dans le chat (pas de persistance JobOffer).

### Partiellement implémenté

| Élément | Existant | Manque |
|---------|----------|--------|
| **Backend write** | Repo `create`/`softDelete` | Mutations tRPC `generate`, `update`, `publish`, `unpublish`, `softDelete` |
| **Service Webflow** | Champ `webflowItemId` en DB | Intégration API CMS, publish/unpublish |
| **Génération IA offre** | Shortcut chat | Workflow structuré Zod → persistance JobOffer |

### Non commencé

- **Page `/offres`** : placeholder explicite.
- **Page détail offre** `/offres/[id]` : absente.
- **Liste offres UI** avec statut, date publication, compteur candidatures.
- **Webhook Webflow** : `POST /api/webhooks/webflow` (HMAC + création Application).
- Variables d'environnement Webflow non utilisées (`WEBFLOW_API_TOKEN`, etc.).

### Routes

| Route | Statut |
|-------|--------|
| `/offres` | **Placeholder** |
| `/offres/[id]` | Non commencé |

### Couverture PRD (#65–#73)

| US | Statut |
|----|--------|
| #65–#73 | ❌ (hors brouillon chat assistant) |

---

## Module Candidatures (Applications)

> Contexte domaine : inbox sous l'onglet Candidats (`/candidats?tab=inbox`), pas de route dédiée.

### Implémenté et fonctionnel

- **Modèle Prisma** : `Application` liée à `JobOffer`, statuts `EN_ATTENTE` / `ACCEPTEE` / `REFUSEE`.
- **Repository** : `listInbox`, `findById`, `updateStatus`, `softDelete`.
- **Router tRPC** :
  - `application.listInbox` — consommé par page Candidats et dashboard accueil.
  - `application.detectDuplicate` — logique email / nom+téléphone.
  - `application.refuse` — refuse une candidature en attente.
- **Logique métier** : `detectDuplicateCandidate`, `refuseApplication` (`server/application/intake.ts`).
- **UI inbox** : cartes avec nom, offre liée, email, ville, badge « En attente ».

### Partiellement implémenté

| Élément | Existant | Manque |
|---------|----------|--------|
| **Refus** | Mutation tRPC | Bouton UI + confirmation |
| **Détection doublon** | Query tRPC | Alerte UI sur carte / modal |
| **Acceptation** | `updateStatus(ACCEPTEE)` en repo | Fonction intake + mutation + conversion Candidate |
| **Fusion** (ADR-0006) | — | Écran diff, choix merge / créer quand même |
| **Soft delete inbox** | Repo | tRPC + UI |

### Non commencé

- **Webhook Webflow** : aucune entrée de candidatures automatisée.
- **Alerte doublon Application** (ré-soumission, sans merge — US #29).
- **Statistiques refusées** : données persistées mais pas de vue dédiée.

### Routes

| Route | Statut |
|-------|--------|
| `/candidats?tab=inbox` | Partiel (lecture seule) |

### Couverture PRD (#24–#32)

| US | Statut |
|----|--------|
| #24–#25 Liste + lien JobOffer | ✅ |
| #26–#29 Dédup / merge / alertes | ❌ |
| #30–#32 Accept / refuse / soft delete | ⚠️ Refuse backend seulement |

---

## Module Assistant IA

### Implémenté et fonctionnel

- **Page dédiée** `/assistant` : interface chat (`AssistantPage`, `AssistantChat`).
- **Chat** : `assistant.chat` — messages utilisateur + réponses IA validées Zod.
- **Contexte entité** : sélecteur Candidat / Pharmacie / Mission + recherche (`assistant.searchEntities`).
- **6 raccourcis** (`server/ai/shortcuts.ts`) :
  - Résumer candidat / pharmacie
  - Rédiger mail candidat / pharmacie (texte brouillon)
  - Générer offre (texte brouillon)
  - Rapport semaine
- **Abstraction provider** : `EXTRACTION_PROVIDER=mock` (dev/test) ou OpenRouter si clé présente.
- **Validation Zod** : schémas dédiés par type de réponse (`server/ai/schemas`).

### Partiellement implémenté

| Élément | Existant | Manque |
|---------|----------|--------|
| **Emails** | Brouillons dans chat | Envoi Resend, création ActivityLog double entrée |
| **Génération offre** | Texte chat | Persistance JobOffer + workflow publication |
| **Recherche** | Contexte assistant uniquement | Barre recherche globale CRM (US #7, issue #79) |

### Non commencé

- Envoi email depuis matching mission (distinct de l'assistant).
- Intégration Resend (aucun fichier `resend` dans le codebase).

### Routes

| Route | Statut |
|-------|--------|
| `/assistant` | Fonctionnel |

### Couverture PRD (#74–#77)

| US | Statut |
|----|--------|
| #74–#76 Chat + contexte + raccourcis | ✅ |
| #77 Validation Zod | ✅ |

---

## Module Admin

### Implémenté et fonctionnel

- **Contrôle d'accès** : routes `/admin/*` réservées rôle `ADMIN` ; nav sidebar conditionnelle.
- **Pipeline** (`/admin/pipeline`) : CRUD `PipelineStage`, réordonnancement drag-and-drop ; seeds par défaut (6 étapes).
- **Logiciels LGO** (`/admin/logiciels`) : CRUD `Software`.
- **Groupements** (`/admin/groupements`) : CRUD `Groupement`.
- **Métiers** (`/admin/metiers`) : CRUD `JobTitle` + matrice compatibilité (`JobTitleCompatibility` scores).
- **Utilisateurs** (`/admin/utilisateurs`) : CRUD, rôles `RECRUTEUR` / `ADMIN`, mot de passe Argon2id, soft delete.
- **Seeds** : référentiels initiaux (pipeline, LGO, métiers, matrice compatibilité).

### Partiellement implémenté

- Aucune lacune fonctionnelle identifiée par rapport au PRD admin.

### Non commencé

- Rien dans le périmètre PRD #78–#84.

### Routes

| Route | Statut |
|-------|--------|
| `/admin` | Redirect → pipeline |
| `/admin/pipeline` | Fonctionnel |
| `/admin/logiciels` | Fonctionnel |
| `/admin/groupements` | Fonctionnel |
| `/admin/metiers` | Fonctionnel |
| `/admin/utilisateurs` | Fonctionnel |

### Couverture PRD (#78–#84)

| US | Statut |
|----|--------|
| #78–#84 | ✅ |

---

## Fonctionnalités transverses

### Auth (#1–#2)

| Fonctionnalité | Statut |
|----------------|--------|
| Login email/mot de passe | ✅ Fonctionnel |
| Sessions DB NextAuth v5 | ✅ |
| Rôles RECRUTEUR / ADMIN | ✅ |
| Tous recruteurs voient toutes les données | ✅ |
| Referent informatif, réassignable | ✅ Candidats + Missions |

### Accueil

| Fonctionnalité | Statut |
|----------------|--------|
| Vue d'ensemble (compteurs) | ✅ `dashboard.overview` |
| Nav rapide modules | ✅ |
| Création rapide (candidat, mission, pharmacie, contact) | ✅ |

### Design system (#3)

| Fonctionnalité | Statut |
|----------------|--------|
| Tokens CSS, composants atoms→organisms | ✅ |
| Page `/design-system` | ✅ (hors nav production) |
| Framer Motion, skeletons loading | ✅ |

### Architecture données (#4)

| Fonctionnalité | Statut |
|----------------|--------|
| Lectures RSC via `createServerCaller` | ✅ |
| Mutations `trpc.useMutation()` client | ✅ |
| Prisma dans repositories uniquement | ✅ (2 exceptions mineures audit cohérence) |
| View-models pont DB→UI | ✅ |
| Fichiers < 100 lignes (CI) | ✅ |

### Soft delete (#5, ADR-0007)

| Entité | Repo | tRPC | UI |
|--------|------|------|-----|
| User (admin) | ✅ | ✅ | ✅ |
| Pipeline / LGO / Groupement / Métier | ✅ | ✅ | ✅ |
| Document | ✅ | ✅ | ✅ |
| Pharmacy | ✅ | ✅ | ❌ |
| Contact | ✅ | ✅ | ❌ |
| Candidate | ✅ | ❌ | ❌ |
| Mission | ✅ | ❌ | ❌ |
| JobOffer | ✅ | ❌ | ❌ |
| Application | ✅ | ❌ | ❌ |

Filtrage `deletedAt: null` actif sur toutes les lectures.

### Recherche globale (#7)

**Non commencé** — recherche limitée à :
- Assistant IA (candidat/pharmacie/mission par terme).
- Picker candidats mission (`candidate.search`).
- Recherche SIRET pharmacies.
- Pool mémoire `search-pool.ts` (pas full-text SQL — issue #79).

### Pipeline transverse (#85–#87)

| Fonctionnalité | Statut |
|----------------|--------|
| PipelineStage administrables | ✅ |
| Mission status ≠ PipelineStage | ✅ |
| Candidat sur plusieurs missions | ✅ |
| Drag kanban CVthèque par mission | ✅ (ADR-0001) |

### IA transverse

| Fonctionnalité | Statut |
|----------------|--------|
| Extraction CV + Zod | ✅ |
| Matching mission pré-filtre + score IA | ✅ |
| Matching inversé candidat | ❌ |
| Résumé / anonymisation candidat | ✅ |
| Provider mock dev/test | ✅ |
| Resend email | ❌ |
| Webflow CMS | ❌ |

### Stockage & fichiers

| Fonctionnalité | Statut |
|----------------|--------|
| Vercel Blob (CV + documents) | ✅ |
| PDF anonymisé `@react-pdf/renderer` | ✅ |

---

## Écarts PRD — synthèse par priorité

### Priorité haute (bloquent la chaîne vitrine)

1. **Webhook Webflow** + création Application
2. **Workflow inbox** : accept, refuse UI, merge avec écran diff, dédup
3. **Module Offres** : UI liste/détail, génération IA persistée, publish/unpublish Webflow
4. **Onglet Offre** sur fiche mission (lien vers JobOffer)

### Priorité moyenne (complètent l'opérationnel)

5. **Contact matching** : email Resend + tel/WhatsApp + double ActivityLog
6. **Matching inversé** candidat → missions
7. **Soft delete UI** entités CRM (pharmacy, contact, candidate, mission)
8. **Recherche globale** shell

### Priorité basse / hors scope V2 explicite

9. Restauration soft-deleted en UI
10. Dark mode (tokens préparés)
11. Notifications temps réel
12. Relecture RGPD juridique

---

## Backlog issues connexes

Issues / prompts en attente alignés sur les lacunes identifiées :

| Référence | Sujet |
|-----------|-------|
| Issue #72 (prompt) | Inbox accept/merge |
| Issues #69–#71 | Module Offres + Webflow |
| Issues #74–#75 | Matching inversé + contact IA |
| Issue #79 | Recherche globale SQL |
| Issue #80 | Soft delete UI entités |
| Issue #114 | Remédiation audit cohérence |
| Issue #121 | Architecture modules profonds |
| Issue #123 | Audit codebase remédiation |

---

## Conclusion

Le CRM MediJob V2 dispose d'une **base opérationnelle solide** pour le cycle staffing interne : CVthèque enrichie IA, portefeuille pharmacies/contacts, missions avec pipeline et matching. L'application est **utilisable au quotidien** par les recruteurs pour la gestion directe des candidats et missions.

Le **gap principal** reste la **frontière site public ↔ CRM** : sans webhook Webflow, module Offres et workflows candidatures, les candidatures entrantes ne peuvent pas alimenter l'inbox ni être converties en profils CVthèque. Les **finitions transverses** (suppression, recherche globale, contact email matching) complètent le périmètre PRD sans bloquer l'usage du cœur métier actuel.

---

*Document généré le 2026-06-24 — branche `dev` @ `fe8320d`.*
