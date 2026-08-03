'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ReactNode, RefObject } from 'react'
import { Button } from '@/components/atoms/Button'
import { SURFACE_GLASS } from '@/lib/constants/surface-glass'
import { drawerOverlay, drawerPanel } from '@/lib/motion/drawer-variants'
import {
  QUICK_VIEW_CLOSE_LABEL,
  QUICK_VIEW_DETAIL_LINK,
} from '@/components/molecules/quick-view-panel/quick-view-copy'
import { cn } from '@/lib/cn'

type Props = {
  titleId: string
  title: string
  onClose: () => void
  footerHref: string
  panelRef: RefObject<HTMLDivElement | null>
  children: ReactNode
}

export function QuickViewPanelShell({
  titleId,
  title,
  onClose,
  footerHref,
  panelRef,
  children,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.button
        type="button"
        aria-label={QUICK_VIEW_CLOSE_LABEL}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        variants={drawerOverlay}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        variants={drawerPanel}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          'relative flex h-full w-full max-w-md flex-col rounded-none border-y-0 border-r-0',
          SURFACE_GLASS,
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-border/80 bg-gradient-to-r from-primary-muted/70 via-accent-muted/45 to-white px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold tracking-tight text-fg">
            {title}
          </h2>
          <Button
            type="button"
            variant="ghost"
            className="size-8 shrink-0 p-0"
            onClick={onClose}
            aria-label={QUICK_VIEW_CLOSE_LABEL}
          >
            <X className="size-4" />
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white/40 to-primary-muted/15 px-4 py-4">
          {children}
        </div>
        <footer className="border-t border-border/80 bg-white/70 px-5 py-4">
          <Link
            href={footerHref}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-accent px-3 text-sm font-medium text-accent-fg shadow-sm shadow-accent/20 transition-colors hover:bg-accent-hover"
          >
            {QUICK_VIEW_DETAIL_LINK}
          </Link>
        </footer>
      </motion.div>
    </div>
  )
}
