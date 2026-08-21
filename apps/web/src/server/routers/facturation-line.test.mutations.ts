import { TRPCError } from '@trpc/server'
import { generateDevisFromFinanceLine } from '@/lib/finance/generate-devis-from-line'
import { toDevisView, type DevisRecord, type DevisWriteFields } from '@/view-models/devis'
import type { FinanceLineRecord } from '@/view-models/finance-line'
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

export function memoryLineDevisMutations(lines: FinanceLineRecord[]) {
  let devisCount = 0
  let lastDevis: DevisRecord | null = null
  const generateDevisFromLine = async (id: string) => {
    const line = lines.find((row) => row.id === id)
    if (!line) throw new TRPCError({ code: 'NOT_FOUND', message: 'Ligne introuvable' })
    return generateDevisFromFinanceLine(line, {
      findDraftByMission: async () => null,
      createDraft: async (data) => {
        lastDevis = draftFrom(data, `d-${++devisCount}`)
        return lastDevis
      },
      updateDraft: async (draftId, data) => draftFrom({ ...data, missionId: line.missionId }, draftId),
      attachDevis: async (lineId, devisId) => {
        const target = lines.find((row) => row.id === lineId)
        if (target) {
          target.devisId = devisId
          target.devisStatus = 'DRAFT'
        }
      },
    })
  }
  const sendDevisFromLine = async (id: string): Promise<SendDevisFromLineResult> => {
    const line = lines.find((row) => row.id === id)
    if (!line) throw new TRPCError({ code: 'NOT_FOUND', message: 'Ligne introuvable' })
    if (!line.devisId) await generateDevisFromLine(id)
    if (!lastDevis) throw new TRPCError({ code: 'NOT_FOUND', message: 'Devis introuvable' })
    lastDevis.status = 'SENT'
    lastDevis.sentAt = new Date()
    const target = lines.find((row) => row.id === id)
    if (target) target.devisStatus = 'SENT'
    return {
      devis: toDevisView(lastDevis),
      document: SENT_DOC,
      composeUrl: 'https://mail.google.com/mail/?view=cm',
    }
  }
  return { generateDevisFromLine, sendDevisFromLine }
}
