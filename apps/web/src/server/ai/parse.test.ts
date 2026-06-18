// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { parseAssistantResponse } from './parse'

describe('parseAssistantResponse', () => {
  it('parses a valid chat response from JSON text', () => {
    const result = parseAssistantResponse('chat', '{"reply":"Bonjour"}')
    expect(result).toEqual({ reply: 'Bonjour' })
  })

  it('parses an email response (subject + body)', () => {
    const raw = '{"subject":"Proposition","body":"Bonjour, ..."}'
    expect(parseAssistantResponse('email', raw)).toEqual({
      subject: 'Proposition',
      body: 'Bonjour, ...',
    })
  })

  it('throws when the JSON is malformed', () => {
    expect(() => parseAssistantResponse('chat', 'not json')).toThrow()
  })

  it('throws when the shape does not match the schema', () => {
    expect(() => parseAssistantResponse('chat', '{"foo":"bar"}')).toThrow()
  })

  it('throws when an offer is too short to be usable', () => {
    expect(() => parseAssistantResponse('offer', '{"title":"X","content":"trop court"}')).toThrow()
  })
})
