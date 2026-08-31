'use client'

import type { ActivityLogRow } from '@/view-models/activity-log'
import type { ActivityLogScope } from '@/view-models/activity-log.types'
import type { CandidateHistoryPositioning } from '@/view-models/candidate-history.types'
import { toCandidateHistoryItems } from '@/view-models/candidate-history'
import { ActivityLogFilterShell } from '@/components/molecules/ActivityLogFilterShell'
import { CandidateHistoryTimeline } from '@/components/molecules/CandidateHistoryTimeline'
import { BadakanCommentList } from '@/components/molecules/BadakanCommentList'
import {
  BADAKAN_COMMENTS_TITLE,
  type BadakanCommentRow,
} from '@/view-models/badakan-comment'

type Props = {
  scope: ActivityLogScope
  initialLogs: ActivityLogRow[]
  positionings: CandidateHistoryPositioning[]
  comments: BadakanCommentRow[]
}

export function CandidateHistoryTab({ scope, initialLogs, positionings, comments }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-fg">{BADAKAN_COMMENTS_TITLE}</h3>
        <BadakanCommentList comments={comments} />
      </section>
      <ActivityLogFilterShell scope={scope} initialLogs={initialLogs}>
        {(logs, isFiltered) => (
          <CandidateHistoryTimeline
            items={toCandidateHistoryItems(logs, positionings)}
            isFiltered={isFiltered}
          />
        )}
      </ActivityLogFilterShell>
    </div>
  )
}
