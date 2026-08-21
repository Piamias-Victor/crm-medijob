import { TRPCError } from '@trpc/server'
import { financeLineRepository } from '@/server/db/repositories/finance-line.repository'
import { devisRepository } from '@/server/db/repositories/devis.repository'
import { generateDevisFromFinanceLine } from '@/lib/finance/generate-devis-from-line'
import { sendDevisFromFinanceLine } from '@/server/finance/send-devis-from-line'
import { devisLiveDeps } from '@/server/routers/devis.adapter'

const generateDeps = {
  findDraftByMission: devisRepository.findDraftByMission,
  createDraft: devisRepository.createDraft,
  updateDraft: devisRepository.updateDraft,
  attachDevis: (lineId: string, devisId: string) =>
    financeLineRepository.setDevisId(lineId, devisId),
}

export async function generateDevisFromLineId(id: string) {
  const line = await financeLineRepository.findById(id)
  if (!line) throw new TRPCError({ code: 'NOT_FOUND', message: 'Ligne introuvable' })
  return generateDevisFromFinanceLine(line, generateDeps)
}

export function sendDevisFromLineId(id: string, authorId: string) {
  return sendDevisFromFinanceLine(id, authorId, {
    ...devisLiveDeps,
    ...generateDeps,
    findLine: (id: string) => financeLineRepository.findById(id),
    findDevis: (id: string) => devisRepository.findById(id),
  })
}
