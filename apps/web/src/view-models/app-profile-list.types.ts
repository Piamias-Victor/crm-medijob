import type { AppCallOutcome, AppProfileStatus, CandidateStatus } from '@prisma/client'

export type AppProfileListItem = {
  id: string
  badakanId: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  activityLabel: string | null
  jobTitleId: string | null
  jobTitleName: string | null
  hasResume: boolean
  status: AppProfileStatus
  intakeStatus: string
  intakeStatusName: string
  intakeStatusColor: string
  callOutcome: AppCallOutcome | null
  plannedRdvAt: Date | null
  notes: string | null
  referentId: string | null
  referentName: string | null
  relanceAt: Date | null
  isRelanceOverdue: boolean
  lastCalledAt: Date | null
  lastCalledByName: string | null
  candidateId: string | null
  candidateStatus: CandidateStatus | null
  invitationLabel: string
  intakeBookingSmsLabel: string
  badakanCommentsLabel: string
  syncedAt: Date
  createdAt: Date
}
