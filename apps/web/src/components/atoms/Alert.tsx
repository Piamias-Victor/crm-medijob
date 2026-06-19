import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'error' | 'warning' | 'success'

const variants: Record<Variant, string> = {
  error: 'bg-error/10 text-error',
  warning: 'bg-warning/15 text-warning',
  success: 'bg-success/15 text-success',
}

type Props = { variant: Variant; children: ReactNode; className?: string }

export function Alert({ variant, children, className }: Props) {
  return (
    <div role="alert" className={cn('rounded-md px-3 py-2 text-sm', variants[variant], className)}>
      {children}
    </div>
  )
}
