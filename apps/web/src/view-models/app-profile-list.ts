import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { appProfileInvitationLabel } from './app-profile-invitation'
import { intakeBookingSmsLabel } from './app-profile-intake-booking-sms'
import { isRelanceOverdue } from './app-profile-relance'
import type { AppProfileListItem } from './app-profile-list.types'
import type { AppCallOutcome, AppIntakeStatus, AppProfileStatus } from '@prisma/client'

export type { AppProfileListItem }

type Row = {
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
  referentId?: string | null
  relanceAt?: Date | null
  lastCalledAt?: Date | null
  inviteEmailSentAt?: Date | null
  inviteLastError?: string | null
  calendarSmsSentAt?: Date | null
  badakanCommentsLabel?: string
  syncedAt: Date
  createdAt: Date
  jobTitle: { id: string; name: string } | null
  referent?: { id: string; name: string } | null
  lastCalledBy?: { id: string; name: string } | null
}

export function toAppProfileListItem(row: Row, now: Date = new Date()): AppProfileListItem {
  const relanceAt = row.relanceAt ?? null
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
    referentId: row.referentId ?? row.referent?.id ?? null,
    referentName: row.referent?.name ?? null,
    relanceAt,
    isRelanceOverdue: isRelanceOverdue(relanceAt, now),
    lastCalledAt: row.lastCalledAt ?? null,
    lastCalledByName: row.lastCalledBy?.name ?? null,
    invitationLabel: appProfileInvitationLabel({
      email: row.email,
      inviteEmailSentAt: row.inviteEmailSentAt ?? null,
      inviteLastError: row.inviteLastError ?? null,
    }),
    intakeBookingSmsLabel: intakeBookingSmsLabel(row.calendarSmsSentAt ?? null),
    badakanCommentsLabel: row.badakanCommentsLabel ?? TABLE_EMPTY_CELL,
    syncedAt: row.syncedAt,
    createdAt: row.createdAt,
  }
}
