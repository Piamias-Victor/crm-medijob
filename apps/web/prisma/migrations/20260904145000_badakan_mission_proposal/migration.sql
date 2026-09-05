-- CreateEnum
CREATE TYPE "BadakanProposalStatus" AS ENUM ('PROPOSE', 'VALIDE', 'REFUSE');

-- CreateTable
CREATE TABLE "BadakanMissionProposal" (
    "id" TEXT NOT NULL,
    "badakanMissionId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "status" "BadakanProposalStatus" NOT NULL DEFAULT 'PROPOSE',
    "score" INTEGER,
    "justification" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BadakanMissionProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BadakanMissionProposal_badakanMissionId_idx" ON "BadakanMissionProposal"("badakanMissionId");

-- CreateIndex
CREATE INDEX "BadakanMissionProposal_candidateId_idx" ON "BadakanMissionProposal"("candidateId");

-- CreateIndex
CREATE INDEX "BadakanMissionProposal_status_idx" ON "BadakanMissionProposal"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BadakanMissionProposal_badakanMissionId_candidateId_key" ON "BadakanMissionProposal"("badakanMissionId", "candidateId");

-- AddForeignKey
ALTER TABLE "BadakanMissionProposal" ADD CONSTRAINT "BadakanMissionProposal_badakanMissionId_fkey" FOREIGN KEY ("badakanMissionId") REFERENCES "BadakanMission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadakanMissionProposal" ADD CONSTRAINT "BadakanMissionProposal_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
