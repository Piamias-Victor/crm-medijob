import type { DevisView } from '@/view-models/devis'
import type { CommercialStatus } from '@/lib/finance/derive-commercial-status'
import { DEVIS_ACCEPT_LABEL, DEVIS_ACCEPTING_LABEL, DEVIS_CURRENT_LABEL, CA_LABEL } from '@/view-models/devis-copy'
import { devisCurrentSummary } from '@/view-models/devis-current'
import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import { CommercialStatusBadge } from '@/components/molecules/CommercialStatusBadge'
import { Button } from '@/components/atoms/Button'

type Props = {
  current: DevisView | null
  commercialStatus: CommercialStatus
  ca: number
  canAccept?: boolean
  accepting?: boolean
  onAccept?: () => void
}

export function DevisCurrentCard({
  current,
  commercialStatus,
  ca,
  canAccept,
  accepting,
  onAccept,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-accent bg-surface px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-accent-hover">{DEVIS_CURRENT_LABEL}</p>
        <CommercialStatusBadge status={commercialStatus} />
      </div>
      {current ? <p className="text-sm text-fg">{devisCurrentSummary(current)}</p> : null}
      <p className="text-sm text-fg">
        {CA_LABEL} {formatDevisPdfAmount(ca)}
      </p>
      {canAccept && onAccept ? (
        <div>
          <Button type="button" variant="accent" disabled={accepting} onClick={onAccept}>
            {accepting ? DEVIS_ACCEPTING_LABEL : DEVIS_ACCEPT_LABEL}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
