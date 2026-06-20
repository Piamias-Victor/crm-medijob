import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import {
  candidateProfileInclude,
  candidateDocumentsInclude,
  type CandidateProfileUpdate,
} from './candidate-profile.repository'

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
    updateProfile: async (id: string, data: CandidateProfileUpdate) => {
      await db.$transaction([
        db.candidateSoftware.deleteMany({ where: { candidateId: id } }),
        db.candidateContractPreference.deleteMany({ where: { candidateId: id } }),
        db.candidate.update({
          where: { id },
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email ?? null,
            phone: data.phone ?? null,
            address: data.address ?? null,
            city: data.city ?? null,
            postalCode: data.postalCode ?? null,
            jobTitleId: data.jobTitleId,
            mobilityRadiusKm: data.mobilityRadiusKm,
            mobilityNotes: data.mobilityNotes ?? null,
            availableFrom: data.availableFrom ?? null,
            notes: data.notes ?? null,
            referentId: data.referentId,
            ...(data.cvUrl ? { cvUrl: data.cvUrl } : {}),
            softwares: { create: data.softwareIds.map((softwareId) => ({ softwareId })) },
            contractPreferences: {
              create: data.contractTypes.map((contractType) => ({ contractType })),
            },
          },
        }),
      ])
      return db.candidate.findFirst({ where: { id, ...NOT_DELETED }, include: candidateProfileInclude })
    },
  }
}

export type { CandidateProfileUpdate } from './candidate-profile.repository'
