'use client'

import { useMemo, useState } from 'react'
import type { ActivityType } from '@prisma/client'
import { ActivityLogForm } from '@/components/molecules/ActivityLogForm'
import { ActivityTimeline } from '@/components/molecules/ActivityTimeline'
import { ActivityTypeFilter } from '@/components/molecules/ActivityTypeFilter'
import type { ActivityLogRow } from '@/view-models/activity-log'

type Props = {
  candidateId: string
  activities: ActivityLogRow[]
}

export function CandidateHistoryTab({ candidateId, activities }: Props) {
  const [filter, setFilter] = useState('ALL')
  const filtered = useMemo(() => {
    if (filter === 'ALL') return activities
    return activities.filter((entry) => entry.type === (filter as ActivityType))
  }, [activities, filter])

  return (
    <div className="flex flex-col gap-6">
      <ActivityLogForm candidateId={candidateId} />
      <div className="grid gap-4 sm:grid-cols-[minmax(0,16rem)_1fr] sm:items-end">
        <ActivityTypeFilter value={filter} onChange={setFilter} />
        <p className="text-sm text-fg-muted sm:text-right">
          {filtered.length} activité{filtered.length > 1 ? 's' : ''}
        </p>
      </div>
      <ActivityTimeline items={filtered} isFiltered={filter !== 'ALL'} />
    </div>
  )
}
