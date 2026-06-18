'use client'

import { Sparkles } from 'lucide-react'
import { useAssistantChat } from '@/lib/assistant/use-assistant-chat'
import { ContextPicker } from '@/components/molecules/ContextPicker'
import { ShortcutBar } from '@/components/molecules/ShortcutBar'
import { ChatMessage } from '@/components/molecules/ChatMessage'
import { ChatComposer } from '@/components/molecules/ChatComposer'
import { SectionCard } from '@/components/molecules/SectionCard'
import { Spinner } from '@/components/atoms/Spinner'
import { EmptyState } from '@/components/atoms/EmptyState'

export function AssistantChat() {
  const { messages, context, setContext, send, runShortcut, isPending } = useAssistantChat()

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr]">
      <SectionCard
        variant="glass"
        title="Outils"
        description="Contexte ciblé et actions rapides."
        bodyClassName="space-y-5 p-4 sm:p-5"
      >
        <ContextPicker value={context} onChange={setContext} />
        <ShortcutBar onSelect={runShortcut} disabled={isPending} />
      </SectionCard>

      <SectionCard
        variant="glass"
        title="Conversation"
        description="Pose une question ou lance un raccourci."
        bodyClassName="flex min-h-[min(70vh,640px)] flex-col p-0"
      >
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-5">
          {messages.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Prêt à vous aider"
              description="Sélectionnez un contexte pour des réponses ciblées, ou écrivez directement."
            />
          ) : (
            messages.map((message) => <ChatMessage key={message.id} message={message} />)
          )}
          {isPending ? (
            <div className="flex items-center gap-2 text-sm text-fg-muted">
              <Spinner className="size-4 border-accent/30 border-t-accent" />
              Réflexion…
            </div>
          ) : null}
        </div>
        <div className="border-t border-border/50 bg-white/50 p-4 backdrop-blur-sm sm:px-5">
          <ChatComposer onSend={send} disabled={isPending} />
        </div>
      </SectionCard>
    </div>
  )
}
