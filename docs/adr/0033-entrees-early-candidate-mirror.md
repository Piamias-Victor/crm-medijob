# App intake follow-up creates Candidate early; App-validated exits the file

Supersedes the prior rule that Entrées app had no Candidate until Badakan App-validated.

**Decision:** On Badakan sync convert, create or link a Candidate (origin App) as soon as identity/job title resolve — even when `isValid` is false. Keep AppProfile `EN_ATTENTE` in Entrées app until Badakan reports `isValid` / App-validated. Intake table edits mirror onto the Candidate (Referent + ActivityLog). Negative exits / Ignore soft-hide the Candidate from the default CVthèque list. Syncro one-shot import: admin script `apps/web/scripts/import-syncro-entrees.ts` maps sheet CANDIDATS → AppProfile ops + early Candidate (`--apply` to write; default dry-run).

**Rejected:** Waiting for App-validated before any fiche (blocked Matthieu’s “teams work from sheet + fiche” flow); marking `APP_VALIDATED` on first convert without `isValid` (emptied À traiter too early).
