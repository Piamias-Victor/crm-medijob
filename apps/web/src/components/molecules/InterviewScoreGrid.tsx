'use client'

import { InterviewScoreRow } from '@/components/molecules/InterviewScoreRow'
import { SectionCard } from '@/components/molecules/SectionCard'
import {
  INTERVIEW_SCORES_B,
  INTERVIEW_SCORES_C,
  INTERVIEW_SCORES_HINT,
  INTERVIEW_SCORES_TITLE,
} from '@/view-models/interview-copy'
import {
  interviewScoreRows,
  type InterviewScoreGroup,
  type InterviewScoreRowVm,
} from '@/view-models/interview-score-rows'

type Props = {
  scores: Record<string, number>
  maxes: Record<string, number>
  onChange: (id: string, value: number) => void
}

function ScoreGroup({
  title,
  group,
  rows,
  onChange,
}: {
  title: string
  group: InterviewScoreGroup
  rows: InterviewScoreRowVm[]
  onChange: (id: string, value: number) => void
}) {
  const items = rows.filter((row) => row.group === group)
  if (items.length === 0) return null
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">{title}</p>
      {items.map((row) => (
        <InterviewScoreRow key={row.id} row={row} onChange={onChange} />
      ))}
    </div>
  )
}

export function InterviewScoreGrid({ scores, maxes, onChange }: Props) {
  const rows = interviewScoreRows(scores, maxes)
  return (
    <SectionCard
      variant="glass"
      title={INTERVIEW_SCORES_TITLE}
      description={INTERVIEW_SCORES_HINT}
      bodyClassName="grid gap-6 p-4 sm:p-5 lg:grid-cols-2"
    >
      <ScoreGroup title={INTERVIEW_SCORES_B} group="B" rows={rows} onChange={onChange} />
      <ScoreGroup title={INTERVIEW_SCORES_C} group="C" rows={rows} onChange={onChange} />
    </SectionCard>
  )
}
