import { missionRepository } from '@/server/db/repositories/mission.repository'
import { findMissionQuickViewById } from '@/server/db/repositories/mission-quick-view.repo'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { runMissionStatusTransition } from '@/server/mission/transition-status.adapter'
import { loadMissionReferentials } from '@/server/read-models/mission-referentials'
import { listPharmacyPickerOptions } from '@/server/read-models/pharmacy-picker'
import { defaultLogLifecycle } from '@/server/activity-log/default-lifecycle'
import { makeMissionRouter } from '@/server/routers/mission'

export const missionRouter = makeMissionRouter({
  list: (filters) => missionRepository.list(filters),
  findDetailById: (id) => missionRepository.findDetailById(id),
  findQuickViewById: (id) => findMissionQuickViewById(id),
  update: (id, data) => missionRepository.update(id, data),
  createQuick: (input) =>
    missionRepository.createQuick({
      ...input,
      referentId: input.referentId ?? null,
      startDate: input.startDate ?? new Date(),
    }),
  createJobTitle: (name) => jobTitleRepository.create({ name }),
  referentials: () =>
    loadMissionReferentials({
      listJobTitles: () => jobTitleRepository.list(),
      listRecruiters: () => userRepository.listRecruiters(),
      listPharmacies: listPharmacyPickerOptions,
    }),
  updateStatus: (input) =>
    runMissionStatusTransition({
      missionId: input.id,
      status: input.status,
      placedCandidateId: input.placedCandidateId,
    }),
  logLifecycle: defaultLogLifecycle,
})
