import type { Prisma } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'

export type { CandidateProfileUpdate } from '@/view-models/candidate-profile-update'

export const candidateProfileInclude = {
  jobTitle: { select: { id: true, name: true } },
  referent: { select: { id: true, name: true } },
  softwares: { select: { softwareId: true, software: { select: { name: true } } } },
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

export const candidateDocumentsInclude = {
  jobTitle: { select: { name: true } },
  softwares: { select: { software: { select: { name: true } } } },
} satisfies Prisma.CandidateInclude
