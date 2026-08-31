-- CreateEnum
CREATE TYPE "CandidateOrigin" AS ENUM ('CRM', 'APP');

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN "origin" "CandidateOrigin" NOT NULL DEFAULT 'CRM';
ALTER TABLE "Candidate" ADD COLUMN "badakanId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_badakanId_key" ON "Candidate"("badakanId");
CREATE INDEX "Candidate_origin_idx" ON "Candidate"("origin");
