'use client'

import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

type Props = {
  open: boolean
  title: string
  meta?: string
  onToggle: () => void
}

export function InterviewTemplateCollapseToggle({ open, title, meta, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1 text-left hover:bg-surface"
    >
      <ChevronDown
        className={cn('size-4 shrink-0 text-fg-muted transition-transform', open && 'rotate-180')}
      />
      <span className="min-w-0 truncate text-sm font-medium text-fg">{title}</span>
      {meta ? <span className="shrink-0 text-xs text-fg-muted">{meta}</span> : null}
    </button>
  )
}
