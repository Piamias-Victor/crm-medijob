function dayStartUtc(isoDate: string) {
  return new Date(`${isoDate}T00:00:00.000Z`)
}

function dayEndUtc(isoDate: string) {
  return new Date(`${isoDate}T23:59:59.999Z`)
}

export function matchesIsoDateRange(value: Date | null, from?: string, to?: string) {
  if (!from && !to) return true
  if (!value) return false
  if (from && value < dayStartUtc(from)) return false
  if (to && value > dayEndUtc(to)) return false
  return true
}
