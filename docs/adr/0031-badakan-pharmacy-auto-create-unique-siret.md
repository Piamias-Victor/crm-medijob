# Badakan enterprises become pharmacies when SIRET is unique

A Badakan enterprise with a present SIRET that no CRM Pharmacy already uses is created automatically on the catalog cron (Prospect + primary Contact from the principal, same merge rules as the verification screen).

If the SIRET is missing, or already belongs to a Pharmacy, the row stays on `/interim/officines`. The list shows the blocking reason in French. The recruiter corrects the SIRET or links to the existing file — never a second Pharmacy for the same SIRET.

Auto-creating every enterprise without that check was still rejected (dirty duplicates). Human verification of every clean SIRET was rejected: too slow once the catalog is complete.

Supersedes [ADR 0028](0028-badakan-pharmacy-verified-import.md).
