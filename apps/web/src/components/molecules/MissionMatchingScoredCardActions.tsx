'use client'

import { cn } from '@/lib/cn'
import { compatibilityScoreStyle } from '@/view-models/compatibility-score-style'
import { MissionMatchingPipelineButton } from '@/components/molecules/MissionMatchingPipelineButton'
import { MissionMatchingProposeButton } from '@/components/molecules/MissionMatchingProposeButton'

type Props = {
  missionId: string
  candidateId: string
  score: number
  justification: string
  positioned: boolean
  proposed?: boolean
  pipelineLocked?: boolean
  onPositioned: () => void
  onProposed?: () => void
}

export function MissionMatchingScoredCardActions({
  missionId,
  candidateId,
  score,
  justification,
  positioned,
  proposed = false,
  pipelineLocked,
  onPositioned,
  onProposed,
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
      {pipelineLocked ? (
        <MissionMatchingProposeButton
          missionId={missionId}
          candidateId={candidateId}
          score={score}
          justification={justification}
          proposed={proposed}
          onProposed={() => onProposed?.()}
        />
      ) : (
        <MissionMatchingPipelineButton
          missionId={missionId}
          candidateId={candidateId}
          positioned={positioned}
          onPositioned={onPositioned}
        />
      )}
    </div>
  )
}
