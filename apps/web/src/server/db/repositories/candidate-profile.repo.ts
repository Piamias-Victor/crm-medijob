import type { PrismaClient } from '@prisma/client'
import { decideEventStamp, QUALIFIE_TARGETS } from '@/view-models/activite-event-stamp'
import { NOT_DELETED } from './soft-delete'
import {
  candidateProfileInclude,
  candidateDocumentsInclude,
  type CandidateProfileUpdate,
} from './candidate-profile.repository'
import { toCandidateProfileUpdateData } from './candidate-profile-write'

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
        data: toCandidateProfileUpdateData(data),
        select: { id: true },
      }),
    updateProfile: async (id: string, data: CandidateProfileUpdate, now = new Date()) => {
      const previous = await db.candidate.findFirst({
        where: { id, ...NOT_DELETED },
        select: { status: true, qualifiedAt: true },
      })
      const qualifiedAt = decideEventStamp({
        previous: previous?.status,
        next: data.status ?? 'NOUVEAU',
        targets: QUALIFIE_TARGETS,
        existing: previous?.qualifiedAt,
        now,
      })
      await db.$transaction([
        db.candidateSoftware.deleteMany({ where: { candidateId: id } }),
        db.candidateContractPreference.deleteMany({ where: { candidateId: id } }),
        db.candidate.update({
          where: { id },
          data: { ...toCandidateProfileUpdateData(data), qualifiedAt },
        }),
      ])
      return db.candidate.findFirst({
        where: { id, ...NOT_DELETED },
        include: candidateProfileInclude,
      })
    },
  }
}

export type { CandidateProfileUpdate } from './candidate-profile.repository'
