# CRM MediJob

Medijob est une agence de recrutement spécialisée en pharmacie d'officine. Ce CRM est l'outil interne des recruteurs pour gérer la CVthèque, le portefeuille pharmacies/contacts, et le cycle complet d'un besoin de staffing — du besoin client jusqu'au placement. Les offres publiques (site job board Medijob) et les candidatures entrantes y sont intégrées, mais restent distinctes du suivi opérationnel mission/candidat.

## Language

**Candidate**:
A person actively tracked in the CVthèque — created directly (CV upload + human review), converted from an accepted Application, created at Interview start, or created by Badakan sync when App-validated (origin App). Origin App is not Candidate status Qualifié.
_Avoid_: Applicant, postulant, profil (when meaning an inbound application), candidature

**Candidate status**:
Lifecycle of a Candidate in the CVthèque: Nouveau / À qualifier / Qualifié / En mission / Inactif / Blacklisté. Distinct from PipelineStage on a Mission. « En mission » is derived when the Candidate has a non-terminal MissionCandidate positioning (manual Inactif/Blacklisté still allowed). A Candidate created from App-validated starts at **Nouveau**. Origin App is not Qualifié. If Badakan later reports SUSPENDED or BANNED, the Candidate becomes **Inactif** (out of weekly-availability filter, the availability SMS, and the interim need SMS) — that is not Blacklisté. **Blacklisté** is also out of those SMS. If Badakan restores `COMPLETED`, status returns to what it was before Inactif (Qualifié stays Qualifié) and they re-enter the filter; no second first-send SMS (`smsSentAt` stays). The 15-day reminder still runs when due.
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
_Avoid_: Disponibilité (as free text), date de début, planning, Weekly availability (that's the interim slot calendar)

**Weekly availability**:
The declared AM/PM slots of an App-origin Candidate who is App-validated, on real calendar dates. The personal page shows **one week at a time**; she can switch to the following weeks to fill them. All past weeks she filled stay in history and remain visible. A week never submitted is **unknown** (excluded from the “available” filter). A week submitted with no slots is **declared unavailable**. Week-grid UI (Skello / Google Calendar style — tap AM/PM cells). Used as the Intérim V1 filter together with JobTitle and city / mobility radius (not software, salary, or contract-type matching). Only App-origin App-validated Candidates who are not Inactif or Blacklisté. Copyable secret URL stays valid; the page is **public** (no Candidate login) — whoever has the unguessable link can view and edit those slots. First SMS at App-validated (validation + app + secret URL, one GSM-7 segment); if the phone is missing, wait for the next sync then send once. Reminder every 15 days at 9h Europe/Paris (Vercel `0 7 * * *` UTC, same as Interim need SMS) with a distinct copy, including Candidates who already declared. Recruiter may resend by hand (reminder copy, resets the 15-day clock). No department send-zone. Distinct from Availability (a single `availableFrom` date) and from Badakan mission periods (already-staffed shifts).
_Avoid_: Disponibilité (unqualified), planning (unqualified), Availability, planning Badakan, semaine type, heures précises, Calendly (as booking), 4 semaines à l’écran

**Application**:
An inbound candidacy, usually tied to a JobOffer, or **spontaneous** (`jobOfferId` null, `ApplicationSource` spontaneous) via `/postuler`. Entry via board ingest (`ApplicationSource` board), the offer **Public apply page** (`public-apply`), or the spontaneous public page (`spontaneous`). Carries optional applicant `postalCode` (required on the public apply pages; may be absent on board-ingested rows). Identified for board rows by `boardSubmissionId` (unique). Never reopens one already accepted or refused. Processed in the "Candidatures reçues" inbox — not part of the CVthèque until accepted and converted to a Candidate. Duplicate detection alerts on existing Candidates but never merges two Applications together. Soft-deletable by recruiters. Distinct from a recipient applying to a Badakan mission (`SEARCH_APPLIED`).
_Avoid_: Candidature (as a synonym for Candidate), candidat (when meaning the inbound form submission), lead, SEARCH_APPLIED

**Application source**:
How an Application entered the CRM: board ingest vs public-apply (offer page) vs spontaneous (unlinked `/postuler`). Visible and filterable in the Applications inbox.
_Avoid_: origin (unqualified), canal (unqualified), ConsentSource (that's GDPR provenance)

**Applicant postal code**:
The postal code declared by the applicant on an Application (`postalCode`). Required on the Public apply page (5 digits); nullable for legacy / board-ingested rows. Distinct from Pharmacy or Candidate profile postal code until accept/convert.
_Avoid_: Code postal (unqualified), Candidate postalCode (that's the CVthèque profile)

**Public apply page**:
A public CRM page at `/postuler/[boardListingId]` (offer) or `/postuler` (spontaneous, no login, `noindex`). Offer page opened from the job board « Postuler » button with the board listing id. Shows JobOffer context read-only: title, métier, city, contract — only when **PUBLIEE**; otherwise unavailable (unknown id → 404). Spontaneous page has no offer card. Applicant must submit first/last name, email, phone (FR), city, postal code, CV (PDF/DOC/DOCX · max 5 Mo · magic-byte check), mandatory unchecked consent (`ConsentSource` SITE + timestamp), optional message. IP rate limit (5/hour). Success → on-page thank-you (no email). Downstream inbox accept/refuse unchanged. Does not modify the Medijob job-board site or stop board ingest in code (ops cutover after Matthieu redirects buttons).
_Avoid_: T4S apply, tzportal, formulaire site Supabase, page dispo (that's Weekly availability)

**Interview**:
A first-class qualification conversation on a Candidate (status DRAFT or CLOSED, mode INTERIM or CDD_CDI, answers/scores, eligibility decision, Referent). Distinct from the PipelineStage named « Entretien » (mission progression) and from Application (website inbound). The métier and mode at Interview start pin a **published** InterviewTemplate version; the DRAFT stays on that version. New Interviews use the latest published version.
_Avoid_: Entretien (unqualified), évaluation, eval, qualification projet, PipelineStage Entretien (as the Interview entity)

**InterviewTemplate**:
A versioned question bank (trame) for one JobTitle `profileKey` × InterviewMode (INTERIM | CDD_CDI). Direction and RH-Admin create or edit a working copy, then publish a new version; a new template may start empty or as a duplicate of another published template. Each question may declare an explicit Candidate mapping at close (availability, software, mobility, salary, contracts, or none) and scoring (eliminatory, B/C criterion, answer points). At most one question per mapping kind per template. Recruteur and Communication do not edit templates. Not keyed by UserRole. A JobTitle without profileKey, or whose dedicated template is archived, uses the generic template. Factory seeds create a template only when that profile × mode does not exist yet — they never replace a published CRM version. Published versions are not hard-deleted; a DRAFT Interview keeps the version it started on.
_Avoid_: questionnaire, eval config, brouillon (that word means Interview status DRAFT, not an unpublished template)

**AppProfile**:
A profile pulled from the Medijob mobile app (Badakan `searchNewEmployees`) into the Intérim **App intake follow-up** list (UI: « Entrées app » at `/interim/entrees-app`; replaces the former "Profils app" tab). Sync creates or links a Candidate (origin App) as soon as the row can be converted. The row stays in the default Entrées view while the Candidate is still **Nouveau** — including after Badakan App-validated. Distinct from Application (website candidacy). Recruiter **✗ Ignorer** sets AppProfile `IGNORE` + Candidate `INACTIF` and leaves Entrées; **✓ Qualifié** sets Candidate `QUALIFIE` and leaves Entrées. Soft-hide on Ignore still applies to the default CVthèque list. There is no recruiter ACCEPTE path. App-validated still unlocks weekly-availability SMS but is **not** the Entrées exit gate.
_Avoid_: Application, candidature app, recipient (as UI label), Badakan candidate, envoyé (as AppProfile status), Profils app (legacy UI label), Suivi candidats (rejected nav label), Hireflix, ACCEPTE

**App-validated**:
A Badakan recipient whose app dossier is validated (`valid` / `validationStep COMPLETED`). On sync the CRM marks AppProfile `APP_VALIDATED` and may unlock weekly-availability SMS — it does **not** by itself remove the row from Entrées app (Candidate must leave Nouveau via Qualifié / Ignorer). Distinct from AppProfile status ACCEPTE, from Candidate status Qualifié, and from the PDF « profil validé » (MediJob accept after interview — out of Intérim V1).
_Avoid_: profil validé (unqualified), validé MediJob, COMPLETED (as UI label), valider (unqualified)

**App intake follow-up**:
The Intérim working list (UI: « Entrées app », `/interim/entrees-app`) of app arrivals while the linked Candidate is still **Nouveau** — recruiters track contact and dossier actions here, even when Badakan already App-validated. **Table-only** (no AppProfile detail page): row actions **✗** / **✓** exit the file; a **Fiche** link opens the linked Candidate when present. The table shows read-only identity/contact (phone, name, email, job/profile, city, postal code, enrolled-at), Badakan comments, and Intake booking SMS sent indicator; editable ops fields mirror the Syncro sheet: **Intake status**, **Call outcome**, planned RDV date, a free-text **notes** field on the AppProfile, **Referent** (assignee), and **relance date**. Each intake edit also mirrors onto the linked Candidate (Referent sync + ActivityLog). Relance defaults to the intake day on arrival and to last-call + 2 days when Call outcome is saved; the recruiter may override. A past relance date is shown as overdue (sort/badge) but does **not** auto-change Intake status. The default list filter is the current User as Referent **or** unassigned; recruiters can switch to the full queue. Last-call timestamp and caller are stamped automatically when Call outcome is saved (current User) — not free-text. One-shot Syncro import via `apps/web/scripts/import-syncro-entrees.ts` (dry-run default; `--apply` writes). Flow: arrive → Candidate create/link (Nouveau) + Intake booking SMS → recruiter updates fields → **✗** Ignorer / **✓** Qualifié exits Entrées; Badakan App-validated may happen in parallel without emptying the file. Distinct from `/interim/candidats`, from `/interim/suivi`, and from sheet STATUT « Validé » as a synonym of App-validated.
_Avoid_: Syncro, Suivi (unqualified), Suivi candidats, Candidats Intérim, Hireflix, Candidate status (for ops fields alone), ATTRIBUE A, APPEL PAR, _RELANCE, Profils app

**Intake status**:
Recruiter-owned lifecycle on an AppProfile in App intake follow-up. Closed set: `À appeler`, `Dossier incomplet`, `À relancer`, `Hors zone`. New AppProfiles default to `À appeler`. Ops flags alone no longer remove the row from Entrées — exit is Qualifié / Ignorer on the Candidate. Not Candidate status, not Badakan `validationStep`, not App-validated. `Validé` and `Suspendu` are never Intake status values — they come from Badakan sync (App-validated / Inactif).
_Avoid_: statut (unqualified), Validé (as Intake status), Suspendu (as Intake status), STATUT

**Call outcome**:
Result of the last recruiter contact attempt on an AppProfile. Closed set: `Messagerie`, `RDV pris`, `À rappeler`, `Pas intéressé`, `Hors cible`, `Pas de réponse`. Choosing `RDV pris` requires a planned RDV date. Ops negatives soft-hide CVthèque but no longer alone exit Entrées. Distinct from Intake status and from Badakan comment.
_Avoid_: RESULTAT, résultat d'appel (as entity), ActivityLog (that's the CRM note stream)


**Candidate origin**:
How the Candidate entered the CVthèque: CRM, App (from an App-validated Badakan recipient), or T4S (Tool4Staffing import). Distinct from Candidate status; matching a T4S row to an existing App Candidate does not change origin App.
_Avoid_: vient de l'app (as a status), source (unqualified), import (as a status), InterimProfile


**Hireflix invitation**:
_Removed._ Video-interview invites via Hireflix are no longer part of the product. Replaced by the **Intake booking SMS** (Google Calendar slot) on App intake follow-up.
_Avoid_: Hireflix, video interview invite (as AppProfile lifecycle)

**Intake booking SMS**:
A one-shot transactional SMS to a new AppProfile inviting them to book a video RDV with MediJob via a Google Calendar appointment link. Already shipped; App intake follow-up does not change send rules or copy. Distinct from the weekly-availability SMS (sent at App-validated) and from Interview.
_Avoid_: Hireflix SMS, SMS RDV (unqualified), availability SMS

**JobTitle**:
An administrable job role in the pharmacy staffing domain (e.g. Pharmacien, Préparateur). Referenced by Candidate and Mission — replaces the former fixed enum.
_Avoid_: Métier (as free text), fonction, enum JobTitle

**Job title compatibility**:
An admin-defined rule that a Candidate with a given JobTitle can match a Mission with another JobTitle. Stored in the compatibility matrix (`JobTitleCompatibility`).
_Avoid_: Correspondance métier, matching métier (as entity name)

**Mission**:
A staffing need at a Pharmacy — any contract type (CDI, CDD, intérim, vacation), with a structured JobTitle. Tracked operationally from identification through placement or cancellation. Created by a recruiter in the CRM — not imported from Badakan.
_Avoid_: Poste, besoin, vacation (as entity name), annonce, Badakan mission

**Badakan mission**:
An interim shift that lives in Badakan (pharmacy, periods, applicants at `SEARCH_APPLIED`). Shown in the Intérim module. Not a Mission: it does not enter the CRM kanban or PipelineStage.
_Avoid_: Mission, besoin CRM, vacation (as entity name)

**Pharmacy apply email**:
Transactional Brevo template when a recipient first appears at `SEARCH_APPLIED` on a Badakan mission. Goes to `Pharmacy.email` and the primary Contact email. `contact.PRENOM` is the primary Contact first name, never the applicant. One send per `(missionBadakanId, recipientId)` journaled outside the SEARCH_APPLIED snapshot (sync still replaces applicants each cycle). Existing applicants are seeded in the journal at go-live without sending.
_Avoid_: Application (job board), Hireflix invite, interim need SMS

**Interim need SMS**:
Daily 12h45 Europe/Paris (Vercel cron `45 10 * * *` UTC = 12h45 CEST / 11h45 CET) transactional SMS (same Brevo port as the availability SMS) to App-origin App-validated Candidates who are not Inactif or Blacklisté. Sent when at least one open Badakan need (`CREATED` + staffing gap) has the same JobTitle and is within 80 km (stored coords or commune postal lookup like matching; not Mobility radius). If `interimNeedSmsSentAt` is set, only a need with `createdAt` after that stamp counts. `syncedAt` is ignored. One SMS per Candidate. `interimNeedSmsSentAt` is written only after a real send — never at App-validated or on a dry cron pass. Copy points to the Medijob app. Distinct from the weekly-availability SMS and from Mission matching.
_Avoid_: matching SMS, push, weekly availability SMS (that's the dispo link)

**Badakan contract**:
An INTERIM (or extra/permanent) contract that lives in Badakan (PDF, DPAE, status CREATED/VALIDATED/CANCELLED). Read into the Intérim module. Not a Ligne de suivi, not a Devis, not a CRM Document of category contract unless a file is attached on the fiche. When a contract first appears as `CREATED` after go-live, a transactional SMS invites the Candidate (`badakanId` = Badakan recipient id) to sign the email PDF; a reminder follows 24h later if still `CREATED`. The same `CREATED` event sends Brevo template 231 to `Pharmacy.email` and the primary Contact (`PRENOM` = pharmacy contact first name, never the Candidate). Existing `CREATED` rows are stamped without sending. Not Inactif or Blacklisté. Distinct from the weekly-availability SMS, the interim-need SMS, and the pharmacy apply email.
_Avoid_: Ligne de suivi Intérim, contrat CRM, Devis

**JobOffer**:
The optional public-facing job posting published on the Medijob public job board. A JobOffer may be **liée** (derived from one Mission — `missionId` set) or **sans mission** (standalone fields on the JobOffer). A Mission may exist without a JobOffer; at most one JobOffer per Mission. The board assigns its own listing identity; the CRM stores that identity on the JobOffer and never stamps the CRM id onto the public listing. Filling or cancelling the linked Mission unpublishes that JobOffer. Public `entreprise` is always `MEDIJOB`. Description HTML uses four fixed sections (RÉSUMÉ DU POSTE, MISSIONS DU POSTE, PROFIL RECHERCHÉ, INFORMATIONS COMPLÉMENTAIRES).
_Avoid_: Annonce (as entity name), offre (without qualifier), posting, publication, Webflow item, pharmacy name as entreprise

**Offre liée**:
A JobOffer whose `missionId` points to a Mission. Publish payload resolves métier, contrat, salaires, ville and geo from that Mission (and its Pharmacy).
_Avoid_: standalone offer, offre libre

**Offre sans mission**:
A JobOffer with no Mission. Métier, ville, geo, contrat, salaires and content live on the JobOffer itself. City must geocode via BAN before save.
_Avoid_: orphan offer, freeform posting

**Sections d'offre**:
The four fixed HTML section titles of a JobOffer description, in order: RÉSUMÉ DU POSTE, MISSIONS DU POSTE, PROFIL RECHERCHÉ, INFORMATIONS COMPLÉMENTAIRES. Produced by a pure renderer from structured AI JSON — never free-form HTML from the model.
_Avoid_: free HTML offer body, Webflow rich text

**PipelineStage**:
An administrable step in the candidate progression on a Mission (e.g. Nouveau → Contacté → Entretien → Proposition → Placé → Pas retenu). Distinct from the Mission's own lifecycle status. « Pas retenu » is the terminal stage for candidates not selected when a Mission is filled.
_Avoid_: Pipeline (alone), étape (without qualifier), statut candidat, phase

**Mission status**:
The lifecycle of a staffing need itself (A_POURVOIR → EN_RECHERCHE → … → POURVU / ANNULEE). Tracked independently from any candidate's PipelineStage on that Mission, and independently from Commercial status.
_Avoid_: Pipeline stage, phase candidat, étape, état commercial (that is Commercial status)

**Devis**:
A commercial quote for a Pharmacy (intérim or CDD/CDI), optionally on a Mission — stored inputs, amounts, send/accept cycle, PDF. Price is free: hours and rate (engine computes HT) or a typed HT total; hours can always be edited; CDD/CDI is a typed forfait, not one month of salary. The current Devis is the last one sent or accepted; a draft never replaces it. Sending retires the previous current Devis, writes a DEVIS Document on the Mission (or on the Pharmacy when there is no Mission), and opens Gmail compose to the Pharmacy Contact. CA stays 0 until the current Devis is accepted. Any role that can write the Mission may create, send, and accept. Distinct from Document and from an ActivityLog line typed DEVIS.
_Avoid_: quote (as UI label), facture, ActivityLog DEVIS (as the quote itself), estimateur rémunération, tarif Medijob (as a locked pack)

**Ligne de suivi**:
A financial line entered from Facturation (Direction / RH-Admin), or imported from Excel Exercice month sheets (source of truth for historical CA — ADR 0035). Pharmacy and Candidate FKs are nullable in DB until linked; CRM UI create still requires both. Excel import always stores raw labels (`pharmacyLabel`, `candidateLabel`, optional `referentLabel`) and a unique `importKey`; source is `ui` or `excel-import`. Auto-link on exact normalized name only; else Direction links by hand. Optional Mission. Kind Placement (CDD/CDI) or Intérim. One Excel month-sheet row = one Ligne: the same deal may produce several lines across months. One Referent User on the line (co-credit → first name). Cancel is reversible status, not soft delete. Placement may book 0 CA (NoGo). Facturé and Encaissé marks do not change CA/Marge. Books CA/Marge on `occurredAt` (Excel import: first day of sheet month). Unlinked imported lines still count in Pilotage. Import creates no Devis. Devis-from-line requires Pharmacy + Candidate linked first. Re-import skips existing `importKey` (no upsert).
_Avoid_: facture, Facture (as entity), invoice, CA candidat (as a follow-up slice), recruteur (as free text), Badakan contract, one hire = one line, stub « À lier » Pharmacy/Candidate

**Encaissé**:
A mark on a Ligne de suivi that the Pharmacy has paid. Independent of Facturé. Does not book CA. Distinct from Commercial status.
_Avoid_: payé, payment, Facturé (that's the invoice-sent mark)

**Objectif**:
Monthly CA and Marge targets by pole (Placement vs Intérim) and a monthly rentability threshold, set in Admin by Direction / RH-Admin. Annual figures in Pilotage are twelve times the monthly ones. Distinct from Commercial status and from Accueil KPIs.
_Avoid_: KPI (that's a count), cap (as entity), cible (unqualified), paramètre (unqualified)

**Accueil**:
The home operational view for all roles — daily pressure KPIs (missions to fill, urgent, Applications inbox, fill rate) and the alert center. Stock-of-the-day, not period-scoped volumes. No CA/Marge. Distinct from Activité and from Pilotage.
_Avoid_: dashboard (unqualified), Tableau de bord, Statistiques, Activité, Pilotage

**Activité**:
The Direction / RH-Admin view of operational **flow** volumes over a civil date range (Europe/Paris): new Candidates by origin (CRM vs App), App-validated, Qualifié transitions, Applications received, CRM Missions created and filled, Badakan missions first-seen and staffed. CRM Mission counts and Badakan mission counts are always shown separately — never summed as one « missions » figure. Soft-deleted rows are excluded. Top-level nav (before Facturation), gated `finance.view`, outside Facturation. No CA/Marge, no vs-previous-period deltas in V1. Distinct from Accueil (daily pressure stock) and from Pilotage (CA/Marge steering).
_Avoid_: Statistiques, Tableau de bord, dashboard, Pilotage, Accueil KPIs, Vue d'ensemble, missions (unqualified total mixing CRM and Badakan)

**Pilotage**:
The Facturation steering view for Direction / RH-Admin — exercice KPIs, objectives by pole, cumulative charts, Go/NoGo, monthly table and commercial matrix. Distinct from Vue d'ensemble (commercial-status counts and Devis pipeline), from Placements (CDD/CDI line list), from Intérim (intérim line list), and from Activité (ops volumes).
_Avoid_: Tableau de bord (ambiguous with Accueil), dashboard, Vue d'ensemble, Suivi (removed as a tab), Activité

**Exercice**:
The Medijob year used in Facturation follow-up: 1 October through 30 September. Named by the two calendar years it spans (25/26 = October 2025 – September 2026). Distinct from a calendar year.
_Avoid_: année civile, année (unqualified), fiscal year (as UI label)

**Placement**:
A Ligne de suivi of kind Placement — a CDD or CDI CA booking in Facturation for a given month (Excel month sheet or CRM create). The same hire may appear as several Placement lines across months when each month books CA. The line carries CDD vs CDI itself (not only via an optional Mission). Distinct from MissionCandidate (operational positioning on a Mission). May be cancelled on the line or booked with zero CA and zero Marge (NoGo).
_Avoid_: matching, affectation, positioning, MissionCandidate (as the financial line), one hire = one Placement line

**NoGo**:
A Placement counted as lost in Pilotage: the line is cancelled, or it has no CA and no Marge. Lost CA is projected from the average billed CA of that type (CDI vs CDD), not from the line amount. Intérim lines are never NoGo. Distinct from Mission status ANNULEE.
_Avoid_: perdu (as entity), annulé (as Mission status), Pas retenu

**Commercial status**:
The commercial lifecycle of a Mission, derived from its current Devis: Sans devis → Envoyé → Accepté → Facturé. Facturé is a mark (with a date) on that Devis — not a separate invoice record, and not the Facturé mark on a Ligne de suivi. Independent from Mission status — a Mission can be EN_RECHERCHE and Envoyé at the same time.
_Avoid_: Mission status, statut devis (as a second Mission enum), pipeline commercial (as entity name), Facture (as entity), Encaissé

**MissionCandidate**:
The positioning of a Candidate on a Mission at a given PipelineStage. A Candidate may be positioned on multiple Missions in parallel, each with its own stage. Only non-terminal positionings appear on the active CVthèque kanban card.
_Avoid_: Matching, affectation, liaison, Placement (that's the financial line)

**Pharmacy**:
The client organization Medijob recruits for — a pharmacy (officine), clinic, or grouped structure. Identified by SIRET, address, LGO, and commercial status. Never a person. A Badakan enterprise with a unique SIRET becomes a Pharmacy automatically (Prospect + primary Contact). Missing or already-used SIRET stays on Intérim officines for correction — never a second Pharmacy.
_Avoid_: Client (ambiguous with Contact), établissement (too generic), officine (too narrow — use when type is INDEPENDANTE)

**Pharmacy status**:
Commercial lifecycle of a Pharmacy: Client / Prospect / Inactif (CSV V1). Filterable across list views.
_Avoid_: Actif (legacy label for Client), ACTIF (as user-facing label)

**Contact**:
A person at a Pharmacy — the human interlocutor for staffing needs and commercial follow-up. Always belongs to exactly one Pharmacy. On Badakan pharmacy verification, the enterprise principal user is offered as a Contact (link by email then phone; no duplicate).
_Avoid_: Client, interlocuteur (as entity name), personne, utilisateur

**Primary contact**:
The designated main Contact for a Pharmacy (`isPrimary`). Soft-deleting a primary Contact is blocked until another Contact on that Pharmacy is designated primary.
_Avoid_: Contact principal (as separate entity), interlocuteur principal (as entity name)

**Contact role**:
An administrable function of a Contact at a Pharmacy (e.g. Titulaire, Comptabilité). Seeded defaults match CSV V1; admins can add, rename, or remove entries like JobTitle.
_Avoid_: ContactRole enum (legacy fixed list), fonction (as free text)

**Referent**:
The Medijob User responsible for follow-up on a Pharmacy, Contact, Candidate, Mission, Ligne de suivi, or AppProfile (App intake follow-up assignee). Optional on those entities — informational and for reporting/filters; visibility and reassignment rights depend on UserRole permissions. CA and Marge of a Mission are attributed to that Mission's Referent. CA and Marge of a Ligne de suivi are attributed to the Referent chosen on that line (one User). No co-credit: a line never counts for two commerciaux.
_Avoid_: Commercial, owner, assignee, ATTRIBUE A, Owner, propriétaire, assigné (implies exclusivity), gestionnaire, opérateur, compte opérateur, recruteur (as a free-text field)

**UserRole**:
One of four internal access roles: Direction, Recruteur, Communication, RH-Admin. Rights are differentiated per module for actions; financial fields (CA, Marge) have separate view rights by role. Operational records are otherwise visible to all roles.
_Avoid_: ADMIN, RECRUTEUR (legacy two-role model), rôle (without qualifier)

**CA / Marge**:
Financial figures shown in the CRM (revenue and margin). Visibility is gated by UserRole — Recruteur and Communication never see them. CA of a Mission is 0 until its current Devis is accepted; the accepted amount is the CA once (never multiplied by mission duration), dated on that acceptance day for follow-up. If the Mission is ANNULEE, CA returns to 0. A Ligne de suivi also books CA and Marge on its date, without an accepted Devis. Marge of a Mission is typed by Direction or RH-Admin; the simulator's margin is indicative only and does not feed follow-up. Marge uses the same acceptance date as CA and also clears on ANNULEE. Follow-up unions Ligne de suivi amounts with Mission Devis CA, except a Mission that has a linked Ligne de suivi contributes only those lines — its Devis CA is not added. An unlinked line never hides a Devis. Follow-up buckets dates into an Exercice (October–September) and slices by Referent, Pharmacy, contract type, and dates — not by Candidate (the Candidate on a Ligne de suivi is identity on the line, not a CA slice).
_Avoid_: chiffre d'affaires (as free UI label without the CA token), rentabilité (as synonym for Marge), marge calculée (as the follow-up figure), CA candidat

**Groupement**:
An administrable pharmacy purchasing network or banner (e.g. Giphar, Alphega). Affiliation is expressed by `groupementId` on a Pharmacy — replaces a separate "groupe" pharmacy type.
_Avoid_: Groupe (as PharmacyType), réseau (without qualifier), chaîne, enseigne

**Software**:
An administrable pharmacy management software (LGO) — e.g. Winpharma, Pharmagest. Declares the LGO used by a Pharmacy and the LGO skills of a Candidate.
_Avoid_: Logiciel (without LGO qualifier), outil, application, programme

**ActivityLog**:
A timestamped record on a domain entity (Candidate, Pharmacy, Contact, or Mission). Includes recruiter interactions (call, email, note…) and automatic system entries on create/update. Polymorphic — each entry belongs to exactly one entity. App intake follow-up edits also append ActivityLog entries on the linked Candidate (in addition to AppProfile fields). Distinct from a Badakan comment (read from the app, not written back).
_Avoid_: Historique (as entity name), timeline, journal, note (as entity name), audit log (as separate entity), commentaire Badakan

**Badakan comment**:
A note on a Badakan recipient (also possible on a mission or enterprise) — typically a call summary written in the app admin. The CRM reads it onto the AppProfile or Candidate fiche. New recruiter notes are ActivityLog; the CRM does not POST comments to Badakan.
_Avoid_: ActivityLog, commentaire (unqualified), historique destinataire

**Document**:
A file attached to a domain entity (Pharmacy, Contact, Mission, or Candidate) — contracts, quotes, invoices, conventions, and Badakan identity files on a Candidate (CNI, RIB, diploma — not the CV). Distinct from a Candidate's source CV (`cvUrl`), which is identity data, not a Document. A sent Devis PDF is a Document on that Mission (category DEVIS); the Pharmacy documents tab also lists those files from the Pharmacy's Missions — one file, not a second copy.
_Avoid_: Fichier, pièce jointe, CV (as Document — use `cvUrl` on Candidate)

**Anonymized dossier**:
A shareable, PII-free presentation of a Candidate for pharmacy clients — six fixed sections (accroche, métier & expérience, compétences & logiciels, mobilité, disponibilité & contrat, points forts) generated by AI in a review modal (Profil or Documents shortcut), editable before PDF export. Empty sections are omitted from the PDF. Full AI regenerate overwrites all sections (with confirm in the modal); the recruiter may edit again afterward. The same PII guard applies on AI generation and on manual save (refuse persist if email, phone, or forbidden identity tokens appear). Distinct from `cvSummary` (internal recruiter notes) and from presentation emails to pharmacies.
_Avoid_: Profil anonymisé (as product name), anonymizedProfile (as UI label), dossier de présentation (without “anonymisé”)

## Bounded contexts

Single-app monolith — contexts are logical boundaries, not separate deployables.

**Candidates** — CVthèque and candidate lifecycle.
Owns: Candidate, Candidate origin, JobTitle reference, `cvUrl`, `cvSummary`, `anonymizedProfile`, CandidateSoftware skills, preferred contract types.
Inbound: Application conversion (from Applications), CV extraction (from AI), App-validated Badakan sync (origin App).
Outbound: referenced by Pipeline (MissionCandidate), Missions (matching).

**Pharmacies** — client organization portfolio.
Owns: Pharmacy, commercial status, SIRET identity, LGO (`softwareId`), network affiliation (`groupementId`).
Inbound: unique-SIRET Badakan enterprises auto-create a Pharmacy; missing or duplicate SIRET stays on Intérim officines for correction (never a second file).
Outbound: Contacts (children), Missions (staffing needs), ActivityLog, Document.

**Contacts** — human interlocutors at pharmacies.
Owns: Contact, ContactRole, `isPrimary` designation.
Inbound: always belongs to one Pharmacy; optional create/link from Badakan principal user at pharmacy verification.
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

**AppProfiles** — Badakan app registration inbox, surfaced as Intérim **App intake follow-up** (UI: « Entrées app » `/interim/entrees-app`; replaces "Profils app").
Owns: AppProfile, Intake booking SMS (unchanged), Intake status, Call outcome, planned RDV date, intake notes, Referent on AppProfile, auto last-call stamp, relance date, Ignore (archive), periodic sync from Badakan `searchNewEmployees`.
Inbound: Badakan API (read-only), including Badakan comments on CREATED recipients.
Outbound: No recruiter ACCEPTE. When the recipient becomes App-validated, they leave the default follow-up view; Candidate write is owned by the Intérim context. Ignore and negative outcomes also leave the default view. Never the Intérim positioning filter.

**Intérim (operational)** — App-validated Candidates, weekly availability, Badakan read model.
Owns: Weekly availability; App-validated sync that creates or links a Candidate with origin App; read of Badakan missions, pharmacies, comments, `SEARCH_APPLIED` applicants, and Badakan contracts (sign-invite SMS + pharmacy email 231 on new `CREATED`); pharmacy apply email (Brevo 232) on first `SEARCH_APPLIED`.
Inbound: Badakan API, same periodic cycle as AppProfiles (no manual refresh control required).
Outbound: Candidate create or link (origin App). Unique-SIRET Badakan enterprise auto-creates a Pharmacy; missing or duplicate SIRET is corrected on Intérim officines. **V1 never writes to Badakan** (no staff, validate, PUT, POST comments, or contract writes). Never turns a Badakan mission into a Mission. Distinct from Finance « Intérim » (Lignes de suivi) and from AppProfiles inbox.

**Interviews** — structured qualification conversations replacing medijob-eval.
Owns: Interview, InterviewTemplate (versioned trames).
Inbound: Candidate ID, optional Referent (User). JobTitle `profileKey` selects the trame.
Outbound: later write-back to Candidate at close. Never a PipelineStage and never an Application.

**Finance** — commercial quotes and performance follow-up.
Owns: Devis, Ligne de suivi, Commercial status (derived), CA and Marge on the Mission and on Lignes de suivi, Objectif.
Inbound: Mission (optional on a Ligne de suivi), Pharmacy and Candidate (optional until linked — required for Devis-from-line), Referent.
Outbound: Mission — where Recruteur / Communication create, send, and accept a Devis. Facturation (Vue d'ensemble, Pilotage, Placements, Intérim) is Direction / RH-Admin only. Never a candidate salary estimator.

**AI** — assisted extraction, generation, and matching.
Owns: provider abstraction, Zod-validated AI responses, assistant chat.
Cross-cutting: reads Candidates, Pharmacies, Missions; writes derived fields (cvSummary, JobOffer content, matching scores). Never owns domain entities. The assistant chat interlocutor is always the MediJob recruiter — Candidates, Contacts, and Pharmacies are spoken about in the third person; draft-to-candidate tone is reserved for the explicit candidate-email shortcut. Free-chat turns include a short sliding window of prior messages (UI-session only, not persisted). Changing or clearing the entity context starts a fresh conversation.

**Auth** — internal users and access.
Owns: User, UserRole (Direction | Recruteur | Communication | RH-Admin), sessions.
Provides: Referent identity for Pharmacies, Contacts, Candidates, and Missions. Referential admin (JobTitle, Pipeline, etc.) and module actions are gated by UserRole permissions.

### Cross-cutting

**Soft delete**:
Marking a record as deleted without physical removal. The only deletion mechanism in the CRM UI. Soft-deleted records are hidden from all users — no restore UI in V2 (script only). Cancelling a Ligne de suivi is a reversible status, not a soft delete.
_Avoid_: Suppression définitive, purge (in UI context), archivage, corbeille, Annuler (on a Ligne de suivi — that is cancel status)

**ActivityLog** and **Document** are polymorphic records spanning Candidates, Pharmacies, Contacts, and Missions — not standalone contexts. Each entry belongs to exactly one entity in one of those four contexts.
