'use client'

import { Spinner } from '@/components/atoms/Spinner'
import { GlassModal } from '@/components/molecules/GlassModal'
import { AnonymizedDossierModalFields } from '@/components/molecules/AnonymizedDossierModalFields'
import { AnonymizedDossierModalFooter } from '@/components/molecules/AnonymizedDossierModalFooter'
import {
  ANONYMIZED_MODAL_DESCRIPTION,
  ANONYMIZED_MODAL_GENERATING,
  ANONYMIZED_MODAL_TITLE,
} from '@/lib/constants/anonymized-dossier'
import type { useAnonymizedDossierModal } from '@/lib/hooks/use-anonymized-dossier-modal'

type Flow = ReturnType<typeof useAnonymizedDossierModal>

type Props = { flow: Flow }

export function AnonymizedDossierModal({ flow }: Props) {
  if (!flow.open) return null

  const hasContent = Boolean(flow.draft && Object.values(flow.draft).some((v) => v.trim()))

  return (
    <GlassModal
      open
      onClose={flow.close}
      title={ANONYMIZED_MODAL_TITLE}
      description={ANONYMIZED_MODAL_DESCRIPTION}
      className="max-w-4xl"
      trapFocus
      preventDismiss={flow.generating || flow.saving}
    >
      <div className="flex flex-col gap-6">
        {flow.error ? <p className="text-sm text-error">{flow.error}</p> : null}
        {flow.generating || !flow.draft ? (
          <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-base text-fg-muted">
            <Spinner className="size-7 border-accent/30 border-t-accent" />
            {ANONYMIZED_MODAL_GENERATING}
          </div>
        ) : (
          <AnonymizedDossierModalFields draft={flow.draft} onChange={flow.setSection} />
        )}
        <AnonymizedDossierModalFooter
          canSubmit={hasContent}
          generating={flow.generating}
          saving={flow.saving}
          onClose={flow.close}
          onRegenerate={flow.regenerate}
          onConfirm={flow.confirmPdf}
        />
      </div>
    </GlassModal>
  )
}
