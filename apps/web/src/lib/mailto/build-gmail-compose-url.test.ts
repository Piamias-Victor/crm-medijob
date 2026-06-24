import { describe, it, expect } from 'vitest'
import { buildGmailComposeUrl } from '@/lib/mailto/build-gmail-compose-url'

describe('buildGmailComposeUrl', () => {
  it('builds a Gmail compose URL with encoded subject and body', () => {
    const url = buildGmailComposeUrl({
      to: 'recruteur@medijob.fr',
      subject: 'Candidat présenté — été',
      body: 'Bonjour,\nMerci.',
    })

    expect(url).toMatch(/^https:\/\/mail\.google\.com\/mail\/\?/)
    expect(url).toContain('to=recruteur%40medijob.fr')
    expect(url).toContain('su=Candidat+pr%C3%A9sent%C3%A9')
    expect(url).toContain('body=Bonjour%2C%0AMerci.')
  })
})
