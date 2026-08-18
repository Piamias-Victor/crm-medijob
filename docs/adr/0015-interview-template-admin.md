# Published InterviewTemplate versions, admin working copy, explicit close mapping

RH-Admin must change trames without a deploy, without rewriting a Recruteur’s in-progress Interview, and without `db:seed` wiping published content. Live edit of the latest template would change a DRAFT mid-call; wording-based close mapping breaks when a question is rephrased.

Decision: an Interview pins the **published** InterviewTemplate version chosen at start and keeps it through DRAFT. Direction and RH-Admin edit a **working copy**, then **publish** (new version; only new Interviews pick it up). Seeds insert a profileKey × mode only if missing. Close mapping is an **explicit kind** on the question (at most one per kind per template), not inferred from French wording. Archive a template pair rather than hard-delete; generic stays as fallback.

Considered: live overwrite (rejected — unsafe during a call); seed always upserts (rejected — admin edits would not stick); mapping inferred from question text (rejected — editor would silently break fiche write-back).
