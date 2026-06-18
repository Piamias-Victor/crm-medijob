import type { PharmacyStatus } from '@prisma/client'
import { Badge } from '@/components/atoms/Badge'
import { STATUS_BADGE, STATUS_LABELS } from '@/lib/pharmacy-options'

export function PharmacyStatusBadge({ status }: { status: PharmacyStatus }) {
  return <Badge variant={STATUS_BADGE[status]}>{STATUS_LABELS[status]}</Badge>
}
