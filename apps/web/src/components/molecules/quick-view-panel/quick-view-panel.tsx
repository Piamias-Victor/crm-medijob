'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { QuickViewPanelShell } from '@/components/molecules/quick-view-panel/quick-view-panel-shell'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  footerHref: string
  children: ReactNode
}

export function QuickViewPanel({ open, onClose, title, footerHref, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const [mounted, setMounted] = useState(open)

  useEffect(() => {
    if (open) setMounted(true)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (typeof document === 'undefined' || !mounted) return null

  return createPortal(
    <AnimatePresence onExitComplete={() => setMounted(false)}>
      {open ? (
        <QuickViewPanelShell
          titleId={titleId}
          title={title}
          onClose={onClose}
          footerHref={footerHref}
          panelRef={panelRef}
        >
          {children}
        </QuickViewPanelShell>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
