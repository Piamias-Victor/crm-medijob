import type { InviteDueProfile } from './invite-due.types'

export function toInviteDueProfile(row: {
  id: string
  status: InviteDueProfile['status']
  firstName: string
  lastName: string
  email: string | null
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
    hireflixInterviewId: row.hireflixInterviewId,
    hireflixUrl: row.hireflixUrl,
    inviteEmailSentAt: row.inviteEmailSentAt,
  }
}
