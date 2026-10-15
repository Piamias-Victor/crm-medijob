-- Free unique badakanId on soft-deleted candidates so cron convert can relink.
UPDATE "Candidate"
SET "badakanId" = NULL
WHERE "deletedAt" IS NOT NULL AND "badakanId" IS NOT NULL;
