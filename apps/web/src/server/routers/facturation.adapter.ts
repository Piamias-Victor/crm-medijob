import { facturationRepository } from '@/server/db/repositories/facturation.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { listPharmacyPickerOptions } from '@/server/read-models/pharmacy-picker'
import { listFacturationSuivi } from '@/lib/finance/list-facturation-suivi'
import { buildFacturationOverview } from '@/view-models/facturation-overview'
import { makeFacturationRouter } from '@/server/routers/facturation'

async function loadMissions() {
  return facturationRepository.listMissions()
}

export const facturationRouter = makeFacturationRouter({
  listSuivi: async (filters) => listFacturationSuivi(await loadMissions(), filters),
  overview: async (filters) => buildFacturationOverview(await loadMissions(), filters),
  referentials: async () => {
    const [pharmacies, recruiters] = await Promise.all([
      listPharmacyPickerOptions(),
      userRepository.listRecruiters(),
    ])
    return { pharmacies, recruiters }
  },
})
