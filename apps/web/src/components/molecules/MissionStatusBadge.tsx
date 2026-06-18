import type { MissionStatus } from '@prisma/client'
import { Badge } from '@/components/atoms/Badge'
import { STATUS_BADGE, STATUS_LABELS } from '@/lib/mission-options'

export function MissionStatusBadge({ status }: { status: MissionStatus }) {
  return <Badge variant={STATUS_BADGE[status]}>{STATUS_LABELS[status]}</Badge>
}
