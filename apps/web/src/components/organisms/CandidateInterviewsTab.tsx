import Link from 'next/link'
import { ClipboardList, Plus } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { Badge } from '@/components/atoms/Badge'
import {
  INTERVIEW_CTA,
  INTERVIEW_RESUME,
  INTERVIEW_TAB_EMPTY,
} from '@/view-models/interview-copy'
import { interviewDraftPath, interviewStartPath } from '@/view-models/interview-href'
import { accentButtonClassName } from '@/lib/button-styles'
import type { InterviewListRow } from '@/view-models/interview-list'

type Props = { candidateId: string; interviews: InterviewListRow[] }

export function CandidateInterviewsTab({ candidateId, interviews }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Link href={interviewStartPath(candidateId)} className={accentButtonClassName}>
          <Plus className="size-4" />
          {INTERVIEW_CTA}
        </Link>
      </div>
      {interviews.length === 0 ? (
        <EmptyState icon={ClipboardList} title={INTERVIEW_TAB_EMPTY} variant="compact" />
      ) : (
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
                {row.status === 'DRAFT' ? (
                  <Link
                    href={interviewDraftPath(candidateId, row.id)}
                    className="text-sm font-medium text-accent-hover"
                  >
                    {INTERVIEW_RESUME}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
