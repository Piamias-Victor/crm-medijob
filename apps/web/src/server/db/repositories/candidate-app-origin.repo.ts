import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import { toAppOriginCreateData } from './candidate-app-origin-create'

export type AppIdentityPatch = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  jobTitleId?: string
  cvUrl?: string
  nir?: string
  iban?: string
}

export type AppOriginCreateInput = {
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  jobTitleId: string
  origin: 'APP'
  status: 'NOUVEAU'
  badakanId: string
  notes?: string
  availableFrom?: Date
  mobilityRadiusKm?: number
  mobilityNotes?: string
  softwareIds?: string[]
}

export function makeCandidateAppOriginRepository(db: PrismaClient) {
  return {
    findByBadakanId: (badakanId: string) =>
      db.candidate.findFirst({
        where: { badakanId, ...NOT_DELETED },
        select: { id: true, status: true, statusBeforeInactive: true },
      }),
    createAppCandidate: (data: AppOriginCreateInput) =>
      db.candidate.create({
        data: toAppOriginCreateData(data),
        select: { id: true },
      }),
    linkAppOrigin: (id: string, badakanId: string) =>
      db.candidate.update({
        where: { id },
        data: { origin: 'APP', badakanId },
        select: { id: true },
      }),
    patchAppIdentity: (id: string, patch: AppIdentityPatch) =>
      db.candidate.update({
        where: { id },
        data: patch,
        select: { id: true },
      }),
    findDossierState: async (id: string) => {
      const row = await db.candidate.findFirst({
        where: { id, ...NOT_DELETED },
        select: { cvUrl: true, documents: { select: { category: true } } },
      })
      return {
        cvUrl: row?.cvUrl ?? null,
        categories: row?.documents.map((d) => d.category) ?? [],
      }
    },
  }
}
