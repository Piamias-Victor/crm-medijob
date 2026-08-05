import { describe, it, expect } from 'vitest'
import { formatChatHistory, takeChatHistoryWindow } from './chat-history'
import { CHAT_HISTORY_WINDOW } from '@/lib/constants/assistant-chat'

describe('takeChatHistoryWindow', () => {
  it('keeps only the last N messages', () => {
    const messages = Array.from({ length: 10 }, (_, i) => ({
      role: i % 2 === 0 ? ('user' as const) : ('assistant' as const),
      content: `m${i}`,
    }))
    const window = takeChatHistoryWindow(messages)
    expect(window).toHaveLength(CHAT_HISTORY_WINDOW)
    expect(window[0]?.content).toBe('m2')
    expect(window.at(-1)?.content).toBe('m9')
  })
})

describe('formatChatHistory', () => {
  it('renders role-tagged lines for the prompt', () => {
    const text = formatChatHistory([
      { role: 'user', content: 'résume' },
      { role: 'assistant', content: 'Camille est préparatrice.' },
    ])
    expect(text).toContain('user: résume')
    expect(text).toContain('assistant: Camille est préparatrice.')
  })
})
