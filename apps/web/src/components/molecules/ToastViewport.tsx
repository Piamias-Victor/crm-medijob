'use client'

import { createPortal } from 'react-dom'
import { useToastStore } from '@/stores/toast-store'
import { Toast } from '@/components/atoms/Toast'

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  const viewport = (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(viewport, document.body) : viewport
}
