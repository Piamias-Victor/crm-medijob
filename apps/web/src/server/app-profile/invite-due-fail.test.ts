import { describe, expect, it, vi } from 'vitest'
import { inviteDueAppProfiles } from './invite-due'
import { inviteDeps } from './invite-due.fixtures'

describe('inviteDueAppProfiles failure', () => {
  it('records the error and retries later without marking sent', async () => {
    const d = inviteDeps({
      inviteHireflix: vi.fn().mockRejectedValue(new Error('hireflix down')),
    })
    const result = await inviteDueAppProfiles(d)
    expect(result.failed).toBe(1)
    expect(result.lastError).toBe('hireflix down')
    expect(d.saveError).toHaveBeenCalledWith('p1', 'hireflix down')
    expect(d.saveSent).not.toHaveBeenCalled()
  })
})
