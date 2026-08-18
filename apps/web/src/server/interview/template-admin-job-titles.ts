import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import type { JobTitleKeyStore } from '@/server/interview/working-copy-create'

export const liveJobTitleKeyStore: JobTitleKeyStore = {
  findById: async (id) => {
    const row = await jobTitleRepository.findById(id)
    return row ? { id: row.id, name: row.name, profileKey: row.profileKey } : null
  },
  findByProfileKey: async (key) => {
    const row = await jobTitleRepository.findByProfileKey(key)
    return row ? { id: row.id } : null
  },
  setProfileKey: async (id, profileKey) => {
    await jobTitleRepository.update(id, { profileKey })
  },
}
