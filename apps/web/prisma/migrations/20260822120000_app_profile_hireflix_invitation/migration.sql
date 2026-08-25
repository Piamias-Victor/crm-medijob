-- AlterTable
ALTER TABLE "AppProfile" ADD COLUMN "hireflixInterviewId" TEXT;
ALTER TABLE "AppProfile" ADD COLUMN "hireflixUrl" TEXT;
ALTER TABLE "AppProfile" ADD COLUMN "inviteEmailSentAt" TIMESTAMP(3);
ALTER TABLE "AppProfile" ADD COLUMN "inviteLastError" TEXT;

-- CreateIndex
CREATE INDEX "AppProfile_status_inviteEmailSentAt_idx" ON "AppProfile"("status", "inviteEmailSentAt");
