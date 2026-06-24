import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import {
  candidateProfileInclude,
  candidateDocumentsInclude,
  type CandidateProfileUpdate,
} from './candidate-profile.repository'
import {
  toCandidateProfileUpdateData,
  toCandidateProfileWriteData,
} from './candidate-profile-write'

export function makeCandidateProfileRepository(db: PrismaClient) {
  return {
    findProfileById: (id: string) =>
      db.candidate.findFirst({ where: { id, ...NOT_DELETED }, include: candidateProfileInclude }),
    findDocumentsProfile: (id: string) =>
      db.candidate.findFirst({ where: { id, ...NOT_DELETED }, include: candidateDocumentsInclude }),
    updateDerivedFields: (id: string, fields: { cvSummary?: string; anonymizedProfile?: string }) =>
      db.candidate.update({
        where: { id },
        data: fields,
        include: candidateDocumentsInclude,
      }),
    createProfile: (data: CandidateProfileUpdate) =>
      db.candidate.create({
        data: toCandidateProfileWriteData(data),
        select: { id: true },
      }),
    updateProfile: async (id: string, data: CandidateProfileUpdate) => {
      await db.$transaction([
        db.candidateSoftware.deleteMany({ where: { candidateId: id } }),
        db.candidateContractPreference.deleteMany({ where: { candidateId: id } }),
        db.candidate.update({ where: { id }, data: toCandidateProfileUpdateData(data) }),
      ])
      return db.candidate.findFirst({ where: { id, ...NOT_DELETED }, include: candidateProfileInclude })
    },
  }
}

export type { CandidateProfileUpdate } from './candidate-profile.repository'
