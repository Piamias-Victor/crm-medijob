import type { Prisma } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'

export type { CandidateProfileUpdate } from '@/view-models/candidate-profile-update'

export const candidateProfileInclude = {
  jobTitle: { select: { id: true, name: true } },
  referent: { select: { id: true, name: true } },
  softwares: { select: { softwareId: true } },
  contractPreferences: { select: { contractType: true } },
  missions: {
    take: DEFAULT_LIST_LIMIT,
    select: {
      stage: { select: { id: true, name: true, position: true } },
      mission: { select: { id: true, title: true, status: true } },
    },
    orderBy: { mission: { title: 'asc' as const } },
  },
} satisfies Prisma.CandidateInclude
