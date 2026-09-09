import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import { toAppOriginCreateData } from './candidate-app-origin-create'
import { toMarkAppValidatedData } from './candidate-app-origin-validated'
import {
  APP_LINKED_SELECT,
  type AppIdentityPatch,
  type AppOriginCreateInput,
} from './candidate-app-origin.types'

export type { AppIdentityPatch, AppOriginCreateInput }

export function makeCandidateAppOriginRepository(db: PrismaClient) {
  return {
    findByBadakanId: async (badakanId: string) => {
      const row = await db.candidate.findFirst({
        where: { badakanId, ...NOT_DELETED },
        select: APP_LINKED_SELECT,
      })
      if (!row) return null
      const { jobTitle, ...rest } = row
      return { ...rest, jobTitleName: jobTitle?.name ?? null }
    },
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
    unlinkAppOrigin: (id: string) =>
      db.candidate.update({
        where: { id },
        data: { origin: 'CRM', badakanId: null },
        select: { id: true },
      }),
    markBadakanValidated: (id: string) =>
      db.candidate.update({
        where: { id },
        data: toMarkAppValidatedData(),
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
