import { type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-accent focus:ring-2 focus:ring-accent-muted',
        className,
      )}
      {...props}
    />
  )
}
