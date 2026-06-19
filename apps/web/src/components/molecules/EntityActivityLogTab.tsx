'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { ActivityLogScope } from '@/view-models/activity-log.types'
import type { ActivityTypeValue } from '@/view-models/activity-log-form.schema'
import { CheckboxGroup } from '@/components/molecules/CheckboxGroup'
import { ACTIVITY_TYPE_OPTIONS } from '@/view-models/activity-log.labels'
import { ActivityLogForm } from '@/components/molecules/ActivityLogForm'
import { ActivityTimeline } from '@/components/molecules/ActivityTimeline'

type Props = {
  scope: ActivityLogScope
  initialLogs: ActivityLogRow[]
}

export function EntityActivityLogTab({ scope, initialLogs }: Props) {
  const [types, setTypes] = useState<string[]>([])
  const listInput = {
    ...scope,
    ...(types.length ? { types: types as ActivityTypeValue[] } : {}),
  }
  const { data: logs = initialLogs } = trpc.activityLog.listByEntity.useQuery(listInput, {
    initialData: initialLogs,
  })

  return (
    <div className="flex flex-col gap-6">
      <ActivityLogForm scope={scope} />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-fg">Filtrer par type</p>
        <CheckboxGroup options={ACTIVITY_TYPE_OPTIONS} values={types} onChange={setTypes} />
      </div>
      <ActivityTimeline items={logs} isFiltered={types.length > 0} />
    </div>
  )
}
