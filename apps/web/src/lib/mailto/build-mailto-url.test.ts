import { describe, it, expect } from 'vitest'
import { buildMailtoUrl } from '@/lib/mailto/build-mailto-url'

describe('buildMailtoUrl', () => {
  it('builds a mailto link with encoded subject and body', () => {
    const url = buildMailtoUrl({
      to: 'recruteur@medijob.fr',
      subject: 'Candidat présenté — été',
      body: 'Bonjour,\nMerci.',
    })

    expect(url).toMatch(/^mailto:recruteur@medijob\.fr\?/)
    expect(url).toContain('subject=Candidat+pr%C3%A9sent%C3%A9')
    expect(url).toContain('body=Bonjour%2C%0AMerci.')
  })

  it('supports bcc for grouped outreach', () => {
    const url = buildMailtoUrl({
      to: 'contact@pharmacie.fr',
      bcc: 'autre@pharmacie.fr,tiers@pharmacie.fr',
    })

    expect(url).toBe(
      'mailto:contact@pharmacie.fr?bcc=autre%40pharmacie.fr%2Ctiers%40pharmacie.fr',
    )
  })
})
