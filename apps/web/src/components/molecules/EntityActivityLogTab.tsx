'use client'

import type { ActivityLogRow } from '@/view-models/activity-log'
import type { ActivityLogScope } from '@/view-models/activity-log.types'
import { ActivityLogFilterShell } from '@/components/molecules/ActivityLogFilterShell'
import { ActivityTimeline } from '@/components/molecules/ActivityTimeline'

type Props = {
  scope: ActivityLogScope
  initialLogs: ActivityLogRow[]
}

export function EntityActivityLogTab({ scope, initialLogs }: Props) {
  return (
    <ActivityLogFilterShell scope={scope} initialLogs={initialLogs}>
      {(logs, isFiltered) => <ActivityTimeline items={logs} isFiltered={isFiltered} />}
    </ActivityLogFilterShell>
  )
}
