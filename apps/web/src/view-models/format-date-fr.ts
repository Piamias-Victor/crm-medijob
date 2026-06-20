export function formatDateFr(value: Date): string {
  return new Intl.DateTimeFormat('fr-FR').format(value)
}
