import { TRPCError } from '@trpc/server'
import { facturationRepository } from '@/server/db/repositories/facturation.repository'
import { financeLineRepository } from '@/server/db/repositories/finance-line.repository'
import { devisRepository } from '@/server/db/repositories/devis.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { listPharmacyPickerOptions } from '@/server/read-models/pharmacy-picker'
import { listCandidatePickerOptions } from '@/server/read-models/candidate-picker'
import { listFacturationSuivi } from '@/lib/finance/list-facturation-suivi'
import { generateDevisFromFinanceLine } from '@/lib/finance/generate-devis-from-line'
import { buildFacturationOverview } from '@/view-models/facturation-overview'
import { makeFacturationRouter } from '@/server/routers/facturation'

async function loadSources() {
  const [missions, lines] = await Promise.all([
    facturationRepository.listMissions(),
    financeLineRepository.list(),
  ])
  return { missions, lines }
}

export const facturationRouter = makeFacturationRouter({
  listSuivi: async (filters) => {
    const { missions, lines } = await loadSources()
    return listFacturationSuivi(missions, filters, lines)
  },
  overview: async (filters) => {
    const { missions, lines } = await loadSources()
    return buildFacturationOverview(missions, filters, lines)
  },
  referentials: async () => {
    const [pharmacies, recruiters, candidates, missions] = await Promise.all([
      listPharmacyPickerOptions(),
      userRepository.listRecruiters(),
      listCandidatePickerOptions(),
      financeLineRepository.listMissionOptions(),
    ])
    return { pharmacies, recruiters, candidates, missions }
  },
  createLine: (input) => financeLineRepository.create(input),
  generateDevisFromLine: async (id) => {
    const line = await financeLineRepository.findById(id)
    if (!line) throw new TRPCError({ code: 'NOT_FOUND', message: 'Ligne introuvable' })
    return generateDevisFromFinanceLine(line, {
      findDraftByMission: (missionId) => devisRepository.findDraftByMission(missionId),
      createDraft: (data) => devisRepository.createDraft(data),
      updateDraft: (id, data) => devisRepository.updateDraft(id, data),
      attachDevis: (lineId, devisId) => financeLineRepository.setDevisId(lineId, devisId),
    })
  },
})
