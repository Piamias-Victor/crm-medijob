# CRM MediJob

Medijob est une agence de recrutement spécialisée en pharmacie d'officine. Ce CRM est l'outil interne des recruteurs pour gérer la CVthèque, le portefeuille pharmacies/contacts, et le cycle complet d'un besoin de staffing — du besoin client jusqu'au placement. Les offres publiques (site job board Medijob) et les candidatures entrantes y sont intégrées, mais restent distinctes du suivi opérationnel mission/candidat.

## Language

**Candidate**:
A person qualified and actively tracked in the CVthèque — created directly (CV upload + human review), converted from an accepted Application, or created at Interview start.
_Avoid_: Applicant, postulant, profil (when meaning an inbound application), candidature

**Candidate status**:
Lifecycle of a Candidate in the CVthèque: Nouveau / À qualifier / Qualifié / En mission / Inactif / Blacklisté. Distinct from PipelineStage on a Mission. « En mission » is derived when the Candidate has a non-terminal MissionCandidate positioning (manual Inactif/Blacklisté still allowed).
_Avoid_: statut (without qualifier), pipeline stage, phase

**Profile completeness**:
Matching-critical fields on a Candidate (`city`, `postalCode`, mobility radius, availability). Missing fields trigger an informational banner on the candidate profile — they do not block CRM actions, but the candidate is excluded from distance-based matching until completed.
_Avoid_: Profil incomplet (as entity name), validation, alerte bloquante

**Preferred contract types**:
The contract types a Candidate is willing to accept (CDI, CDD, intérim, vacation). Empty means no contract-type filter in matching.
_Avoid_: Préférences (without qualifier), type de contrat recherché, souhait

**Salary expectations**:
The Candidate's stated pay pretensions (free text and/or min-max). Used as a matching criterion when set.
_Avoid_: prétentions (without qualifier), salaire souhaité (as separate entity)

**Mobility radius**:
The maximum distance in km a Candidate is willing to travel from their location. When unset, matching assumes 30 km.
_Avoid_: Rayon (without qualifier), distance, zone de chalandise

**Availability**:
The date from which a Candidate can start a Mission. When unset, the Candidate is assumed immediately available for matching.
_Avoid_: Disponibilité (as free text), date de début, planning

**Application**:
An inbound candidacy received via the public job board, tied to a specific JobOffer. Each Application is one board submission, identified by that board’s submission id — ingest never creates a second Application for the same submission, and never reopens one already accepted or refused. Processed in the "Candidatures reçues" inbox — not part of the CVthèque until accepted and converted to a Candidate. Duplicate detection alerts on existing Candidates but never merges two Applications together. Soft-deletable by recruiters.
_Avoid_: Candidature (as a synonym for Candidate), candidat (when meaning the inbound form submission), lead

**Interview**:
A first-class qualification conversation on a Candidate (status DRAFT or CLOSED, mode INTERIM or CDD_CDI, answers/scores, eligibility decision, Referent). Distinct from the PipelineStage named « Entretien » (mission progression) and from Application (website inbound). The métier and mode at Interview start pin a **published** InterviewTemplate version; the DRAFT stays on that version. New Interviews use the latest published version.
_Avoid_: Entretien (unqualified), évaluation, eval, qualification projet, PipelineStage Entretien (as the Interview entity)

**InterviewTemplate**:
A versioned question bank (trame) for one JobTitle `profileKey` × InterviewMode (INTERIM | CDD_CDI). Direction and RH-Admin create or edit a working copy, then publish a new version; a new template may start empty or as a duplicate of another published template. Each question may declare an explicit Candidate mapping at close (availability, software, mobility, salary, contracts, or none) and scoring (eliminatory, B/C criterion, answer points). At most one question per mapping kind per template. Recruteur and Communication do not edit templates. Not keyed by UserRole. A JobTitle without profileKey, or whose dedicated template is archived, uses the generic template. Factory seeds create a template only when that profile × mode does not exist yet — they never replace a published CRM version. Published versions are not hard-deleted; a DRAFT Interview keeps the version it started on.
_Avoid_: questionnaire, eval config, brouillon (that word means Interview status DRAFT, not an unpublished template)

**AppProfile**:
A profile pulled from the Medijob mobile app (Badakan `searchNewEmployees`) into the CRM "Profils app" tab — not part of the CVthèque until a recruiter accepts it and creates or merges a Candidate. Distinct from Application (website candidacy). Once accepted or ignored, it must not reappear on the next sync.
_Avoid_: Application, candidature app, recipient (as UI label), Badakan candidate

**JobTitle**:
An administrable job role in the pharmacy staffing domain (e.g. Pharmacien, Préparateur). Referenced by Candidate and Mission — replaces the former fixed enum.
_Avoid_: Métier (as free text), fonction, enum JobTitle

**Job title compatibility**:
An admin-defined rule that a Candidate with a given JobTitle can match a Mission with another JobTitle. Stored in the compatibility matrix (`JobTitleCompatibility`).
_Avoid_: Correspondance métier, matching métier (as entity name)

**Mission**:
A staffing need at a Pharmacy — any contract type (CDI, CDD, intérim, vacation), with a structured JobTitle. Tracked operationally from identification through placement or cancellation.
_Avoid_: Poste, besoin, vacation (as entity name), annonce

**JobOffer**:
The optional public-facing job posting derived from a Mission, published on the Medijob public job board. Every JobOffer belongs to exactly one Mission; a Mission may exist without a JobOffer. The board assigns its own listing identity; the CRM stores that identity on the JobOffer and never stamps the CRM id onto the public listing. Filling or cancelling the Mission unpublishes the JobOffer.
_Avoid_: Annonce (as entity name), offre (without qualifier), posting, publication, Webflow item

**PipelineStage**:
An administrable step in the candidate progression on a Mission (e.g. Nouveau → Contacté → Entretien → Proposition → Placé → Pas retenu). Distinct from the Mission's own lifecycle status. « Pas retenu » is the terminal stage for candidates not selected when a Mission is filled.
_Avoid_: Pipeline (alone), étape (without qualifier), statut candidat, phase

**Mission status**:
The lifecycle of a staffing need itself (A_POURVOIR → EN_RECHERCHE → … → POURVU / ANNULEE). Tracked independently from any candidate's PipelineStage on that Mission, and independently from Commercial status.
_Avoid_: Pipeline stage, phase candidat, étape, état commercial (that is Commercial status)

**Devis**:
A commercial quote on a Mission for a Pharmacy (intérim or CDD/CDI) — stored inputs, amounts, send/accept cycle, PDF. Price is free: hours and rate (engine computes HT) or a typed HT total; hours can always be edited; CDD/CDI is a typed forfait, not one month of salary. The current Devis is the last one sent or accepted; a draft never replaces it. Sending retires the previous current Devis, writes a DEVIS Document on the Mission, and opens Gmail compose to the Pharmacy Contact. CA stays 0 until the current Devis is accepted. Any role that can write the Mission may create, send, and accept. Distinct from Document and from an ActivityLog line typed DEVIS.
_Avoid_: quote (as UI label), facture, ActivityLog DEVIS (as the quote itself), estimateur rémunération, tarif Medijob (as a locked pack)

**Commercial status**:
The commercial lifecycle of a Mission, derived from its current Devis: Sans devis → Envoyé → Accepté → Facturé. Facturé is a mark (with a date) on that Devis — not a separate invoice record. Independent from Mission status — a Mission can be EN_RECHERCHE and Envoyé at the same time.
_Avoid_: Mission status, statut devis (as a second Mission enum), pipeline commercial (as entity name), Facture (as entity)

**MissionCandidate**:
The positioning of a Candidate on a Mission at a given PipelineStage. A Candidate may be positioned on multiple Missions in parallel, each with its own stage. Only non-terminal positionings appear on the active CVthèque kanban card.
_Avoid_: Matching, placement, affectation, liaison

**Pharmacy**:
The client organization Medijob recruits for — a pharmacy (officine), clinic, or grouped structure. Identified by SIRET, address, LGO, and commercial status. Never a person.
_Avoid_: Client (ambiguous with Contact), établissement (too generic), officine (too narrow — use when type is INDEPENDANTE)

**Pharmacy status**:
Commercial lifecycle of a Pharmacy: Client / Prospect / Inactif (CSV V1). Filterable across list views.
_Avoid_: Actif (legacy label for Client), ACTIF (as user-facing label)

**Contact**:
A person at a Pharmacy — the human interlocutor for staffing needs and commercial follow-up. Always belongs to exactly one Pharmacy.
_Avoid_: Client, interlocuteur (as entity name), personne, utilisateur

**Primary contact**:
The designated main Contact for a Pharmacy (`isPrimary`). Soft-deleting a primary Contact is blocked until another Contact on that Pharmacy is designated primary.
_Avoid_: Contact principal (as separate entity), interlocuteur principal (as entity name)

**Contact role**:
An administrable function of a Contact at a Pharmacy (e.g. Titulaire, Comptabilité). Seeded defaults match CSV V1; admins can add, rename, or remove entries like JobTitle.
_Avoid_: ContactRole enum (legacy fixed list), fonction (as free text)

**Referent**:
The Medijob User responsible for follow-up on a Pharmacy, Contact, Candidate, or Mission. Optional on all four entities — informational and for reporting/filters; visibility and reassignment rights depend on UserRole permissions. CA and Marge of a Mission are attributed to that Mission's Referent.
_Avoid_: Owner, propriétaire, assigné (implies exclusivity), gestionnaire, opérateur, compte opérateur

**UserRole**:
One of four internal access roles: Direction, Recruteur, Communication, RH-Admin. Rights are differentiated per module for actions; financial fields (CA, Marge) have separate view rights by role. Operational records are otherwise visible to all roles.
_Avoid_: ADMIN, RECRUTEUR (legacy two-role model), rôle (without qualifier)

**CA / Marge**:
Financial figures shown in the CRM (revenue and margin). Visibility is gated by UserRole — Recruteur and Communication never see them. CA of a Mission is 0 until its current Devis is accepted; the accepted amount is the CA once (never multiplied by mission duration), dated on that acceptance day for follow-up. If the Mission is ANNULEE, CA returns to 0. Marge of a Mission is typed by Direction or RH-Admin; the simulator's margin is indicative only and does not feed follow-up. Marge uses the same acceptance date as CA and also clears on ANNULEE. Follow-up slices by Referent, Pharmacy, contract type, and dates — not by Candidate.
_Avoid_: chiffre d'affaires (as free UI label without the CA token), rentabilité (as synonym for Marge), marge calculée (as the follow-up figure), CA candidat

**Groupement**:
An administrable pharmacy purchasing network or banner (e.g. Giphar, Alphega). Affiliation is expressed by `groupementId` on a Pharmacy — replaces a separate "groupe" pharmacy type.
_Avoid_: Groupe (as PharmacyType), réseau (without qualifier), chaîne, enseigne

**Software**:
An administrable pharmacy management software (LGO) — e.g. Winpharma, Pharmagest. Declares the LGO used by a Pharmacy and the LGO skills of a Candidate.
_Avoid_: Logiciel (without LGO qualifier), outil, application, programme

**ActivityLog**:
A timestamped record on a domain entity (Candidate, Pharmacy, Contact, or Mission). Includes recruiter interactions (call, email, note…) and automatic system entries on create/update. Polymorphic — each entry belongs to exactly one entity.
_Avoid_: Historique (as entity name), timeline, journal, note (as entity name), audit log (as separate entity)

**Document**:
A file attached to a domain entity (Pharmacy, Contact, Mission, or Candidate) — contracts, quotes, invoices, conventions. Distinct from a Candidate's source CV (`cvUrl`), which is identity data, not a Document. A sent Devis PDF is a Document on that Mission (category DEVIS); the Pharmacy documents tab also lists those files from the Pharmacy's Missions — one file, not a second copy.
_Avoid_: Fichier, pièce jointe, CV (as Document — use `cvUrl` on Candidate)

**Anonymized dossier**:
A shareable, PII-free presentation of a Candidate for pharmacy clients — six fixed sections (accroche, métier & expérience, compétences & logiciels, mobilité, disponibilité & contrat, points forts) generated by AI in a review modal (Profil or Documents shortcut), editable before PDF export. Empty sections are omitted from the PDF. Full AI regenerate overwrites all sections (with confirm in the modal); the recruiter may edit again afterward. The same PII guard applies on AI generation and on manual save (refuse persist if email, phone, or forbidden identity tokens appear). Distinct from `cvSummary` (internal recruiter notes) and from presentation emails to pharmacies.
_Avoid_: Profil anonymisé (as product name), anonymizedProfile (as UI label), dossier de présentation (without “anonymisé”)

## Bounded contexts

Single-app monolith — contexts are logical boundaries, not separate deployables.

**Candidates** — CVthèque and candidate lifecycle.
Owns: Candidate, JobTitle reference, `cvUrl`, `cvSummary`, `anonymizedProfile`, CandidateSoftware skills, preferred contract types.
Inbound: Application conversion (from Applications), CV extraction (from AI).
Outbound: referenced by Pipeline (MissionCandidate), Missions (matching).

**Pharmacies** — client organization portfolio.
Owns: Pharmacy, commercial status, SIRET identity, LGO (`softwareId`), network affiliation (`groupementId`).
Outbound: Contacts (children), Missions (staffing needs), ActivityLog, Document.

**Contacts** — human interlocutors at pharmacies.
Owns: Contact, ContactRole, `isPrimary` designation.
Inbound: always belongs to one Pharmacy.
Outbound: optional Mission interlocutor, ActivityLog, Document.

**Missions** — staffing needs and mission lifecycle.
Owns: Mission, JobTitle reference, Mission status, Mission referent, salary/planning/contract fields.
Outbound: references Pharmacy and optional Contact; optional JobOffer child; matching requests to AI.

**Pipeline** — candidate progression on missions.
Owns: PipelineStage (administrable steps), MissionCandidate (positioning + stage).
Inbound: Candidate ID and Mission ID from sibling contexts.
Outbound: stage mutations consumed by kanban UI (CVthèque + mission detail).

**JobOffers** — public job postings.
Owns: JobOffer, publication state, sync to the public job board.
Inbound: always derived from one Mission.
Outbound: Applications (inbound candidacies from the job board).

**Applications** — website candidacy inbox.
Owns: Application, deduplication logic, accept/refuse workflow.
Inbound: job-board candidacies tied to a JobOffer.
Outbound: Candidate creation on acceptance (into Candidates).

**AppProfiles** — Badakan app registration inbox ("Profils app").
Owns: AppProfile, manual sync from Badakan `searchNewEmployees`, accept/ignore workflow.
Inbound: Badakan API (read-only).
Outbound: Candidate creation or merge on acceptance (into Candidates). Never auto-writes the CVthèque.

**Interviews** — structured qualification conversations replacing medijob-eval.
Owns: Interview, InterviewTemplate (versioned trames).
Inbound: Candidate ID, optional Referent (User). JobTitle `profileKey` selects the trame.
Outbound: later write-back to Candidate at close. Never a PipelineStage and never an Application.

**Finance** — commercial quotes and performance follow-up.
Owns: Devis, Commercial status (derived), CA and Marge on the Mission.
Inbound: Mission, Pharmacy, Referent.
Outbound: Mission — where Recruteur / Communication create, send, and accept a Devis. Facturation (global follow-up + Devis list) is Direction / RH-Admin only. Never a candidate salary estimator.

**AI** — assisted extraction, generation, and matching.
Owns: provider abstraction, Zod-validated AI responses, assistant chat.
Cross-cutting: reads Candidates, Pharmacies, Missions; writes derived fields (cvSummary, JobOffer content, matching scores). Never owns domain entities. The assistant chat interlocutor is always the MediJob recruiter — Candidates, Contacts, and Pharmacies are spoken about in the third person; draft-to-candidate tone is reserved for the explicit candidate-email shortcut. Free-chat turns include a short sliding window of prior messages (UI-session only, not persisted). Changing or clearing the entity context starts a fresh conversation.

**Auth** — internal users and access.
Owns: User, UserRole (Direction | Recruteur | Communication | RH-Admin), sessions.
Provides: Referent identity for Pharmacies, Contacts, Candidates, and Missions. Referential admin (JobTitle, Pipeline, etc.) and module actions are gated by UserRole permissions.

### Cross-cutting

**Soft delete**:
Marking a record as deleted without physical removal. The only deletion mechanism in the CRM UI. Soft-deleted records are hidden from all users — no restore UI in V2 (script only).
_Avoid_: Suppression définitive, purge (in UI context), archivage, corbeille

**ActivityLog** and **Document** are polymorphic records spanning Candidates, Pharmacies, Contacts, and Missions — not standalone contexts. Each entry belongs to exactly one entity in one of those four contexts.
