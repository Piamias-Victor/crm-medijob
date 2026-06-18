import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'default' | 'accent' | 'success' | 'warning' | 'error'

const variants: Record<Variant, string> = {
  default: 'bg-surface text-fg-muted',
  accent: 'bg-accent-muted text-accent-hover',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
}

type Props = HTMLAttributes<HTMLSpanElement> & { variant?: Variant }

export function Badge({ variant = 'default', className, ...props }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
