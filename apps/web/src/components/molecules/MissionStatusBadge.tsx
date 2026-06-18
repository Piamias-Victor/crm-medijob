import type { MissionStatus } from '@prisma/client'
import { Badge } from '@/components/atoms/Badge'
import { cn } from '@/lib/cn'
import { STATUS_BADGE, STATUS_LABELS } from '@/lib/mission-options'

export function MissionStatusBadge({
  status,
  className,
}: {
  status: MissionStatus
  className?: string
}) {
  return (
    <Badge variant={STATUS_BADGE[status]} className={cn(className)}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
