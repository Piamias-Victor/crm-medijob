import { TRPCError } from '@trpc/server'
import { listFacturationSuivi } from '@/lib/finance/list-facturation-suivi'
import { generateDevisFromFinanceLine } from '@/lib/finance/generate-devis-from-line'
import { buildFacturationOverview } from '@/view-models/facturation-overview'
import type { FacturationDeps } from '@/server/routers/facturation'
import type { CreateFinanceLineInput } from '@/view-models/finance-line.schema'
import type { FinanceLineRecord } from '@/view-models/finance-line'
import type { DevisRecord, DevisWriteFields } from '@/view-models/devis'

const PHARMACY = { id: 'p1', name: 'Pharma Nord' }
const CANDIDATE = { id: 'c1', name: 'Ada Lovelace' }

export const financeLineInput: CreateFinanceLineInput = {
  pharmacyId: PHARMACY.id,
  candidateId: CANDIDATE.id,
  kind: 'PLACEMENT',
  amountHt: 5000,
  marge: 1500,
  occurredAt: new Date('2026-08-01T00:00:00Z'),
}

function draftFrom(data: DevisWriteFields & { missionId: string }, id: string): DevisRecord {
  return {
    id,
    missionId: data.missionId,
    kind: data.kind,
    status: 'DRAFT',
    hours: data.hours,
    hourlyRate: data.hourlyRate,
    amountHt: data.amountHt,
    amountTtc: data.amountTtc,
    htSource: data.htSource,
    sentAt: null,
    acceptedAt: null,
    invoicedAt: null,
    updatedAt: new Date(),
  }
}

export function makeMemoryFacturationDeps(): FacturationDeps {
  const lines: FinanceLineRecord[] = []
  let devisCount = 0
  return {
    listSuivi: async (filters) => listFacturationSuivi([], filters, lines),
    overview: async (filters) => buildFacturationOverview([], filters, lines),
    referentials: async () => ({
      pharmacies: [PHARMACY],
      recruiters: [],
      candidates: [CANDIDATE],
      missions: [{ id: 'm1', title: 'Mission Nord', pharmacyId: PHARMACY.id }],
    }),
    createLine: async (input) => {
      const line: FinanceLineRecord = {
        id: `line-${lines.length + 1}`,
        kind: input.kind,
        pharmacyId: input.pharmacyId,
        pharmacyName: PHARMACY.name,
        candidateId: input.candidateId,
        candidateName: CANDIDATE.name,
        missionId: input.missionId ?? null,
        devisId: null,
        amountHt: input.amountHt,
        marge: input.marge ?? null,
        occurredAt: input.occurredAt,
      }
      lines.unshift(line)
      return line
    },
    generateDevisFromLine: async (id) => {
      const line = lines.find((row) => row.id === id)
      if (!line) throw new TRPCError({ code: 'NOT_FOUND', message: 'Ligne introuvable' })
      return generateDevisFromFinanceLine(line, {
        findDraftByMission: async () => null,
        createDraft: async (data) => draftFrom(data, `d-${++devisCount}`),
        updateDraft: async (id, data) => draftFrom({ ...data, missionId: line.missionId ?? id }, id),
        attachDevis: async (lineId, devisId) => {
          const target = lines.find((row) => row.id === lineId)
          if (target) target.devisId = devisId
        },
      })
    },
  }
}
