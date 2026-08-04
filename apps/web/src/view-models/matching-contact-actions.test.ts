// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { resolveMatchingContactActions } from '@/view-models/matching-contact-actions'

const rows = [
  {
    candidateId: 'c1',
    email: 'a@example.com',
    phone: '0612345678',
  },
  {
    candidateId: 'c2',
    email: null,
    phone: '0698765432',
  },
  {
    candidateId: 'c3',
    email: 'bad',
    phone: 'x',
  },
]

describe('resolveMatchingContactActions', () => {
  it('builds Gmail compose + sms/wa urls for selected contactable candidates', () => {
    const actions = resolveMatchingContactActions({
      selected: rows.slice(0, 2),
      subject: 'Mission X — Pharma',
    })
    expect(actions.mailtoUrl).toMatch(/mail\.google\.com/)
    expect(actions.mailtoUrl).toMatch(/a(@|%40)example\.com/)
    expect(actions.smsUrls).toEqual(['sms:+33612345678', 'sms:+33698765432'])
    expect(actions.whatsappUrls).toEqual([
      'https://wa.me/33612345678',
      'https://wa.me/33698765432',
    ])
    expect(actions.emailCount).toBe(1)
    expect(actions.phoneCount).toBe(2)
  })

  it('disables channels when nothing usable', () => {
    const actions = resolveMatchingContactActions({
      selected: [rows[2]!],
      subject: 'Mission X — Pharma',
    })
    expect(actions.mailtoUrl).toBeNull()
    expect(actions.smsUrls).toEqual([])
    expect(actions.whatsappUrls).toEqual([])
  })
})
