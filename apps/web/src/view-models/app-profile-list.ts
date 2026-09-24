import { appProfileInvitationLabel } from './app-profile-invitation'
import type { AppProfileListItem } from './app-profile-list.types'
import type { AppCallOutcome, AppIntakeStatus, AppProfileStatus } from '@prisma/client'

export type { AppProfileListItem }

export function toAppProfileListItem(row: {
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
  hasResume: boolean
  status: AppProfileStatus
  intakeStatus?: AppIntakeStatus | null
  callOutcome?: AppCallOutcome | null
  plannedRdvAt?: Date | null
  notes?: string | null
  inviteEmailSentAt?: Date | null
  inviteLastError?: string | null
  syncedAt: Date
  createdAt: Date
  jobTitle: { id: string; name: string } | null
}): AppProfileListItem {
  return {
    id: row.id,
    badakanId: row.badakanId,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    postalCode: row.postalCode,
    activityLabel: row.activityLabel,
    jobTitleId: row.jobTitleId,
    jobTitleName: row.jobTitle?.name ?? null,
    hasResume: row.hasResume,
    status: row.status,
    intakeStatus: row.intakeStatus ?? 'A_APPELER',
    callOutcome: row.callOutcome ?? null,
    plannedRdvAt: row.plannedRdvAt ?? null,
    notes: row.notes ?? null,
    invitationLabel: appProfileInvitationLabel({
      email: row.email,
      inviteEmailSentAt: row.inviteEmailSentAt ?? null,
      inviteLastError: row.inviteLastError ?? null,
    }),
    syncedAt: row.syncedAt,
    createdAt: row.createdAt,
  }
}
