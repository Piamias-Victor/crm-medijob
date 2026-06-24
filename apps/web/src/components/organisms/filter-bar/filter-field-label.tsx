import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  label: string
  children: ReactNode
  className?: string
}

export function FilterFieldLabel({ label, children, className }: Props) {
  return (
    <div className={cn('block shrink-0 space-y-1', className)}>
      <span className="text-xs font-medium text-fg-muted">{label}</span>
      {children}
    </div>
  )
}
