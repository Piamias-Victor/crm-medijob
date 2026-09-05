import { buildSmsUrl } from '@/lib/phone/build-sms-url'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import type {
  AvailabilityFilterSlot,
  DeclaredAvailabilityPoolRow,
} from '@/server/weekly-availability/filter-pool'

const DAY_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

export function slotLabel(slot: AvailabilityFilterSlot): string {
  const day = DAY_FORMAT.format(new Date(`${slot.date}T12:00:00.000Z`))
  return `${day} ${slot.period === 'AM' ? 'matin' : 'après-midi'}`
}

export function halfDayLabel(count: number): string {
  return `${count} demi-journée${count > 1 ? 's' : ''}`
}

export type DeclaredAvailabilityRow = {
  id: string
  fullName: string
  jobTitleName: string
  city: string | null
  phone: string | null
  telHref: string | null
  smsHref: string | null
  halfDayCount: number
  halfDayLabel: string
  nextSlotLabel: string
  href: string
}

export function toDeclaredAvailabilityRow(
  row: DeclaredAvailabilityPoolRow,
): DeclaredAvailabilityRow {
  const next = row.slots[0]
  return {
    id: row.id,
    fullName: `${row.firstName} ${row.lastName}`.trim(),
    jobTitleName: row.jobTitleName,
    city: row.city,
    phone: row.phone,
    telHref: row.phone ? `tel:${row.phone}` : null,
    smsHref: buildSmsUrl(row.phone),
    halfDayCount: row.slots.length,
    halfDayLabel: halfDayLabel(row.slots.length),
    nextSlotLabel: next ? slotLabel(next) : TABLE_EMPTY_CELL,
    href: `/candidats/${row.id}`,
  }
}
