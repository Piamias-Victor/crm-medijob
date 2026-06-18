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

  it('renders an offer with its title', () => {
    const text = renderResponse('offer', { title: 'Préparateur CDI', content: 'x'.repeat(120) })
    expect(text).toContain('Préparateur CDI')
  })
})
