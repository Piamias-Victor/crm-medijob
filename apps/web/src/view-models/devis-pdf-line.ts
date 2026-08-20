import { DEVIS_KIND_LABELS } from '@/view-models/devis-copy'
import { DEVIS_PDF_EMPTY, DEVIS_PDF_FORFAIT_QTY, DEVIS_PDF_MISSION } from '@/view-models/devis-pdf-copy'
import { formatDevisPdfAmount, formatDevisPdfHours, formatDevisPdfOrEmpty } from '@/view-models/devis-pdf-format'
import type { DevisKind } from '@/lib/finance/devis-draft'

export type DevisPdfLine = {
  designation: string
  quantity: string
  unitPrice: string
  totalHt: string
}

export function buildDevisPdfLine(input: {
  kind: DevisKind
  hours: number | null
  hourlyRate: number | null
  amountHt: number | null
  missionTitle: string
}): DevisPdfLine {
  const kindLabel = DEVIS_KIND_LABELS[input.kind]
  const hourly = input.hours != null && input.hourlyRate != null
  return {
    designation: `${DEVIS_PDF_MISSION} ${kindLabel} — ${input.missionTitle}`,
    quantity: hourly ? formatDevisPdfHours(input.hours ?? 0) : DEVIS_PDF_FORFAIT_QTY,
    unitPrice: hourly
      ? formatDevisPdfAmount(input.hourlyRate ?? 0)
      : formatDevisPdfOrEmpty(input.amountHt, DEVIS_PDF_EMPTY),
    totalHt: formatDevisPdfOrEmpty(input.amountHt, DEVIS_PDF_EMPTY),
  }
}
