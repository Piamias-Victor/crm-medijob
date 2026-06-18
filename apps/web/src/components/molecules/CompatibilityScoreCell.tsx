'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import {
  compatibilityScoreBarStyle,
  compatibilityScoreStyle,
} from '@/view-models/compatibility-score-style'

type Props = {
  missionName: string
  candidateName: string
  score: number
  onChange: (score: number) => void
}

export function CompatibilityScoreCell({
  missionName,
  candidateName,
  score,
  onChange,
}: Props) {
  const [local, setLocal] = useState(score)
  useEffect(() => setLocal(score), [score])

  const label = `Compatibilité ${missionName} → ${candidateName}`
  const commit = () => {
    if (local !== score) onChange(local)
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border border-border/50 p-3 transition-colors',
        compatibilityScoreStyle(local),
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-fg">{candidateName}</span>
        <span className="shrink-0 text-sm font-semibold tabular-nums">{local} %</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/60">
        <div
          className={cn('h-full rounded-full transition-all', compatibilityScoreBarStyle(local))}
          style={{ width: `${local}%` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={local}
        aria-label={label}
        className="w-full accent-accent"
        onChange={(e) => setLocal(Number(e.target.value))}
        onMouseUp={commit}
        onTouchEnd={commit}
        onKeyUp={commit}
      />
    </div>
  )
}
