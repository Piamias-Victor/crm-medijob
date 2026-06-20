import { type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'default' | 'search'
}

export function Input({ className, variant = 'default', ...props }: Props) {
  return (
    <input
      className={cn(
        'w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-accent focus:ring-2 focus:ring-accent-muted',
        variant === 'search' && 'border-b border-border rounded-none border-x-0 border-t-0 focus:ring-0',
        className,
      )}
      {...props}
    />
  )
}
