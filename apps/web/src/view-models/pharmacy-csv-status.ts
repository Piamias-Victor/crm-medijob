import type { PharmacyStatus } from '@/view-models/pharmacy-form.schema'
import { PHARMACY_STATUSES } from '@/view-models/pharmacy-form.schema'
import { STATUS_LABELS } from '@/lib/pharmacy-options'

const LABEL_TO_STATUS = Object.fromEntries(
  (Object.entries(STATUS_LABELS) as [PharmacyStatus, string][]).map(([status, label]) => [
    label.toLowerCase(),
    status,
  ]),
) as Record<string, PharmacyStatus>

export function parsePharmacyCsvStatus(raw: string | undefined): PharmacyStatus | undefined {
  if (raw === undefined || raw.trim() === '') return undefined
  const trimmed = raw.trim()
  const upper = trimmed.toUpperCase()
  if ((PHARMACY_STATUSES as readonly string[]).includes(upper)) {
    return upper as PharmacyStatus
  }
  return LABEL_TO_STATUS[trimmed.toLowerCase()]
}
