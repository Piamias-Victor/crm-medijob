'use client'

import { Button } from '@/components/atoms/Button'
import { GlassModal } from '@/components/molecules/GlassModal'
import type { SiretSearchFeedback } from '@/hooks/use-pharmacy-siret-search'
import { siretSearchAlertTitle } from '@/lib/siret-search-alert-copy'

type Props = {
  feedback: SiretSearchFeedback | null
  onClose: () => void
}

export function SiretSearchAlertModal({ feedback, onClose }: Props) {
  return (
    <GlassModal
      open={Boolean(feedback)}
      onClose={onClose}
      title={feedback ? siretSearchAlertTitle(feedback) : ''}
      role="alertdialog"
      trapFocus
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-fg-muted">{feedback?.message}</p>
        <div className="flex justify-end">
          <Button type="button" variant="accent" onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </GlassModal>
  )
}
