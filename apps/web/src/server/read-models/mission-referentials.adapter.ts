import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { loadMissionReferentials } from '@/server/read-models/mission-referentials'

export const fetchMissionReferentials = () =>
  loadMissionReferentials({
    listJobTitles: () => jobTitleRepository.list(),
    listRecruiters: () => userRepository.listRecruiters(),
    listPharmacies: async () => {
      const rows = await pharmacyRepository.list()
      return rows.map((p) => ({ id: p.id, name: p.name }))
    },
  })
