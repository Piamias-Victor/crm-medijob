// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { renderResponse } from './render'

describe('renderResponse', () => {
  it('renders a chat reply as plain text', () => {
    expect(renderResponse('chat', { reply: 'Bonjour' })).toBe('Bonjour')
  })

  it('renders an email with its subject and body', () => {
    const text = renderResponse('email', { subject: 'Proposition', body: 'Bonjour…' })
    expect(text).toContain('Proposition')
    expect(text).toContain('Bonjour…')
  })

  it('renders an offer as sectioned HTML', () => {
    const text = renderResponse('offer', {
      resume: 'Résumé',
      missions: ['Mission A'],
      profil: ['Profil A'],
      infos: ['CDI'],
    })
    expect(text).toContain('RÉSUMÉ DU POSTE')
    expect(text).toContain('Mission A')
  })
})
