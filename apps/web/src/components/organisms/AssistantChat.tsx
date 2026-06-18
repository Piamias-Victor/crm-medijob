'use client'

import { Sparkles } from 'lucide-react'
import { useAssistantChat } from '@/lib/assistant/use-assistant-chat'
import { ContextPicker } from '@/components/molecules/ContextPicker'
import { ShortcutBar } from '@/components/molecules/ShortcutBar'
import { ChatMessage } from '@/components/molecules/ChatMessage'
import { ChatComposer } from '@/components/molecules/ChatComposer'
import { Spinner } from '@/components/atoms/Spinner'
import { EmptyState } from '@/components/atoms/EmptyState'

export function AssistantChat() {
  const { messages, context, setContext, send, runShortcut, isPending } = useAssistantChat()

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col gap-4 rounded-lg border border-border bg-white p-4">
        <ContextPicker value={context} onChange={setContext} />
        <ShortcutBar onSelect={runShortcut} disabled={isPending} />
      </aside>

      <section className="flex min-h-[60vh] flex-col gap-4 rounded-lg border border-border bg-white p-4">
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Assistant IA"
              description="Pose une question ou utilise un raccourci. Sélectionne un contexte pour des réponses ciblées."
            />
          ) : (
            messages.map((message) => <ChatMessage key={message.id} message={message} />)
          )}
          {isPending ? <Spinner /> : null}
        </div>
        <ChatComposer onSend={send} disabled={isPending} />
      </section>
    </div>
  )
}
