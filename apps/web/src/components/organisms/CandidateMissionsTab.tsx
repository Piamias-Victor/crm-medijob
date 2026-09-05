import type { RawStage } from '@/view-models/candidate-kanban.types'
import { CandidateMissionsKanban } from '@/components/organisms/CandidateMissionsKanban'
import { CandidateBadakanMissions } from '@/components/organisms/CandidateBadakanMissions'
import type { CandidateMissionRow } from '@/view-models/candidate-missions'

type Props = {
  candidateId: string
  stages: RawStage[]
  missions: CandidateMissionRow[]
}

export function CandidateMissionsTab({ candidateId, stages, missions }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <CandidateMissionsKanban candidateId={candidateId} stages={stages} missions={missions} />
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-fg">Missions intérim Badakan</h3>
        <CandidateBadakanMissions candidateId={candidateId} />
      </section>
    </div>
  )
}
