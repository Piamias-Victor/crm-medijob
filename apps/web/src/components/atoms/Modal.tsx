'use client'

import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-white shadow-lg">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-base font-semibold text-fg">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Fermer" className="px-2">
            <X className="size-5" />
          </Button>
        </header>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}
