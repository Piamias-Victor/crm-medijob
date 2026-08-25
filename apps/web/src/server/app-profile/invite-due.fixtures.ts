import { vi } from 'vitest'
import type { InviteDueDeps, InviteDueProfile } from './invite-due.types'

export function inviteProfile(
  overrides: Partial<InviteDueProfile> = {},
): InviteDueProfile {
  return {
    id: 'p1',
    status: 'EN_ATTENTE',
    firstName: 'Camille',
    lastName: 'Dupont',
    email: 'camille@example.com',
    hireflixInterviewId: null,
    hireflixUrl: null,
    inviteEmailSentAt: null,
    ...overrides,
  }
}

export function inviteDeps(overrides: Partial<InviteDueDeps> = {}): InviteDueDeps {
  const row = inviteProfile()
  return {
    listDue: async () => [row],
    findById: async () => row,
    saveHireflix: vi.fn(),
    saveSent: vi.fn(),
    saveError: vi.fn(),
    inviteHireflix: vi.fn().mockResolvedValue({
      interviewId: 'hf1',
      url: 'https://app.hireflix.com/abc',
    }),
    sendInviteEmail: vi.fn(),
    ...overrides,
  }
}
