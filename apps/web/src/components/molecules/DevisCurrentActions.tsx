'use client'

import { Button } from '@/components/atoms/Button'
import {
  DEVIS_ACCEPT_LABEL,
  DEVIS_ACCEPTING_LABEL,
  DEVIS_PREVIEW_LABEL,
  DEVIS_PREVIEWING_LABEL,
  DEVIS_SEND_LABEL,
  DEVIS_SENDING_LABEL,
} from '@/view-models/devis-copy'

type Props = {
  previewing?: boolean
  sending?: boolean
  accepting?: boolean
  onPreview?: () => void
  onSend?: () => void
  onAccept?: () => void
}

export function DevisCurrentActions({
  previewing,
  sending,
  accepting,
  onPreview,
  onSend,
  onAccept,
}: Props) {
  const busy = Boolean(previewing || sending || accepting)
  if (!onPreview && !onSend && !onAccept) return null
  return (
    <div className="flex flex-wrap gap-2">
      {onPreview ? (
        <Button type="button" variant="outline" disabled={busy} onClick={onPreview}>
          {previewing ? DEVIS_PREVIEWING_LABEL : DEVIS_PREVIEW_LABEL}
        </Button>
      ) : null}
      {onSend ? (
        <Button type="button" variant="accent" disabled={busy} onClick={onSend}>
          {sending ? DEVIS_SENDING_LABEL : DEVIS_SEND_LABEL}
        </Button>
      ) : null}
      {onAccept ? (
        <Button type="button" variant="accent" disabled={busy} onClick={onAccept}>
          {accepting ? DEVIS_ACCEPTING_LABEL : DEVIS_ACCEPT_LABEL}
        </Button>
      ) : null}
    </div>
  )
}
