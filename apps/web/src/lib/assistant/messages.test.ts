// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createMessage } from './messages'

describe('createMessage', () => {
  it('keeps the role and text', () => {
    const message = createMessage('user', 'Bonjour')
    expect(message.role).toBe('user')
    expect(message.text).toBe('Bonjour')
  })

  it('gives each message a unique id', () => {
    const a = createMessage('user', 'a')
    const b = createMessage('assistant', 'b')
    expect(a.id).not.toBe(b.id)
  })
})
