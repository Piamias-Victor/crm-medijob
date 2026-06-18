'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { createMessage, type ChatMessage } from '@/lib/assistant/messages'
import { type ContextValue } from '@/lib/assistant/context'
import type { Shortcut } from '@/server/ai/shortcuts'

export function useAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [context, setContext] = useState<ContextValue>({})

  const append = (message: ChatMessage) => setMessages((prev) => [...prev, message])

  const chat = trpc.assistant.chat.useMutation({
    onSuccess: (result) => append(createMessage('assistant', result.text)),
    onError: (error) => append(createMessage('error', error.message)),
  })

  const activeContext =
    context.entityType && context.entityId
      ? { entityType: context.entityType, entityId: context.entityId }
      : undefined

  const send = (message: string) => {
    append(createMessage('user', message))
    chat.mutate({ message, context: activeContext })
  }

  const runShortcut = (shortcut: Shortcut) => {
    append(createMessage('user', shortcut.label))
    chat.mutate({ shortcutId: shortcut.id, context: activeContext })
  }

  return { messages, context, setContext, send, runShortcut, isPending: chat.isPending }
}
