/** Pure stamp for Activité event dates. Never overwrites; null on first-seen already-target. */
export function decideEventStamp(input: {
  previous: string | null | undefined
  next: string
  targets: readonly string[]
  existing: Date | null | undefined
  now: Date
}): Date | null {
  const nextHit = input.targets.includes(input.next)
  if (!nextHit) return input.existing ?? null
  if (input.existing) return input.existing
  if (input.previous == null) return null
  if (input.targets.includes(input.previous)) return null
  return input.now
}

export const QUALIFIE_TARGETS = ['QUALIFIE'] as const
export const POURVU_TARGETS = ['POURVU'] as const
export const STAFFED_TARGETS = ['STAFFED', 'COMPLETED'] as const
