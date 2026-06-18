'use client'

import { type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
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
}

export function GlassModal({ open, onClose, title, description, children, className }: Props) {
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
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={modalEntrance}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn('relative flex max-h-[90dvh] w-full max-w-xl flex-col', SURFACE_GLASS, className)}
          >
            <header className="flex items-start justify-between gap-3 border-b border-border/80 bg-gradient-to-r from-primary-muted/55 via-accent-muted/40 to-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
                {description ? <p className="mt-1 text-sm text-fg-muted">{description}</p> : null}
              </div>
              <Button variant="ghost" onClick={onClose} aria-label="Fermer" className="shrink-0 px-2">
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
