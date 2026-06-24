'use client'

import { useId, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { useModalFocusTrap } from '@/lib/hooks/use-modal-focus-trap'
import { SURFACE_GLASS } from '@/lib/constants/surface-glass'
import { modalEntrance } from '@/lib/motion/variants'
import { cn } from '@/lib/cn'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
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
  role = 'dialog',
  trapFocus = false,
  preventDismiss = false,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const dismiss = preventDismiss ? () => undefined : onClose

  useModalFocusTrap(open && trapFocus, panelRef, dismiss)

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Fermer"
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />
          <motion.div
            ref={panelRef}
            role={role}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            variants={modalEntrance}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn('relative flex max-h-[90dvh] w-full max-w-xl flex-col', SURFACE_GLASS, className)}
          >
            <header className="flex items-start justify-between gap-3 border-b border-border/80 bg-gradient-to-r from-primary-muted/55 via-accent-muted/40 to-white px-5 py-4">
              <div>
                <h2 id={titleId} className="text-lg font-semibold tracking-tight text-fg">
                  {title}
                </h2>
                {description ? (
                  <p id={descriptionId} className="mt-1 text-sm text-fg-muted">
                    {description}
                  </p>
                ) : null}
              </div>
              <Button
                variant="ghost"
                onClick={dismiss}
                disabled={preventDismiss}
                aria-label="Fermer"
                className="shrink-0 px-2"
              >
                <X className="size-5" />
              </Button>
            </header>
            <div className="overflow-y-auto p-5 sm:p-6">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
