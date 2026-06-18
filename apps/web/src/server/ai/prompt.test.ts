// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildPrompt } from './prompt'

describe('buildPrompt', () => {
  it('includes the user message and a JSON format instruction', () => {
    const prompt = buildPrompt({ kind: 'chat', message: 'Bonjour ?' })
    expect(prompt).toContain('Bonjour ?')
    expect(prompt).toContain('reply')
    expect(prompt.toLowerCase()).toContain('json')
  })

  it('includes the context block when provided', () => {
    const prompt = buildPrompt({
      kind: 'summary',
      message: 'résume',
      contextText: 'Candidat: Marie Curie',
    })
    expect(prompt).toContain('Marie Curie')
  })

  it('includes the shortcut instruction', () => {
    const prompt = buildPrompt({
      kind: 'email',
      instruction: 'Rédige un email professionnel',
    })
    expect(prompt).toContain('Rédige un email professionnel')
    expect(prompt).toContain('subject')
  })
})
