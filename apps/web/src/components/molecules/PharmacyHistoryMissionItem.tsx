'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/atoms/Badge'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'
import { CONTRACT_TYPE_LABELS } from '@/lib/candidate-options'
import { formatActivityDate } from '@/view-models/activity-log-display'
import type { PharmacyHistoryMissionItem as MissionItem } from '@/view-models/pharmacy-history.types'

type Props = { entry: MissionItem }

export function PharmacyHistoryMissionItem({ entry }: Props) {
  const router = useRouter()

  return (
    <article className="relative border-l-2 border-accent-muted pb-6 pl-4 last:pb-0">
      <span className="absolute -left-[5px] top-1 size-2 rounded-full bg-accent" aria-hidden />
      <div className="flex flex-wrap items-center gap-2">
        <MissionStatusBadge status={entry.status} className="px-2 py-0 text-[11px]" />
        <Badge variant="sky" className="px-2 py-0 text-[11px]">
          {CONTRACT_TYPE_LABELS[entry.contractType]}
        </Badge>
        <time className="text-xs text-fg-muted" dateTime={entry.date.toISOString()}>
          {formatActivityDate(entry.date)}
        </time>
      </div>
      <button
        type="button"
        onClick={() => router.push(`/missions/${entry.id}`)}
        className="mt-2 text-left text-sm font-medium text-fg underline-offset-2 hover:underline"
      >
        {entry.title}
      </button>
      <p className="mt-1 text-xs text-fg-muted">{entry.jobTitle}</p>
    </article>
  )
}
