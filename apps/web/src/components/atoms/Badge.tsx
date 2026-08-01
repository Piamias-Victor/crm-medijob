import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'accent'
  | 'sky'
  | 'rose'
  | 'success'
  | 'warning'
  | 'error'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-surface text-fg-muted',
  primary: 'bg-primary-muted text-primary',
  accent: 'bg-accent-muted text-accent-hover',
  sky: 'bg-sky-muted text-sky-fg',
  rose: 'bg-rose-muted text-rose-fg',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
}

type Props = HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }

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
