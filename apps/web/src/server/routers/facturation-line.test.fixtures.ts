import { listFacturationSuivi } from '@/lib/finance/list-facturation-suivi'
import { listFinanceLines } from '@/lib/finance/list-finance-lines'
import { buildFacturationOverview } from '@/view-models/facturation-overview'
import { memoryLineDevisMutations } from '@/server/routers/facturation-line.test.mutations'
import { memoryFormDevis } from '@/server/routers/facturation-line.test.form-devis'
import { memoryLineStatus } from '@/server/routers/facturation-line.test.status'
import type { FacturationDeps } from '@/server/routers/facturation'
import type { CreateFinanceLineInput } from '@/view-models/finance-line.schema'
import type { FinanceLineRecord } from '@/view-models/finance-line'

const PHARMACY = { id: 'p1', name: 'Pharma Nord' }
const CANDIDATE = { id: 'c1', name: 'Ada Lovelace' }
const RECRUITERS = [{ id: 'u-alice', name: 'Alice' }]

export const financeLineInput: CreateFinanceLineInput = {
  pharmacyId: PHARMACY.id,
  candidateId: CANDIDATE.id,
  kind: 'PLACEMENT',
  placementContractType: 'CDD',
  amountHt: 5000,
  marge: 1500,
  occurredAt: new Date('2026-08-01T00:00:00Z'),
}

export const financeLineDevisInput = {
  pharmacyId: PHARMACY.id,
  candidateId: CANDIDATE.id,
  kind: 'PLACEMENT' as const,
  amountHt: 5000,
  htSource: 'TYPED' as const,
}

export function makeMemoryFacturationDeps(): FacturationDeps {
  const lines: FinanceLineRecord[] = []
  const lineDevis = memoryLineDevisMutations(lines)
  const formDevis = memoryFormDevis(PHARMACY, CANDIDATE.id)
  const lineStatus = memoryLineStatus(lines)
  return {
    listSuivi: async (filters) => listFacturationSuivi([], filters, lines),
    listLines: async (filters) => listFinanceLines(lines, filters),
    overview: async (filters) => buildFacturationOverview([], filters, lines),
    referentials: async () => ({
      pharmacies: [PHARMACY],
      recruiters: RECRUITERS,
      candidates: [CANDIDATE],
      missions: [{ id: 'm1', title: 'Mission Nord', pharmacyId: PHARMACY.id, contractType: 'CDD' }],
    }),
    createLine: async (input) => {
      const line: FinanceLineRecord = {
        id: `line-${lines.length + 1}`,
        kind: input.kind,
        pharmacyId: input.pharmacyId,
        pharmacyName: PHARMACY.name,
        candidateId: input.candidateId,
        candidateName: CANDIDATE.name,
        jobTitle: 'Pharmacien',
        missionId: input.missionId ?? null,
        devisId: input.devisId ?? null,
        hours: input.hours ?? null,
        hourlyRate: input.hourlyRate ?? null,
        amountHt: input.amountHt,
        htSource: input.htSource ?? 'TYPED',
        marge: input.marge ?? null,
        occurredAt: input.occurredAt,
        devisStatus: input.devisId ? (formDevis.statusOf(input.devisId) ?? 'DRAFT') : null,
        referentId: input.referentId ?? null,
        referentName: RECRUITERS.find((row) => row.id === input.referentId)?.name ?? null,
        placementContractType: input.placementContractType ?? null,
        cancelled: false,
        invoiced: false,
        paid: false,
      }
      lines.unshift(line)
      return line
    },
    generateDevisFromLine: lineDevis.generateDevisFromLine,
    sendDevisFromLine: lineDevis.sendDevisFromLine,
    previewDevis: formDevis.previewDevis,
    saveDevis: formDevis.saveDevis,
    sendDevis: formDevis.sendDevis,
    cancelLine: lineStatus.cancelLine,
    restoreLine: lineStatus.restoreLine,
    setInvoiced: lineStatus.setInvoiced,
    setPaid: lineStatus.setPaid,
  }
}
