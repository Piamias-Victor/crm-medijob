# Badakan missions are not CRM Missions

Badakan shifts (pharmacy, periods, `SEARCH_APPLIED` applicants) are shown in the Intérim module as their own list. They are not created as CRM Missions and do not enter the kanban or PipelineStage. Importing them as Missions was rejected: it would mix app applicant steps with recruiter positioning and drown the operational kanban. Showing them only on the candidate fiche was rejected: the recruiter needs “who applied to this pharmacy” as a mission-first view. Pharmacy identity still matches CRM Pharmacy by SIRET.
