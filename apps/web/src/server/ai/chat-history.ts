import { CHAT_HISTORY_WINDOW } from '@/lib/constants/assistant-chat'

export type ChatHistoryTurn = {
  role: 'user' | 'assistant'
  content: string
}

export function takeChatHistoryWindow(
  messages: ChatHistoryTurn[],
  limit = CHAT_HISTORY_WINDOW,
): ChatHistoryTurn[] {
  if (messages.length <= limit) return messages
  return messages.slice(-limit)
}

export function formatChatHistory(messages: ChatHistoryTurn[]): string {
  return messages.map((m) => `${m.role}: ${m.content}`).join('\n')
}
