import { describe, expect, it, vi } from 'vitest'
import { resendAvailabilitySms } from './sms-resend'
import { smsDueDeps } from './sms-due.fixtures'
import type { AvailabilitySmsContact } from './sms-due.types'

function contact(
  overrides: Partial<AvailabilitySmsContact> = {},
): AvailabilitySmsContact {
  return { origin: 'APP', firstName: 'Marie', phone: '0612345678', ...overrides }
}

describe('resendAvailabilitySms', () => {
  it('resends the same secret URL without waiting for a due cycle', async () => {
    const sendSms = vi.fn()
    const result = await resendAvailabilitySms('c1', {
      ...smsDueDeps({ sendSms }),
      findContact: async () => contact(),
    })
    expect(result).toBe('sent')
    expect(sendSms).toHaveBeenCalledWith({
      to: '33612345678',
      content: expect.stringContaining('http://localhost:3000/dispo/secret-token'),
    })
  })

  it('skips CRM origin and missing phone', async () => {
    const sendSms = vi.fn()
    const deps = { ...smsDueDeps({ sendSms }), findContact: async () => contact({ origin: 'CRM' }) }
    expect(await resendAvailabilitySms('c1', deps)).toBe('not_app')
    expect(sendSms).not.toHaveBeenCalled()
    deps.findContact = async () => contact({ phone: null })
    expect(await resendAvailabilitySms('c1', deps)).toBe('skippedNoPhone')
  })
})
