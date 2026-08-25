import { describe, expect, it } from 'vitest'
import {
  HIREFLIX_INVITE_SUBJECT,
  hireflixInviteHtml,
} from './hireflix-invite-mail'

describe('hireflixInviteHtml', () => {
  it('greets by first name and includes the interview URL', () => {
    const html = hireflixInviteHtml('Camille', 'https://app.hireflix.com/abc')
    expect(HIREFLIX_INVITE_SUBJECT).toBe('Votre entretien vidéo MediJob')
    expect(html).toContain('Bonjour Camille')
    expect(html).toContain('https://app.hireflix.com/abc')
  })
})
