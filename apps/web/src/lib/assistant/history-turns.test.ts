import { describe, it, expect } from 'vitest'
import { toHistoryTurns } from './history-turns'
import { createMessage } from './messages'

describe('toHistoryTurns', () => {
  it('maps user and assistant messages and drops errors', () => {
    const turns = toHistoryTurns([
      createMessage('user', 'salut'),
      createMessage('assistant', 'aide CRM'),
      createMessage('error', 'boom'),
    ])
    expect(turns).toEqual([
      { role: 'user', content: 'salut' },
      { role: 'assistant', content: 'aide CRM' },
    ])
  })
})
