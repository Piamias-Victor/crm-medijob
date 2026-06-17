# CRM MediJob

Medijob est une agence de recrutement spécialisée en pharmacie d'officine. Ce CRM est l'outil interne des recruteurs pour gérer la CVthèque, le portefeuille pharmacies/contacts, et le cycle complet d'un besoin de staffing — du besoin client jusqu'au placement. Les offres publiques (site Webflow) et les candidatures entrantes y sont intégrées, mais restent distinctes du suivi opérationnel mission/candidat.

## Language

**Candidate**:
A person qualified and actively tracked in the CVthèque — created directly (CV upload + human review) or converted from an accepted Application.
_Avoid_: Applicant, postulant, profil (when meaning an inbound application), candidature

**Application**:
An inbound candidacy received via the public website (Webflow), tied to a specific JobOffer. Processed in the "Candidatures reçues" inbox — not part of the CVthèque until accepted and converted to a Candidate.
_Avoid_: Candidature (as a synonym for Candidate), candidat (when meaning the inbound form submission), lead

**Mission**:
A staffing need at a Pharmacy — any contract type (CDI, CDD, intérim, vacation). Tracked operationally from identification through placement or cancellation.
_Avoid_: Poste, besoin, vacation (as entity name), annonce

**JobOffer**:
The optional public-facing job posting derived from a Mission, published on the Medijob website via Webflow. Every JobOffer belongs to exactly one Mission; a Mission may exist without a JobOffer.
_Avoid_: Annonce (as entity name), offre (without qualifier), posting, publication

**PipelineStage**:
An administrable step in the candidate progression on a Mission (e.g. Nouveau → Contacté → Entretien → Proposition → Placé). Distinct from the Mission's own lifecycle status.
_Avoid_: Pipeline (alone), étape (without qualifier), statut candidat, phase

**Mission status**:
The lifecycle of a staffing need itself (A_POURVOIR → EN_RECHERCHE → … → POURVU / ANNULEE). Tracked independently from any candidate's PipelineStage on that Mission.
_Avoid_: Pipeline stage, phase candidat, étape

**MissionCandidate**:
The positioning of a Candidate on a Mission at a given PipelineStage. A Candidate may be positioned on multiple Missions in parallel, each with its own stage.
_Avoid_: Matching, placement, affectation, liaison

**Pharmacy**:
The client organization Medijob recruits for — a pharmacy (officine), clinic, or grouped structure. Identified by SIRET, address, LGO, and commercial status. Never a person.
_Avoid_: Client (ambiguous with Contact), établissement (too generic), officine (too narrow — use when type is INDEPENDANTE)

**Contact**:
A person at a Pharmacy — the human interlocutor for staffing needs and commercial follow-up. Always belongs to exactly one Pharmacy.
_Avoid_: Client, interlocuteur (as entity name), personne, utilisateur

**Referent**:
The Medijob recruiter (User) responsible for follow-up on a Candidate or Mission. Informational and for reporting — all recruiters have full visibility and may act on any record.
_Avoid_: Owner, propriétaire, assigné (implies exclusivity), gestionnaire

**Groupement**:
An administrable pharmacy purchasing network or banner (e.g. Giphar, Alphega). Affiliation is expressed by `groupementId` on a Pharmacy — replaces a separate "groupe" pharmacy type.
_Avoid_: Groupe (as PharmacyType), réseau (without qualifier), chaîne, enseigne

**Software**:
An administrable pharmacy management software (LGO) — e.g. Winpharma, Pharmagest. Declares the LGO used by a Pharmacy and the LGO skills of a Candidate.
_Avoid_: Logiciel (without LGO qualifier), outil, application, programme

**ActivityLog**:
A timestamped record of recruiter action or interaction on a domain entity (Candidate, Pharmacy, Contact, or Mission). Polymorphic — each entry belongs to exactly one entity.
_Avoid_: Historique (as entity name), timeline, journal, note (as entity name)

**Document**:
A file attached to a domain entity (Pharmacy, Contact, Mission, or Candidate) — contracts, quotes, invoices, conventions. Distinct from a Candidate's source CV (`cvUrl`), which is identity data, not a Document.
_Avoid_: Fichier, pièce jointe, CV (as Document — use `cvUrl` on Candidate)

## Bounded contexts

Single-app monolith — contexts are logical boundaries, not separate deployables.

**Candidates** — CVthèque and candidate lifecycle.
Owns: Candidate, `cvUrl`, `cvSummary`, `anonymizedProfile`, CandidateSoftware skills.
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
Owns: Mission, Mission status, Mission referent, salary/planning/contract fields.
Outbound: references Pharmacy and optional Contact; optional JobOffer child; matching requests to AI.

**Pipeline** — candidate progression on missions.
Owns: PipelineStage (administrable steps), MissionCandidate (positioning + stage).
Inbound: Candidate ID and Mission ID from sibling contexts.
Outbound: stage mutations consumed by kanban UI (CVthèque + mission detail).

**JobOffers** — public job postings.
Owns: JobOffer, publication state, Webflow sync.
Inbound: always derived from one Mission.
Outbound: Applications (inbound candidacies from website).

**Applications** — website candidacy inbox.
Owns: Application, deduplication logic, accept/refuse workflow.
Inbound: Webflow webhook tied to JobOffer.
Outbound: Candidate creation on acceptance (into Candidates).

**AI** — assisted extraction, generation, and matching.
Owns: provider abstraction, Zod-validated AI responses, assistant chat.
Cross-cutting: reads Candidates, Pharmacies, Missions; writes derived fields (cvSummary, JobOffer content, matching scores). Never owns domain entities.

**Auth** — internal users and access.
Owns: User, UserRole (RECRUTEUR | ADMIN), sessions.
Provides: Referent identity for Candidates and Missions. All recruiters see all records — role gates admin config only.

### Cross-cutting

**ActivityLog** and **Document** are polymorphic records spanning Candidates, Pharmacies, Contacts, and Missions — not standalone contexts. Each entry belongs to exactly one entity in one of those four contexts.
