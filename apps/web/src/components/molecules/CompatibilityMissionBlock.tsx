import { CompatibilityScoreCell } from '@/components/molecules/CompatibilityScoreCell'
import { compatibilityKey } from '@/view-models/compatibility-matrix'
import type { RefItem } from '@/view-models/referential'

type Props = {
  mission: RefItem
  candidates: RefItem[]
  scores: Map<string, number>
  onChange: (missionId: string, candidateId: string, score: number) => void
}

export function CompatibilityMissionBlock({ mission, candidates, scores, onChange }: Props) {
  return (
    <div className="rounded-xl border border-border/50 bg-white/80 p-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-fg">
        Mission · <span className="text-accent-hover">{mission.name}</span>
      </p>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {candidates.map((candidate) => (
          <CompatibilityScoreCell
            key={candidate.id}
            missionName={mission.name}
            candidateName={candidate.name}
            score={scores.get(compatibilityKey(mission.id, candidate.id)) ?? 0}
            onChange={(score) => onChange(mission.id, candidate.id, score)}
          />
        ))}
      </div>
    </div>
  )
}
