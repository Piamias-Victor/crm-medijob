import { describe, expect, it, vi } from 'vitest'
import { inviteDueAppProfiles } from './invite-due'
import { inviteDeps } from './invite-due.fixtures'

describe('inviteDueAppProfiles failure', () => {
  it('records a Brevo failure and retries later without marking sent', async () => {
    const d = inviteDeps({
      sendInviteEmail: vi.fn().mockRejectedValue(new Error('Envoi email indisponible')),
    })
    const result = await inviteDueAppProfiles(d)
    expect(result.failed).toBe(1)
    expect(result.lastError).toBe('Envoi email indisponible')
    expect(d.saveError).toHaveBeenCalledWith('p1', 'Envoi email indisponible')
    expect(d.saveSent).not.toHaveBeenCalled()
  })
})
