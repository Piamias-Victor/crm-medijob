import type { ContractType, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import type { ManualCandidateStatus } from '@/view-models/candidate-status'

export type InterviewCandidatePatch = {
  availableFrom?: Date | null
  mobilityRadiusKm?: number
  salaryExpectations?: string
  notes?: string
  status?: ManualCandidateStatus
  softwareIds?: string[]
  contractTypes?: ContractType[]
}

export function makeInterviewCandidatePatchRepository(db: PrismaClient) {
  return {
    applyInterviewPatch: async (id: string, patch: InterviewCandidatePatch) => {
      const data = {
        ...(patch.availableFrom !== undefined ? { availableFrom: patch.availableFrom } : {}),
        ...(patch.mobilityRadiusKm !== undefined ? { mobilityRadiusKm: patch.mobilityRadiusKm } : {}),
        ...(patch.salaryExpectations !== undefined
          ? { salaryExpectations: patch.salaryExpectations }
          : {}),
        ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
        ...(patch.status ? { status: patch.status } : {}),
      }
      await db.$transaction(async (tx) => {
        if (Object.keys(data).length) await tx.candidate.update({ where: { id }, data })
        if (patch.softwareIds) {
          await tx.candidateSoftware.deleteMany({ where: { candidateId: id } })
          await tx.candidateSoftware.createMany({
            data: patch.softwareIds.map((softwareId) => ({ candidateId: id, softwareId })),
          })
        }
        if (patch.contractTypes) {
          await tx.candidateContractPreference.deleteMany({ where: { candidateId: id } })
          await tx.candidateContractPreference.createMany({
            data: patch.contractTypes.map((contractType) => ({ candidateId: id, contractType })),
          })
        }
      })
      return db.candidate.findFirst({ where: { id, ...NOT_DELETED } })
    },
  }
}

export const interviewCandidatePatchRepository = makeInterviewCandidatePatchRepository(defaultDb)
