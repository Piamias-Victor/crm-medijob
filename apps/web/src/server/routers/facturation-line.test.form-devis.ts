import { previewDevisFromLineForm } from '@/server/finance/preview-devis-from-line'
import { saveDevisFromLineForm } from '@/server/finance/save-devis-from-line'
import { toDevisView, type DevisRecord, type DevisWriteFields } from '@/view-models/devis'
import type { FinanceLineDevisInput } from '@/view-models/finance-line.schema'
import type { SendDevisFromLineResult } from '@/server/finance/send-devis-from-line'

function draftFrom(data: DevisWriteFields & { missionId: string | null }, id: string): DevisRecord {
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

const SENT_DOC = {
  id: 'doc-1',
  url: 'https://blob.example/devis.pdf',
  name: 'Devis.pdf',
  category: 'DEVIS' as const,
  mimeType: 'application/pdf' as const,
}

export function memoryFormDevis(pharmacy: { id: string; name: string }, candidateId: string) {
  const drafts: DevisRecord[] = []
  let count = 0
  const deps = {
    findMission: async (id: string) =>
      id === 'm1'
        ? {
            id,
            title: 'Mission Nord',
            pharmacyId: pharmacy.id,
            pharmacyName: pharmacy.name,
            contact: null,
          }
        : null,
    findPharmacy: async (id: string) => (id === pharmacy.id ? pharmacy : null),
    findCandidate: async (id: string) =>
      id === candidateId ? { firstName: 'Ada', lastName: 'Lovelace' } : null,
    findPrimaryContact: async () => null,
    findDevis: async (id: string) => drafts.find((row) => row.id === id) ?? null,
    findDraftByMission: async (missionId: string) =>
      drafts.find((row) => row.missionId === missionId && row.status === 'DRAFT') ?? null,
    createDraft: async (data: DevisWriteFields & { missionId: string | null }) => {
      const row = draftFrom(data, `form-d-${++count}`)
      drafts.push(row)
      return row
    },
    updateDraft: async (id: string, data: DevisWriteFields) => {
      const row = drafts.find((item) => item.id === id)
      if (!row) throw new Error('Devis introuvable')
      Object.assign(row, data)
      return row
    },
  }
  return {
    previewDevis: (input: FinanceLineDevisInput) => previewDevisFromLineForm(input, deps),
    saveDevis: (input: FinanceLineDevisInput) => saveDevisFromLineForm(input, deps),
    sendDevis: async (input: FinanceLineDevisInput): Promise<SendDevisFromLineResult> => {
      const saved = await saveDevisFromLineForm(input, deps)
      const row = drafts.find((item) => item.id === saved.id)
      if (!row) throw new Error('Devis introuvable')
      row.status = 'SENT'
      row.sentAt = new Date()
      return {
        devis: toDevisView(row),
        document: SENT_DOC,
        composeUrl: 'https://mail.google.com/mail/?view=cm',
      }
    },
    statusOf: (id: string) => drafts.find((row) => row.id === id)?.status ?? null,
  }
}
