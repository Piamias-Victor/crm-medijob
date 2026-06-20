'use client'

import { cn } from '@/lib/cn'
import { compatibilityScoreStyle } from '@/view-models/compatibility-score-style'
import { MissionMatchingPipelineButton } from '@/components/molecules/MissionMatchingPipelineButton'

type Props = {
  missionId: string
  candidateId: string
  score: number
  positioned: boolean
  pipelineLocked?: boolean
  onPositioned: () => void
}

export function MissionMatchingScoredCardActions({
  missionId,
  candidateId,
  score,
  positioned,
  pipelineLocked,
  onPositioned,
}: Props) {
  return (
    <div className="flex items-center gap-3 border-t border-border/45 bg-surface/30 p-4 sm:w-44 sm:flex-col sm:justify-center sm:border-l sm:border-t-0">
      <span
        className={cn(
          'hidden rounded-full px-3 py-1 text-sm font-bold tabular-nums sm:inline-flex',
          compatibilityScoreStyle(score),
        )}
      >
        {score}%
      </span>
      <MissionMatchingPipelineButton
        missionId={missionId}
        candidateId={candidateId}
        positioned={positioned}
        disabled={pipelineLocked}
        onPositioned={onPositioned}
      />
    </div>
  )
}
