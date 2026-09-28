type DateRange = { from: string; to: string }

export function dateInRange(value: Date | null | undefined, range: DateRange): boolean {
  if (!range.from && !range.to) return true
  if (!value) return false
  const time = value.getTime()
  if (range.from) {
    const from = new Date(`${range.from}T00:00:00`).getTime()
    if (time < from) return false
  }
  if (range.to) {
    const to = new Date(`${range.to}T23:59:59.999`).getTime()
    if (time > to) return false
  }
  return true
}
