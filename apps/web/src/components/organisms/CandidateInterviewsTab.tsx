import { ClipboardList } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { Badge } from '@/components/atoms/Badge'
import { INTERVIEW_TAB_EMPTY } from '@/view-models/interview-copy'
import type { InterviewListRow } from '@/view-models/interview-list'

type Props = { interviews: InterviewListRow[] }

export function CandidateInterviewsTab({ interviews }: Props) {
  if (interviews.length === 0) {
    return <EmptyState icon={ClipboardList} title={INTERVIEW_TAB_EMPTY} variant="compact" />
  }

  return (
    <ul className="flex flex-col gap-2">
      {interviews.map((row) => (
        <li
          key={row.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/55 bg-surface/90 px-4 py-3 text-sm shadow-sm"
        >
          <p className="font-medium text-fg">{row.dateLabel}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">{row.modeLabel}</Badge>
            <Badge>{row.statusLabel}</Badge>
            {row.decisionLabel ? <Badge>{row.decisionLabel}</Badge> : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
