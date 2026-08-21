import { Badge } from '@/components/atoms/Badge'
import { cn } from '@/lib/cn'
import type { CommercialStatus } from '@/lib/finance/derive-commercial-status'
import { COMMERCIAL_STATUS_BADGE, COMMERCIAL_STATUS_LABELS } from '@/view-models/commercial-status'

export function CommercialStatusBadge({
  status,
  className,
}: {
  status: CommercialStatus
  className?: string
}) {
  return (
    <Badge variant={COMMERCIAL_STATUS_BADGE[status]} className={cn(className)}>
      {COMMERCIAL_STATUS_LABELS[status]}
    </Badge>
  )
}
