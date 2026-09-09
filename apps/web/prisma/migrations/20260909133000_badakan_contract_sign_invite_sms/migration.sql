-- AlterTable
ALTER TABLE "BadakanContract" ADD COLUMN "recipientId" TEXT;
ALTER TABLE "BadakanContract" ADD COLUMN "signInviteSmsSentAt" TIMESTAMP(3);
ALTER TABLE "BadakanContract" ADD COLUMN "signInviteReminderSentAt" TIMESTAMP(3);

CREATE INDEX "BadakanContract_recipientId_idx" ON "BadakanContract"("recipientId");
CREATE INDEX "BadakanContract_signInviteSmsSentAt_idx" ON "BadakanContract"("signInviteSmsSentAt");

-- Existing CREATED contracts are already past the email; stamp both SMS clocks without sending.
UPDATE "BadakanContract"
SET "signInviteSmsSentAt" = CURRENT_TIMESTAMP,
    "signInviteReminderSentAt" = CURRENT_TIMESTAMP
WHERE "status" = 'CREATED';
