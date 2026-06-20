'use client'

import { Quote } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { MATCHING_FIELD_LABELS } from '@/lib/candidate-options'
import { cn } from '@/lib/cn'
import { compatibilityScoreBarStyle } from '@/view-models/compatibility-score-style'

type Props = {
  score: number
  justification: string
  missingFields: string[]
}

export function MissionMatchingScoredCardBody({ score, justification, missingFields }: Props) {
  return (
    <>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/40">
        <div
          className={cn('h-full rounded-full', compatibilityScoreBarStyle(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-3 flex gap-2 text-sm leading-relaxed text-fg-muted">
        <Quote className="mt-0.5 size-4 shrink-0 text-accent/70" aria-hidden />
        {justification}
      </p>
      {missingFields.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {missingFields.map((field) => (
            <Badge key={field} variant="warning">
              {MATCHING_FIELD_LABELS[field] ?? field}
            </Badge>
          ))}
        </div>
      ) : null}
    </>
  )
}
