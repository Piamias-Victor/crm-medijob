'use client'

import { useMemo, useState, type ReactNode } from 'react'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { ActivityLogScope } from '@/view-models/activity-log.types'
import { ACTIVITY_LOG_FILTER_LABEL, ACTIVITY_TYPE_OPTIONS } from '@/view-models/activity-log.labels'
import { filterActivityLogsByTypes } from '@/view-models/filter-activity-logs'
import { CheckboxGroup } from '@/components/molecules/CheckboxGroup'
import { ActivityLogForm } from '@/components/molecules/ActivityLogForm'

type Props = {
  scope: ActivityLogScope
  initialLogs: ActivityLogRow[]
  children: (logs: ActivityLogRow[], isFiltered: boolean) => ReactNode
}

export function ActivityLogFilterShell({ scope, initialLogs, children }: Props) {
  const [types, setTypes] = useState<string[]>([])
  const logs = useMemo(
    () => filterActivityLogsByTypes(initialLogs, types),
    [initialLogs, types],
  )

  return (
    <div className="flex flex-col gap-6">
      <ActivityLogForm scope={scope} />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-fg">{ACTIVITY_LOG_FILTER_LABEL}</p>
        <CheckboxGroup options={ACTIVITY_TYPE_OPTIONS} values={types} onChange={setTypes} />
      </div>
      {children(logs, types.length > 0)}
    </div>
  )
}
