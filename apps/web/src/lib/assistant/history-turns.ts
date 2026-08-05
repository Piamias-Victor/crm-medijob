import type { ChatMessage } from './messages'
import type { ChatHistoryTurn } from '@/server/ai/chat-history'

export function toHistoryTurns(messages: ChatMessage[]): ChatHistoryTurn[] {
  return messages.flatMap((m) => {
    if (m.role !== 'user' && m.role !== 'assistant') return []
    return [{ role: m.role, content: m.text }]
  })
}
