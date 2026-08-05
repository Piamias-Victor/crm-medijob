import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { createMessage, type ChatMessage } from '@/lib/assistant/messages'
import { type ContextValue } from '@/lib/assistant/context'
import { toHistoryTurns } from '@/lib/assistant/history-turns'
import { didContextChange } from '@/lib/assistant/context-reset'
import { takeChatHistoryWindow } from '@/server/ai/chat-history'
import type { Shortcut } from '@/server/ai/shortcuts'

export function useAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [context, setContextState] = useState<ContextValue>({})

  const append = (message: ChatMessage) => setMessages((prev) => [...prev, message])

  const chat = trpc.assistant.chat.useMutation({
    onSuccess: (result) => append(createMessage('assistant', result.text)),
    onError: (error) => append(createMessage('error', error.message)),
  })

  const activeContext =
    context.entityType && context.entityId
      ? { entityType: context.entityType, entityId: context.entityId }
      : undefined

  const setContext = (next: ContextValue) => {
    if (didContextChange(context, next)) setMessages([])
    setContextState(next)
  }

  const historyPayload = () => takeChatHistoryWindow(toHistoryTurns(messages))

  const send = (message: string) => {
    append(createMessage('user', message))
    chat.mutate({ message, context: activeContext, history: historyPayload() })
  }

  const runShortcut = (shortcut: Shortcut) => {
    append(createMessage('user', shortcut.label))
    chat.mutate({
      shortcutId: shortcut.id,
      context: activeContext,
      history: historyPayload(),
    })
  }

  return { messages, context, setContext, send, runShortcut, isPending: chat.isPending }
}
