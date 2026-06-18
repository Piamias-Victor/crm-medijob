import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { pipelineStageRepository } from '@/server/db/repositories/pipeline-stage.repository'
import { loadCandidateReferentials } from '@/server/read-models/candidate-referentials'

export function fetchCandidateReferentials() {
  return loadCandidateReferentials({
    listJobTitles: () => jobTitleRepository.list(),
    listSoftwares: () => softwareRepository.list(),
    listRecruiters: () => userRepository.listRecruiters(),
    listPipelineStages: () => pipelineStageRepository.list(),
  })
}
