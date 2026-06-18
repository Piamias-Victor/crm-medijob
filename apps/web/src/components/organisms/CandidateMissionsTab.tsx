import type { RawStage } from '@/view-models/candidate-kanban.types'
import { CandidateMissionsKanban } from '@/components/organisms/CandidateMissionsKanban'
import type { CandidateMissionRow } from '@/view-models/candidate-missions'

type Props = {
  candidateId: string
  stages: RawStage[]
  missions: CandidateMissionRow[]
}

export function CandidateMissionsTab({ candidateId, stages, missions }: Props) {
  return <CandidateMissionsKanban candidateId={candidateId} stages={stages} missions={missions} />
}
