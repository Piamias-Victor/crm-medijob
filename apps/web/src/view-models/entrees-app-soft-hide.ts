import type { Prisma } from '@prisma/client'

/** Soft-hide CVthèque when Entrées app archived (Ignore / négatif / hors zone). */
export function entreesAppSoftHideWhere(): Prisma.CandidateWhereInput {
  return {
    NOT: {
      appProfiles: {
        some: {
          OR: [
            { status: 'IGNORE' },
            { callOutcome: { in: ['PAS_INTERESSE', 'HORS_CIBLE'] } },
            { intakeStatus: 'HORS_ZONE' },
          ],
        },
      },
    },
  }
}
