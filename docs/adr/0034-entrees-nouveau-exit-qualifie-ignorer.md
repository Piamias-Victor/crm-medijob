# Entrées app stays while Candidate is Nouveau; exit via Qualifié / Ignorer

Supersedes ADR-0033’s rule that Badakan App-validated removes a row from the default Entrées app list.

**Decision:** Default Entrées app (`listIntakeFollowUp` population `default`) shows AppProfiles that are not `IGNORE` and whose linked Candidate is still `NOUVEAU` (or not yet linked). Badakan `APP_VALIDATED` alone does **not** leave the file. Recruiter row actions: **✗** → AppProfile `IGNORE` + Candidate `INACTIF` (remember previous status); **✓** → Candidate `QUALIFIE`. Both remove the row from the default view. Ops fields (Intake status, Call outcome, etc.) stay editable while Nouveau.

**Rejected:** Keeping App-validated as the Entrées exit gate (left recruiters with almost-empty À traiter while Syncro/Badakan bulk-validated); exiting only via ops negatives without Candidate status change.
