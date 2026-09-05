import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import { ymdToUtcDate } from './ymd-date'
import {
  candidateMatchingSelect,
  type CandidateMatchingRow,
} from './candidate-matching.select'

export function makeCandidateDeclaredMatchingRepository(db: PrismaClient) {
  return {
    listWithDeclaredSlots: (range: {
      from: string
      to: string
    }): Promise<CandidateMatchingRow[]> =>
      db.candidate.findMany({
        where: {
          ...NOT_DELETED,
          status: { not: 'INACTIF' },
          weeklyAvailabilityWeeks: {
            some: {
              slots: {
                some: {
                  date: { gte: ymdToUtcDate(range.from), lte: ymdToUtcDate(range.to) },
                },
              },
            },
          },
        },
        select: candidateMatchingSelect,
      }),
  }
}
