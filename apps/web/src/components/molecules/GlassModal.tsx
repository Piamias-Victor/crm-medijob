'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { GlassModalPanel } from '@/components/molecules/GlassModalPanel'
import { useModalFocusTrap } from '@/lib/hooks/use-modal-focus-trap'
import { cn } from '@/lib/cn'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
  overlayClassName?: string
  role?: 'dialog' | 'alertdialog'
  trapFocus?: boolean
  preventDismiss?: boolean
}

export function GlassModal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  overlayClassName = 'z-50',
  role = 'dialog',
  trapFocus = false,
  preventDismiss = false,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const dismiss = preventDismiss ? () => undefined : onClose
  const [mounted, setMounted] = useState(open)

  useModalFocusTrap(open && trapFocus, panelRef, dismiss)

  useEffect(() => {
    if (open) setMounted(true)
  }, [open])

  if (typeof document === 'undefined' || !mounted) return null

  return createPortal(
    <AnimatePresence onExitComplete={() => setMounted(false)}>
      {open ? (
        <div className={cn('fixed inset-0 flex items-center justify-center p-4', overlayClassName)}>
          <GlassModalPanel
            panelRef={panelRef}
            titleId={titleId}
            descriptionId={descriptionId}
            title={title}
            description={description}
            onDismiss={dismiss}
            preventDismiss={preventDismiss}
            className={className}
            role={role}
          >
            {children}
          </GlassModalPanel>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
