export function parseCreatedWithinHours(raw: string | null): number | undefined {
  if (!raw) return undefined
  const value = Number(raw)
  if (!Number.isInteger(value) || value < 1 || value > 168) return undefined
  return value
}
