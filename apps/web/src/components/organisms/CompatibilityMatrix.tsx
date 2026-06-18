'use client'

import { CompatibilityMatrixLegend } from '@/components/molecules/CompatibilityMatrixLegend'
import { CompatibilityMissionBlock } from '@/components/molecules/CompatibilityMissionBlock'
import type { RefItem } from '@/view-models/referential'

type Props = {
  titles: RefItem[]
  scores: Map<string, number>
  onChange: (missionId: string, candidateId: string, score: number) => void
}

export function CompatibilityMatrix({ titles, scores, onChange }: Props) {
  if (titles.length === 0) {
    return <p className="text-sm text-fg-muted">Ajoutez des métiers pour configurer la matrice.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <CompatibilityMatrixLegend />
      <div className="flex flex-col gap-3">
        {titles.map((mission) => (
          <CompatibilityMissionBlock
            key={mission.id}
            mission={mission}
            candidates={titles}
            scores={scores}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  )
}
