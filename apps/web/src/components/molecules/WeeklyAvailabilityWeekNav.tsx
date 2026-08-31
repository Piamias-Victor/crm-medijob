'use client'

import Link from 'next/link'
import { WEEKLY_AVAILABILITY_COPY } from '@/view-models/weekly-availability-copy'
import { weekRangeLabel } from '@/view-models/weekly-availability-label'
import { adjacentWeekStart, weekHref } from '@/view-models/weekly-availability-path'

type Props = { token: string; weekStart: string }

export function WeeklyAvailabilityWeekNav({ token, weekStart }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Link href={weekHref(token, adjacentWeekStart(weekStart, -1))} className="text-sm text-fg-muted">
        {WEEKLY_AVAILABILITY_COPY.prevWeek}
      </Link>
      <p className="text-sm font-medium text-fg">{weekRangeLabel(weekStart)}</p>
      <Link href={weekHref(token, adjacentWeekStart(weekStart, 1))} className="text-sm text-fg-muted">
        {WEEKLY_AVAILABILITY_COPY.nextWeek}
      </Link>
    </div>
  )
}
