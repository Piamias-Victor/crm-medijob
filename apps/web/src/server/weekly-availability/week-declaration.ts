export type WeekDeclaration = 'unknown' | 'declared_unavailable' | 'submitted'

export function weekDeclaration(slots: unknown[] | null): WeekDeclaration {
  if (slots === null) return 'unknown'
  if (slots.length === 0) return 'declared_unavailable'
  return 'submitted'
}
