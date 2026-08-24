import { facturationRepository } from '@/server/db/repositories/facturation.repository'
import { financeLineRepository } from '@/server/db/repositories/finance-line.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { listPharmacyPickerOptions } from '@/server/read-models/pharmacy-picker'
import { listCandidatePickerOptions } from '@/server/read-models/candidate-picker'
import { listFacturationSuivi } from '@/lib/finance/list-facturation-suivi'
import { listFinanceLines } from '@/lib/finance/list-finance-lines'
import { buildFacturationOverview } from '@/view-models/facturation-overview'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { generateDevisFromLineId, sendDevisFromLineId } from '@/server/finance/finance-line-devis'
import {
  previewDevisFromForm,
  saveDevisFromForm,
  sendDevisFromForm,
} from '@/server/finance/finance-line-devis-form'
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
  listLines: async (filters) => {
    const { lines } = await loadSources()
    return listFinanceLines(lines, filters)
  },
  overview: async (filters) => {
    const { missions, lines } = await loadSources()
    return buildFacturationOverview(missions, filters, lines)
  },
  pilotage: async (filters) => {
    const { missions, lines } = await loadSources()
    return buildPilotage(lines, missions, filters)
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
  generateDevisFromLine: generateDevisFromLineId,
  sendDevisFromLine: sendDevisFromLineId,
  previewDevis: previewDevisFromForm,
  saveDevis: saveDevisFromForm,
  sendDevis: sendDevisFromForm,
  cancelLine: (id) => financeLineRepository.setCancelled(id, true),
  restoreLine: (id) => financeLineRepository.setCancelled(id, false),
  setInvoiced: (id, invoiced) => financeLineRepository.setInvoiced(id, invoiced),
  setPaid: (id, paid) => financeLineRepository.setPaid(id, paid),
})
