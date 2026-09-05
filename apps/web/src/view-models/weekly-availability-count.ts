export function halfDayCountLabel(count: number): string {
  if (count === 0) return 'Aucun créneau'
  return count === 1 ? '1 créneau' : `${count} créneaux`
}
