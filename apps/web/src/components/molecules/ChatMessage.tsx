import { cn } from '@/lib/cn'
import type { ChatMessage as Message, ChatRole } from '@/lib/assistant/messages'

const roleStyles: Record<ChatRole, string> = {
  user: 'ml-auto bg-primary text-primary-fg',
  assistant: 'mr-auto bg-surface text-fg',
  error: 'mr-auto bg-error/10 text-error',
}

export function ChatMessage({ message }: { message: Message }) {
  return (
    <div
      role={message.role === 'error' ? 'alert' : undefined}
      className={cn(
        'max-w-[80%] whitespace-pre-wrap rounded-lg px-4 py-2 text-sm',
        roleStyles[message.role],
      )}
    >
      {message.text}
    </div>
  )
}
