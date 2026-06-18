export type ChatRole = 'user' | 'assistant' | 'error'

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
}

let sequence = 0

export function createMessage(role: ChatRole, text: string): ChatMessage {
  sequence += 1
  return { id: `msg-${sequence}`, role, text }
}
