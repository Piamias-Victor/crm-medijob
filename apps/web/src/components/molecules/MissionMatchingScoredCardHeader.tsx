'use client'

import { Avatar } from '@/components/atoms/Avatar'
import { CandidateDetailLink } from '@/components/molecules/CandidateDetailLink'
import { cn } from '@/lib/cn'
import { compatibilityScoreStyle } from '@/view-models/compatibility-score-style'

type Props = {
  candidateId: string
  fullName: string
  jobTitle: string
  city: string | null
  salaryLabel: string | null
  score: number
}

export function MissionMatchingScoredCardHeader({
  candidateId,
  fullName,
  jobTitle,
  city,
  salaryLabel,
  score,
}: Props) {
  return (
    <div className="flex items-start gap-3">
      <Avatar name={fullName} className="size-10 text-xs" />
      <div className="min-w-0 flex-1">
        <CandidateDetailLink
          candidateId={candidateId}
          className="truncate font-semibold text-fg underline-offset-2 hover:underline"
        >
          {fullName}
        </CandidateDetailLink>
        <p className="truncate text-xs text-fg-muted">
          {jobTitle}
          {city ? ` · ${city}` : ''}
          {salaryLabel ? ` · ${salaryLabel}` : ''}
        </p>
      </div>
      <span
        className={cn(
          'shrink-0 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums sm:hidden',
          compatibilityScoreStyle(score),
        )}
      >
        {score}%
      </span>
    </div>
  )
}
