# App-validated sync creates a Candidate with origin App

When Badakan reports `valid` / `COMPLETED`, the CRM creates or links a **Candidate** marked origin App and the person leaves the Profils app inbox. Recruiter ACCEPTE from Profils app is not the Intérim path. Origin App is not Candidate status Qualifié (that still means CRM Interview). A **new** App-origin Candidate starts at **Nouveau**. If Badakan later reports `SUSPENDED` or `BANNED`, the Candidate becomes **Inactif** and leaves the weekly-availability filter and the availability SMS. That is not Blacklisté (a MediJob decision). If Badakan restores `COMPLETED`, status returns to what it was before Inactif and they re-enter the filter; no second automatic SMS (the secret URL still works).

Link existing Candidates by email, then phone — do not create a duplicate. Candidate status is not downgraded on link (Qualifié stays Qualifié).

On later syncs, non-empty Badakan values win for identity, address, phone, email, and job. Interview-mapped CRM fields (salary, software, mobility, Availability, notes) are not overwritten. An empty Badakan value never clears CRM. App-validated sync also copies Badakan files and identity/bank fields onto the Candidate fiche (CV as `cvUrl`; CNI, RIB, diploma as Documents). They are not matching criteria.

A parallel InterimProfile person entity was rejected: the staffable pool is the CVthèque, with a mark that they come from the app. Weekly availability and Intérim filters still apply only to App-validated / origin-App Candidates. Finance tab « Intérim » remains Lignes de suivi.
