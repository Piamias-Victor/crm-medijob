import { describe, it, expect } from 'vitest'
import { buildComposeUrl } from '@/lib/mailto/build-compose-url'

describe('buildComposeUrl', () => {
  it('builds a gmail compose URL when client is gmail', () => {
    const url = buildComposeUrl({ to: 'candidat@example.com', subject: 'Bonjour' }, 'gmail')

    expect(url).toContain('https://mail.google.com/mail/?')
    expect(url).toContain('to=candidat%40example.com')
    expect(url).toContain('su=Bonjour')
  })
})
