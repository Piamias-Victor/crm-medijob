import type { Prisma, PrismaClient } from '@prisma/client'
import { toCandidateProfileUpdateData } from './candidate-profile-write'
import type { CandidateProfileUpdate } from './candidate-profile.repository'
import { assertMergeCandidatesValid } from '@/server/candidate/validate-merge-candidates'

type Tx = Prisma.TransactionClient

async function transferMissionCandidates(tx: Tx, keptId: string, absorbedId: string) {
  const rows = await tx.missionCandidate.findMany({ where: { candidateId: absorbedId } })
  if (rows.length === 0) return

  const keptRows = await tx.missionCandidate.findMany({
    where: { candidateId: keptId, missionId: { in: rows.map((row) => row.missionId) } },
  })
  const keptMissionIds = new Set(keptRows.map((row) => row.missionId))

  for (const row of rows) {
    if (keptMissionIds.has(row.missionId)) {
      await tx.missionCandidate.delete({
        where: { missionId_candidateId: { missionId: row.missionId, candidateId: absorbedId } },
      })
      continue
    }
    await tx.missionCandidate.update({
      where: { missionId_candidateId: { missionId: row.missionId, candidateId: absorbedId } },
      data: { candidateId: keptId },
    })
  }
}

async function transferRelations(tx: Tx, keptId: string, absorbedId: string) {
  await transferMissionCandidates(tx, keptId, absorbedId)
  await tx.activityLog.updateMany({ where: { candidateId: absorbedId }, data: { candidateId: keptId } })
  await tx.document.updateMany({ where: { candidateId: absorbedId }, data: { candidateId: keptId } })
  await tx.application.updateMany({ where: { candidateId: absorbedId }, data: { candidateId: keptId } })
}

export function makeCandidateMergeRepository(db: PrismaClient) {
  return {
    merge: async (keptId: string, absorbedId: string | undefined, data: CandidateProfileUpdate) => {
      await db.$transaction(async (tx) => {
        await assertMergeCandidatesValid(tx, keptId, absorbedId)
        if (absorbedId) {
          await transferRelations(tx, keptId, absorbedId)
          await tx.candidate.update({ where: { id: absorbedId }, data: { deletedAt: new Date() } })
        }
        await tx.candidateSoftware.deleteMany({ where: { candidateId: keptId } })
        await tx.candidateContractPreference.deleteMany({ where: { candidateId: keptId } })
        await tx.candidate.update({ where: { id: keptId }, data: toCandidateProfileUpdateData(data) })
      })
      return { id: keptId }
    },
  }
}
