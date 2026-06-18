import { Bot, User } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { ChatMessage as Message, ChatRole } from '@/lib/assistant/messages'

const bubbleStyles: Record<ChatRole, string> = {
  user: 'ml-auto border-accent/20 bg-accent text-accent-fg shadow-md shadow-accent/15',
  assistant: 'mr-auto border-border/55 bg-white/95 text-fg shadow-sm',
  error: 'mr-auto border-error/25 bg-error/8 text-error',
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex max-w-[85%] gap-2', isUser ? 'ml-auto flex-row-reverse' : 'mr-auto')}>
      <span
        className={cn(
          'grid size-7 shrink-0 place-items-center rounded-lg',
          isUser ? 'bg-accent/20 text-accent-hover' : 'bg-primary-muted text-primary',
          message.role === 'error' && 'bg-error/10 text-error',
        )}
        aria-hidden
      >
        {isUser ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
      </span>
      <div
        role={message.role === 'error' ? 'alert' : undefined}
        className={cn(
          'min-w-0 rounded-2xl border px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
          isUser ? 'rounded-br-md' : 'rounded-bl-md',
          bubbleStyles[message.role],
        )}
      >
        {message.text}
      </div>
    </div>
  )
}
