-- AlterTable
ALTER TABLE "AppProfile" ADD COLUMN "calendarSmsSentAt" TIMESTAMP(3);

-- Existing inbox + CVthèque profiles: treat calendar SMS as already sent.
UPDATE "AppProfile" SET "calendarSmsSentAt" = CURRENT_TIMESTAMP;
