-- AlterTable
ALTER TABLE "BadakanContract" ADD COLUMN "enterpriseId" TEXT;
ALTER TABLE "BadakanContract" ADD COLUMN "signInviteEmailSentAt" TIMESTAMP(3);

CREATE INDEX "BadakanContract_enterpriseId_idx" ON "BadakanContract"("enterpriseId");

-- Existing CREATED contracts already went out; stamp email clock without sending.
UPDATE "BadakanContract"
SET "signInviteEmailSentAt" = CURRENT_TIMESTAMP
WHERE "status" = 'CREATED';
