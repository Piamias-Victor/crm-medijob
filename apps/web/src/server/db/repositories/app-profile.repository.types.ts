import type { AppCallOutcome, AppIntakeStatus, Prisma } from '@prisma/client'

export const appProfileJobTitleInclude = {
  jobTitle: { select: { id: true, name: true } },
} as const

export type AppProfileUpsertInput = {
  badakanId: string
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  postalCode?: string | null
  activityLabel?: string | null
  jobTitleId?: string | null
  hasResume?: boolean
  snapshot?: Prisma.InputJsonValue
}

export type AppProfileIntakeUpdate = {
  intakeStatus: AppIntakeStatus
  callOutcome: AppCallOutcome | null
  plannedRdvAt: Date | null
  notes: string | null
}
