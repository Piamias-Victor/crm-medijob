import { devisRepository } from '@/server/db/repositories/devis.repository'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import { makeDevisRouter } from '@/server/routers/devis'

async function findMission(id: string) {
  const mission = await missionRepository.findById(id)
  return mission ? { id: mission.id, contractType: mission.contractType } : null
}

export const devisRouter = makeDevisRouter({
  findMission,
  findDraftByMission: (missionId) => devisRepository.findDraftByMission(missionId),
  createDraft: (data) => devisRepository.createDraft(data),
  updateDraft: (id, data) => devisRepository.updateDraft(id, data),
})
