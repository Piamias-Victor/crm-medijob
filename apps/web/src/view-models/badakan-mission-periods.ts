import { formatDateFr } from '@/view-models/format-date-fr'

export type PeriodLike = { start: string | null; end: string | null }

function formatIsoDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : formatDateFr(date)
  }
  return `${match[3]}/${match[2]}/${match[1]}`
}

function formatOne(value: string | null): string | null {
  if (!value) return null
  return formatIsoDate(value)
}

export function parseBadakanMissionPeriods(value: unknown): PeriodLike[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const row = item as { start?: unknown; end?: unknown }
    return [
      {
        start: typeof row.start === 'string' ? row.start : null,
        end: typeof row.end === 'string' ? row.end : null,
      },
    ]
  })
}

export function badakanMissionPeriodLabel(periods: PeriodLike[]): string {
  const first = periods[0]
  if (!first) return '—'
  const start = formatOne(first.start)
  const end = formatOne(first.end)
  if (start && end) return `${start} → ${end}`
  return start ?? end ?? '—'
}
