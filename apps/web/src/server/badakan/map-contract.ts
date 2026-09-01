import { badakanContractSchema, type BadakanContractRaw } from './map-contract.schema'

export type BadakanContract = {
  badakanId: string
  status: string
  pdfUrl: string | null
  dpaeUrl: string | null
  recipientName: string
  pharmacyName: string
}

function present(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function fileUrl(value: BadakanContractRaw['pdfUrl']): string | null {
  if (typeof value === 'string') return present(value)
  return present(value?.url)
}

function fullName(first: string | null | undefined, last: string | null | undefined) {
  return [first, last].map((p) => p?.trim()).filter(Boolean).join(' ') || '—'
}

export function mapBadakanContract(raw: unknown): BadakanContract | null {
  const parsed = badakanContractSchema.safeParse(raw)
  if (!parsed.success) return null
  const r = parsed.data
  return {
    badakanId: r.id,
    status: present(r.currentStep ?? r.status) ?? '—',
    pdfUrl: fileUrl(r.pdfUrl) ?? fileUrl(r.pdf) ?? fileUrl(r.contractPdf) ?? fileUrl(r.contractFile),
    dpaeUrl: fileUrl(r.dpaeUrl) ?? fileUrl(r.dpae) ?? fileUrl(r.dpaePdf) ?? fileUrl(r.dpaeFile),
    recipientName: fullName(r.recipient?.firstName, r.recipient?.lastName),
    pharmacyName: present(r.enterprise?.enterpriseName ?? r.enterprise?.name) ?? '—',
  }
}
