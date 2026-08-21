'use client'

import type { ActivityLogRow } from '@/view-models/activity-log'
import type { ActivityLogScope } from '@/view-models/activity-log.types'
import type { CandidateHistoryPositioning } from '@/view-models/candidate-history.types'
import { toCandidateHistoryItems } from '@/view-models/candidate-history'
import { ActivityLogFilterShell } from '@/components/molecules/ActivityLogFilterShell'
import { CandidateHistoryTimeline } from '@/components/molecules/CandidateHistoryTimeline'

type Props = {
  scope: ActivityLogScope
  initialLogs: ActivityLogRow[]
  positionings: CandidateHistoryPositioning[]
}

export function CandidateHistoryTab({ scope, initialLogs, positionings }: Props) {
  return (
    <ActivityLogFilterShell scope={scope} initialLogs={initialLogs}>
      {(logs, isFiltered) => (
        <CandidateHistoryTimeline
          items={toCandidateHistoryItems(logs, positionings)}
          isFiltered={isFiltered}
        />
      )}
    </ActivityLogFilterShell>
  )
}
