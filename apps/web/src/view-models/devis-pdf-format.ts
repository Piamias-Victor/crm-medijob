export function formatDevisPdfAmount(value: number): string {
  const [int, dec] = value.toFixed(2).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${grouped},${dec} €`
}

export function formatDevisPdfHours(value: number): string {
  const body = Number.isInteger(value) ? String(value) : value.toFixed(2).replace('.', ',')
  return `${body} h`
}

export function formatDevisPdfDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getFullYear()}`
}

export function formatDevisPdfOrEmpty(value: number | null, empty: string): string {
  return value == null ? empty : formatDevisPdfAmount(value)
}
