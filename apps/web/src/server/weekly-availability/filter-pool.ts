import type { CandidateOrigin, CandidateStatus } from '@prisma/client'
import type { AmPm } from './types'

export type AvailabilityFilterSlot = {
  date: string
  period: AmPm
}

export type AvailabilityFilterPoolRow = {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  city: string | null
  postalCode: string | null
  jobTitleName: string
}

export type AvailabilityFilterSeed = AvailabilityFilterPoolRow & {
  jobTitleId: string
  origin: CandidateOrigin
  status: CandidateStatus
  slots: AvailabilityFilterSlot[]
}

export type WeeklyAvailabilityFilterStore = {
  listBySlot: (input: {
    date: string
    period: AmPm
    jobTitleId: string
  }) => Promise<AvailabilityFilterPoolRow[]>
}

export type DeclaredAvailabilityPoolRow = AvailabilityFilterPoolRow & {
  jobTitleId: string
  slots: AvailabilityFilterSlot[]
}

export type DeclaredAvailabilityQuery = {
  from: string
  dateTo?: string
  period?: AmPm
  jobTitleIds?: string[]
  /** Default: only candidates with at least one slot (`yes`). */
  hasDispo?: 'all' | 'yes' | 'no'
}

export type WeeklyAvailabilityDeclaredStore = {
  listDeclared: (query: DeclaredAvailabilityQuery) => Promise<DeclaredAvailabilityPoolRow[]>
}
