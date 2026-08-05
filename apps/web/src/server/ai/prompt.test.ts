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

  it('chat prompt addresses the recruiter and forbids greeting the candidate', () => {
    const prompt = buildPrompt({ kind: 'chat', message: 'résume le profil' })
    expect(prompt.toLowerCase()).toContain('recruteur')
    expect(prompt).toContain('3e personne')
    expect(prompt).toContain('Bonjour Camille')
  })

  it('includes history text when provided', () => {
    const prompt = buildPrompt({
      kind: 'chat',
      message: 'c’est tout ?',
      historyText: 'user: résume\nassistant: Camille est préparatrice.',
    })
    expect(prompt).toContain('Historique récent')
    expect(prompt).toContain('Camille est préparatrice.')
  })
})