'use client'

import { cn } from '@/lib/cn'
import { Slider } from '@/components/atoms/Slider'
import {
  compatibilityScoreBarStyle,
  compatibilityScoreStyle,
} from '@/view-models/compatibility-score-style'
import {
  interviewScorePercent,
  type InterviewScoreRowVm,
} from '@/view-models/interview-score-rows'

type Props = {
  row: InterviewScoreRowVm
  onChange: (id: string, value: number) => void
}

export function InterviewScoreRow({ row, onChange }: Props) {
  const max = Math.max(row.max, row.earned, 1)
  const percent = interviewScorePercent(row.earned, row.max)
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border border-border/50 p-3 transition-colors',
        compatibilityScoreStyle(percent),
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium text-fg">{row.label}</span>
        <span className="shrink-0 text-sm font-semibold tabular-nums">{percent} %</span>
      </div>
      <p className="text-xs tabular-nums text-fg-muted">
        {row.earned} / {row.max}
      </p>
      <Slider
        label={row.label}
        min={0}
        max={max}
        value={Math.min(row.earned, max)}
        fillClassName={compatibilityScoreBarStyle(percent)}
        onChange={(value) => onChange(row.id, value)}
      />
    </div>
  )
}
