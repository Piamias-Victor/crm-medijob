import { describe, expect, it } from 'vitest'
import { appProfileInvitationLabel } from './app-profile-invitation'

describe('appProfileInvitationLabel', () => {
  it('shows Envoyée when the mail was sent', () => {
    expect(
      appProfileInvitationLabel({
        email: 'a@b.c',
        inviteEmailSentAt: new Date(),
        inviteLastError: null,
      }),
    ).toBe('Envoyée')
  })

  it('shows En attente d’email when there is no address', () => {
    expect(
      appProfileInvitationLabel({
        email: null,
        inviteEmailSentAt: null,
        inviteLastError: null,
      }),
    ).toBe('En attente d’email')
  })

  it('shows Échec after a failed send', () => {
    expect(
      appProfileInvitationLabel({
        email: 'a@b.c',
        inviteEmailSentAt: null,
        inviteLastError: 'hireflix down',
      }),
    ).toBe('Échec')
  })

  it('shows À envoyer while the invitation is still owed', () => {
    expect(
      appProfileInvitationLabel({
        email: 'a@b.c',
        inviteEmailSentAt: null,
        inviteLastError: null,
      }),
    ).toBe('À envoyer')
  })
})
