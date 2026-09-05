import { buildSmsUrl } from '@/lib/phone/build-sms-url'
import type { AvailabilityFilterPoolRow } from '@/server/weekly-availability/filter-pool'

export type AvailabilityFilterRow = {
  id: string
  fullName: string
  jobTitleName: string
  city: string | null
  phone: string | null
  telHref: string | null
  smsHref: string | null
}

export function toAvailabilityFilterRow(
  row: AvailabilityFilterPoolRow,
): AvailabilityFilterRow {
  return {
    id: row.id,
    fullName: `${row.firstName} ${row.lastName}`.trim(),
    jobTitleName: row.jobTitleName,
    city: row.city,
    phone: row.phone,
    telHref: row.phone ? `tel:${row.phone}` : null,
    smsHref: buildSmsUrl(row.phone),
  }
}
