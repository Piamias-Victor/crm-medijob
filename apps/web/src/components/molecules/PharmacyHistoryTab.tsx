'use client'

import { useMemo, useState } from 'react'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { ActivityLogScope } from '@/view-models/activity-log.types'
import type { ActivityTypeValue } from '@/view-models/activity-log-form.schema'
import type { PharmacyMissionRow } from '@/view-models/pharmacy-detail.types'
import { toPharmacyHistoryItems } from '@/view-models/pharmacy-history'
import { ACTIVITY_TYPE_OPTIONS } from '@/view-models/activity-log.labels'
import { CheckboxGroup } from '@/components/molecules/CheckboxGroup'
import { ActivityLogForm } from '@/components/molecules/ActivityLogForm'
import { PharmacyHistoryTimeline } from '@/components/molecules/PharmacyHistoryTimeline'

type Props = {
  scope: ActivityLogScope
  initialLogs: ActivityLogRow[]
  terminalMissions: PharmacyMissionRow[]
}

export function PharmacyHistoryTab({ scope, initialLogs, terminalMissions }: Props) {
  const [types, setTypes] = useState<string[]>([])
  const items = useMemo(() => {
    const selected = new Set(types as ActivityTypeValue[])
    const logs = types.length === 0 ? initialLogs : initialLogs.filter((log) => selected.has(log.type))
    return toPharmacyHistoryItems(logs, terminalMissions)
  }, [initialLogs, terminalMissions, types])

  return (
    <div className="flex flex-col gap-6">
      <ActivityLogForm scope={scope} />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-fg">Filtrer par type</p>
        <CheckboxGroup options={ACTIVITY_TYPE_OPTIONS} values={types} onChange={setTypes} />
      </div>
      <PharmacyHistoryTimeline items={items} isFiltered={types.length > 0} />
    </div>
  )
}
