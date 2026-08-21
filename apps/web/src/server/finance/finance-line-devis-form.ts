import { previewDevisFromLineForm } from '@/server/finance/preview-devis-from-line'
import { saveDevisFromLineForm } from '@/server/finance/save-devis-from-line'
import { sendDevisFromLineForm } from '@/server/finance/send-devis-from-form'
import { devisLiveDeps } from '@/server/routers/devis.adapter'
import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { devisRepository } from '@/server/db/repositories/devis.repository'
import type { FinanceLineDevisInput } from '@/view-models/finance-line.schema'

const formDeps = {
  ...devisLiveDeps,
  findPharmacy: async (id: string) => {
    const row = await pharmacyRepository.findById(id)
    return row ? { id: row.id, name: row.name } : null
  },
  findCandidate: async (id: string) => {
    const row = await candidateRepository.findById(id)
    return row ? { firstName: row.firstName, lastName: row.lastName } : null
  },
  findDevis: (id: string) => devisRepository.findById(id),
  createDraft: devisRepository.createDraft,
  updateDraft: devisRepository.updateDraft,
}

export function previewDevisFromForm(input: FinanceLineDevisInput) {
  return previewDevisFromLineForm(input, formDeps)
}

export function saveDevisFromForm(input: FinanceLineDevisInput) {
  return saveDevisFromLineForm(input, formDeps)
}

export function sendDevisFromForm(input: FinanceLineDevisInput, authorId: string) {
  return sendDevisFromLineForm(input, authorId, formDeps)
}
