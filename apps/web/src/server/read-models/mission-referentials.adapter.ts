import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { loadMissionReferentials } from '@/server/read-models/mission-referentials'

export const fetchMissionReferentials = () =>
  loadMissionReferentials({
    listJobTitles: () => jobTitleRepository.list(),
    listRecruiters: () => userRepository.listRecruiters(),
  })
