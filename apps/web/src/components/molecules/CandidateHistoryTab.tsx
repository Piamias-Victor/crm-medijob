'use client'

import { useMemo, useState } from 'react'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { ActivityLogScope } from '@/view-models/activity-log.types'
import type { ActivityTypeValue } from '@/view-models/activity-log-form.schema'
import type { CandidateHistoryPositioning } from '@/view-models/candidate-history.types'
import { toCandidateHistoryItems } from '@/view-models/candidate-history'
import { ACTIVITY_TYPE_OPTIONS } from '@/view-models/activity-log.labels'
import { CheckboxGroup } from '@/components/molecules/CheckboxGroup'
import { ActivityLogForm } from '@/components/molecules/ActivityLogForm'
import { CandidateHistoryTimeline } from '@/components/molecules/CandidateHistoryTimeline'

type Props = {
  scope: ActivityLogScope
  initialLogs: ActivityLogRow[]
  positionings: CandidateHistoryPositioning[]
}

export function CandidateHistoryTab({ scope, initialLogs, positionings }: Props) {
  const [types, setTypes] = useState<string[]>([])
  const items = useMemo(() => {
    const selected = new Set(types as ActivityTypeValue[])
    const logs = types.length === 0 ? initialLogs : initialLogs.filter((log) => selected.has(log.type))
    return toCandidateHistoryItems(logs, positionings)
  }, [initialLogs, positionings, types])

  return (
    <div className="flex flex-col gap-6">
      <ActivityLogForm scope={scope} />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-fg">Filtrer par type</p>
        <CheckboxGroup options={ACTIVITY_TYPE_OPTIONS} values={types} onChange={setTypes} />
      </div>
      <CandidateHistoryTimeline items={items} isFiltered={types.length > 0} />
    </div>
  )
}
