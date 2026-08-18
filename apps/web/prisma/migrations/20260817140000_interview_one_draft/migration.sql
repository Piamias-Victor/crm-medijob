-- One DRAFT Interview per Candidate (soft-deleted drafts do not count).
CREATE UNIQUE INDEX "Interview_one_draft_per_candidate"
ON "Interview" ("candidateId")
WHERE status = 'DRAFT' AND "deletedAt" IS NULL;
