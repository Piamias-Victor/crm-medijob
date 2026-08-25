export type InviteDueProfile = {
  id: string
  status: 'EN_ATTENTE' | 'ACCEPTE' | 'IGNORE'
  firstName: string
  lastName: string
  email: string | null
  hireflixInterviewId: string | null
  hireflixUrl: string | null
  inviteEmailSentAt: Date | null
}

export type HireflixInviteInput = {
  firstName: string
  lastName: string
  email: string
  externalId: string
}

export type HireflixInviteResult = { interviewId: string; url: string }

export type InviteEmailInput = { to: string; firstName: string; url: string }

export type InviteDueDeps = {
  listDue: () => Promise<InviteDueProfile[]>
  findById: (id: string) => Promise<InviteDueProfile | null>
  saveHireflix: (id: string, data: HireflixInviteResult) => Promise<void>
  saveSent: (id: string) => Promise<void>
  saveError: (id: string, error: string) => Promise<void>
  inviteHireflix: (input: HireflixInviteInput) => Promise<HireflixInviteResult>
  sendInviteEmail: (input: InviteEmailInput) => Promise<void>
  testTo?: string
}

export type InviteDueResult = {
  sent: number
  skippedNoEmail: number
  cancelled: number
  failed: number
  lastError?: string
}
