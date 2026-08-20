'use client'

import { Button } from '@/components/atoms/Button'
import {
  DEVIS_DELETE_LABEL,
  DEVIS_DELETING_LABEL,
  DEVIS_SAVE_LABEL,
  DEVIS_SAVING_LABEL,
  DEVIS_PREVIEW_LABEL,
  DEVIS_PREVIEWING_LABEL,
} from '@/view-models/devis-copy'

type Props = {
  submitting: boolean
  previewing: boolean
  deleting: boolean
  hasDraft: boolean
  onDelete?: () => void
  onPreview: () => void
}

export function DevisDraftActions({
  submitting,
  previewing,
  deleting,
  hasDraft,
  onDelete,
  onPreview,
}: Props) {
  const busy = submitting || previewing || deleting
  return (
    <div className="flex flex-wrap gap-2 sm:col-span-2">
      <Button type="submit" variant="outline" disabled={busy}>
        {submitting ? DEVIS_SAVING_LABEL : DEVIS_SAVE_LABEL}
      </Button>
      <Button type="button" variant="accent" disabled={busy} onClick={onPreview}>
        {previewing ? DEVIS_PREVIEWING_LABEL : DEVIS_PREVIEW_LABEL}
      </Button>
      {hasDraft && onDelete ? (
        <Button type="button" variant="danger" disabled={busy} onClick={onDelete}>
          {deleting ? DEVIS_DELETING_LABEL : DEVIS_DELETE_LABEL}
        </Button>
      ) : null}
    </div>
  )
}
