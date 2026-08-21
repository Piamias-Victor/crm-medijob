'use client'

import type { ActivityLogRow } from '@/view-models/activity-log'
import type { ActivityLogScope } from '@/view-models/activity-log.types'
import type { PharmacyMissionRow } from '@/view-models/pharmacy-detail.types'
import { toPharmacyHistoryItems } from '@/view-models/pharmacy-history'
import { ActivityLogFilterShell } from '@/components/molecules/ActivityLogFilterShell'
import { PharmacyHistoryTimeline } from '@/components/molecules/PharmacyHistoryTimeline'

type Props = {
  scope: ActivityLogScope
  initialLogs: ActivityLogRow[]
  terminalMissions: PharmacyMissionRow[]
}

export function PharmacyHistoryTab({ scope, initialLogs, terminalMissions }: Props) {
  return (
    <ActivityLogFilterShell scope={scope} initialLogs={initialLogs}>
      {(logs, isFiltered) => (
        <PharmacyHistoryTimeline
          items={toPharmacyHistoryItems(logs, terminalMissions)}
          isFiltered={isFiltered}
        />
      )}
    </ActivityLogFilterShell>
  )
}
