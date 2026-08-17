import type { RefItem } from '@/view-models/referential'
import type { RawStage } from '@/view-models/candidate-kanban.types'

export type CandidateDetailReferentials = {
  jobTitles: RefItem[]
  softwares: RefItem[]
  recruiters: RefItem[]
  pipelineStages: RawStage[]
}
