export function formatDevisPdfAmount(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} €`
}
