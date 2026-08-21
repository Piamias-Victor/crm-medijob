'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { DevisQuoteSheet } from '@/components/molecules/DevisQuoteSheet'
import { Button } from '@/components/atoms/Button'
import {
  DEVIS_PREVIEW_CLOSE,
  DEVIS_PREVIEW_TITLE,
  DEVIS_SAVE_LABEL,
  DEVIS_SAVING_LABEL,
  DEVIS_SEND_LABEL,
  DEVIS_SENDING_LABEL,
} from '@/view-models/devis-copy'
import type { DevisPdfModel } from '@/view-models/devis-pdf-model'

type Props = {
  open: boolean
  quote: DevisPdfModel
  saving: boolean
  sending: boolean
  onClose: () => void
  onSave: () => void
  onSend: () => void
}

export function DevisPreviewModal({ open, quote, saving, sending, onClose, onSave, onSend }: Props) {
  const busy = saving || sending
  if (!open) return null
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title={DEVIS_PREVIEW_TITLE}
      className="!max-w-3xl w-full"
      trapFocus
      preventDismiss={busy}
    >
      <div className="bg-primary-muted p-4 sm:p-6">
        <DevisQuoteSheet quote={quote} />
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-3 border-t border-border/50 pt-4">
        <Button type="button" variant="outline" disabled={busy} onClick={onClose}>
          {DEVIS_PREVIEW_CLOSE}
        </Button>
        <Button type="button" variant="outline" disabled={busy} onClick={onSave}>
          {saving ? DEVIS_SAVING_LABEL : DEVIS_SAVE_LABEL}
        </Button>
        <Button type="button" variant="accent" disabled={busy} onClick={onSend}>
          {sending ? DEVIS_SENDING_LABEL : DEVIS_SEND_LABEL}
        </Button>
      </div>
    </GlassModal>
  )
}
