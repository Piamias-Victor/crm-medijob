import { normalizeHexColor } from '@/server/admin/schema'

export function hexWithAlpha(hex: string, alpha: number): string {
  const normalized = normalizeHexColor(hex)
  if (!normalized) return 'transparent'
  const r = Number.parseInt(normalized.slice(1, 3), 16)
  const g = Number.parseInt(normalized.slice(3, 5), 16)
  const b = Number.parseInt(normalized.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
