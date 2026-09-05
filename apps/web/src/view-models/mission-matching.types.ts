import type { ExclusionReasonCode } from '@/server/matching/exclusion-reasons'

export type MissionMatchingReason = { code: ExclusionReasonCode; label: string }

export type MissionMatchingScoredRow = {
  candidateId: string
  fullName: string
  jobTitle: string
  city: string | null
  email: string | null
  phone: string | null
  salaryLabel: string | null
  score: number
  justification: string
  isProfileIncomplete: boolean
  missingMatchingFields: string[]
}

export type MissionMatchingExcludedRow = {
  candidateId: string
  fullName: string
  jobTitle: string
  city: string | null
  reasons: MissionMatchingReason[]
  isProfileIncomplete: boolean
  missingMatchingFields: string[]
}

export type MissionMatchingPayload = {
  scored: MissionMatchingScoredRow[]
  excluded: MissionMatchingExcludedRow[]
  eligibleCount: number
  excludedCount: number
}
