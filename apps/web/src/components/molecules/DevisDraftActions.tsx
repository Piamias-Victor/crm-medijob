'use client'

import { Button } from '@/components/atoms/Button'
import { DEVIS_DELETE_LABEL, DEVIS_DELETING_LABEL, DEVIS_SAVE_LABEL } from '@/view-models/devis-copy'
import { DEVIS_SAVING_LABEL, DEVIS_SEND_LABEL, DEVIS_SENDING_LABEL } from '@/view-models/devis-copy'

type Props = {
  submitting: boolean
  sending: boolean
  deleting: boolean
  hasDraft: boolean
  onDelete?: () => void
  onSend: () => void
}

export function DevisDraftActions({
  submitting,
  sending,
  deleting,
  hasDraft,
  onDelete,
  onSend,
}: Props) {
  const busy = submitting || sending || deleting
  return (
    <div className="flex flex-wrap gap-2 sm:col-span-2">
      <Button type="submit" variant="outline" disabled={busy}>
        {submitting ? DEVIS_SAVING_LABEL : DEVIS_SAVE_LABEL}
      </Button>
      <Button type="button" variant="accent" disabled={busy} onClick={onSend}>
        {sending ? DEVIS_SENDING_LABEL : DEVIS_SEND_LABEL}
      </Button>
      {hasDraft && onDelete ? (
        <Button type="button" variant="danger" disabled={busy} onClick={onDelete}>
          {deleting ? DEVIS_DELETING_LABEL : DEVIS_DELETE_LABEL}
        </Button>
      ) : null}
    </div>
  )
}
