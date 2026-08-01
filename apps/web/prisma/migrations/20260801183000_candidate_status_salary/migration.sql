-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM (
  'NOUVEAU',
  'A_QUALIFIER',
  'QUALIFIE',
  'EN_MISSION',
  'INACTIF',
  'BLACKLISTE'
);

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN "status" "CandidateStatus" NOT NULL DEFAULT 'NOUVEAU';
ALTER TABLE "Candidate" ADD COLUMN "salaryExpectations" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "salaryMin" INTEGER;
ALTER TABLE "Candidate" ADD COLUMN "salaryMax" INTEGER;

-- CreateIndex
CREATE INDEX "Candidate_status_idx" ON "Candidate"("status");
