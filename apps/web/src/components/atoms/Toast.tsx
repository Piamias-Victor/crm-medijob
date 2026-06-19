'use client'

import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { ToastItem } from '@/stores/toast-store'

const ICONS = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
} as const

const TONES = {
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
} as const

type Props = ToastItem & { onDismiss: (id: string) => void }

export function Toast({ id, variant, message, onDismiss }: Props) {
  const Icon = ICONS[variant]

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(id), 5000)
    return () => window.clearTimeout(timer)
  }, [id, onDismiss])

  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-md border border-border bg-white px-4 py-3 shadow-lg"
    >
      <Icon className={cn('size-5 shrink-0', TONES[variant])} aria-hidden />
      <span className="flex-1 text-sm text-fg">{message}</span>
      <button
        type="button"
        aria-label="Fermer"
        onClick={() => onDismiss(id)}
        className="grid size-6 place-items-center rounded-full text-fg-muted hover:bg-surface"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
