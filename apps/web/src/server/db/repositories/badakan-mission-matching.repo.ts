import type { PrismaClient } from '@prisma/client'
import { parseBadakanMissionPeriods } from '@/view-models/badakan-mission-periods'
import type { BadakanMatchingSource } from '@/view-models/badakan-matching-map'

export function makeBadakanMissionMatchingRepository(db: PrismaClient) {
  return {
    findForMatching: async (id: string): Promise<BadakanMatchingSource | null> => {
      const row = await db.badakanMission.findUnique({
        where: { id },
        select: {
          pharmacyName: true,
          city: true,
          postalCode: true,
          activityLabel: true,
          jobTitleId: true,
          periods: true,
          jobTitle: { select: { name: true } },
          software: { select: { name: true } },
        },
      })
      if (!row) return null
      return {
        jobTitleId: row.jobTitleId,
        jobTitleName: row.jobTitle?.name ?? null,
        pharmacyName: row.pharmacyName,
        city: row.city,
        postalCode: row.postalCode,
        softwareName: row.software?.name ?? null,
        activityLabel: row.activityLabel,
        periods: parseBadakanMissionPeriods(row.periods),
      }
    },
  }
}
