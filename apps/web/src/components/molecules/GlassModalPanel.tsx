import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { SURFACE_GLASS } from '@/lib/constants/surface-glass'
import { modalEntrance } from '@/lib/motion/variants'
import { cn } from '@/lib/cn'

type Props = {
  titleId: string
  descriptionId?: string
  title: string
  description?: string
  onDismiss: () => void
  preventDismiss: boolean
  children: React.ReactNode
  className?: string
  role: 'dialog' | 'alertdialog'
  panelRef: React.RefObject<HTMLDivElement | null>
}

export function GlassModalPanel({
  titleId,
  descriptionId,
  title,
  description,
  onDismiss,
  preventDismiss,
  children,
  className,
  role,
  panelRef,
}: Props) {
  return (
    <>
      <motion.button
        type="button"
        aria-label="Fermer"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
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
            onClick={onDismiss}
            disabled={preventDismiss}
            aria-label="Fermer"
            className="shrink-0 px-2"
          >
            <X className="size-5" />
          </Button>
        </header>
        <div className="overflow-y-auto p-5 sm:p-6">{children}</div>
      </motion.div>
    </>
  )
}
