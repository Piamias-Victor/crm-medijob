import type { InviteDueProfile } from './invite-due.types'

export function toInviteDueProfile(row: {
  id: string
  status: InviteDueProfile['status']
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  candidateId: string | null
  calendarSmsSentAt: Date | null
  hireflixInterviewId: string | null
  hireflixUrl: string | null
  inviteEmailSentAt: Date | null
}): InviteDueProfile {
  return {
    id: row.id,
    status: row.status,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    candidateId: row.candidateId,
    calendarSmsSentAt: row.calendarSmsSentAt,
    hireflixInterviewId: row.hireflixInterviewId,
    hireflixUrl: row.hireflixUrl,
    inviteEmailSentAt: row.inviteEmailSentAt,
  }
}
