'use client'

import { Download, Sparkles } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import {
  ANONYMIZED_MODAL_CTA,
  ANONYMIZED_MODAL_REGEN,
} from '@/lib/constants/anonymized-dossier'

type Props = {
  canSubmit: boolean
  generating: boolean
  saving: boolean
  onClose: () => void
  onRegenerate: () => void
  onConfirm: () => void
}

export function AnonymizedDossierModalFooter({
  canSubmit,
  generating,
  saving,
  onClose,
  onRegenerate,
  onConfirm,
}: Props) {
  const busy = generating || saving
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
      <Button type="button" variant="ghost" disabled={busy} onClick={onRegenerate} className="gap-2">
        <Sparkles className="size-4" />
        {ANONYMIZED_MODAL_REGEN}
      </Button>
      <div className="flex gap-2">
        <Button type="button" variant="ghost" disabled={busy} onClick={onClose}>
          Annuler
        </Button>
        <Button
          type="button"
          variant="accent"
          disabled={!canSubmit || busy}
          onClick={onConfirm}
          className="gap-2"
        >
          <Download className="size-4" />
          {saving ? 'Génération…' : ANONYMIZED_MODAL_CTA}
        </Button>
      </div>
    </div>
  )
}
