'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { Spinner } from '@/components/atoms/Spinner'

type Props = { open: boolean }

export function CvImportAnalyzingModal({ open }: Props) {
  return (
    <GlassModal
      open={open}
      onClose={() => undefined}
      title="Analyse du CV en cours"
      description="Extraction IA des informations — merci de patienter."
      preventDismiss
      trapFocus
      role="alertdialog"
    >
      <div className="flex flex-col items-center gap-4 py-2">
        <Spinner className="size-8 border-accent/30 border-t-accent" />
        <p className="text-center text-sm text-fg-muted">
          Lecture du PDF et préremplissage du formulaire…
        </p>
      </div>
    </GlassModal>
  )
}
