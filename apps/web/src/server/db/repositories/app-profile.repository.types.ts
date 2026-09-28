import type { AppCallOutcome, AppIntakeStatus, Prisma } from '@prisma/client'

export const appProfileJobTitleInclude = {
  jobTitle: { select: { id: true, name: true } },
  referent: { select: { id: true, name: true } },
  lastCalledBy: { select: { id: true, name: true } },
  candidate: { select: { status: true } },
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
  relanceAt?: Date
  /** Syncro one-shot: stamp invite/SMS so cron never mails/SMS this row. */
  muteOutbound?: boolean
}

export type AppProfileIntakeUpdate = {
  intakeStatus: AppIntakeStatus
  callOutcome: AppCallOutcome | null
  plannedRdvAt: Date | null
  notes: string | null
  referentId: string | null
  relanceAt: Date | null
  lastCalledAt?: Date
  lastCalledById?: string
}

export type ListIntakeFollowUpOpts = {
  limit?: number
  referentScope?: 'mine' | 'all'
  population?: 'default' | 'archive'
  currentUserId?: string
}

