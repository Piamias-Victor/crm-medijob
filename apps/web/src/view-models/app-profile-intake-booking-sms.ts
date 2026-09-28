import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'

export function intakeBookingSmsLabel(calendarSmsSentAt: Date | null): string {
  return calendarSmsSentAt ? 'Envoyé' : TABLE_EMPTY_CELL
}
