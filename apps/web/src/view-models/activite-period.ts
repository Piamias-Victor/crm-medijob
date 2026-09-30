import { z } from 'zod'
import { addDaysYmd, parisYmd } from '@/lib/paris-week'
import { parisDayStartFromYmd } from '@/lib/paris-day-bounds'

const ymdSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export type ActivitePeriod = {
  fromYmd: string
  toYmd: string
  fromInclusive: Date
  toExclusive: Date
}

export function defaultActiviteYmds(now: Date): { fromYmd: string; toYmd: string } {
  const toYmd = parisYmd(now)
  return { fromYmd: addDaysYmd(toYmd, -29), toYmd }
}

export function resolveActivitePeriod(
  raw: { from?: string | null; to?: string | null },
  now: Date = new Date(),
): ActivitePeriod {
  const fallback = defaultActiviteYmds(now)
  const fromParsed = ymdSchema.safeParse(raw.from)
  const toParsed = ymdSchema.safeParse(raw.to)
  let fromYmd = fromParsed.success ? fromParsed.data : fallback.fromYmd
  let toYmd = toParsed.success ? toParsed.data : fallback.toYmd
  if (fromYmd > toYmd) {
    fromYmd = fallback.fromYmd
    toYmd = fallback.toYmd
  }
  return {
    fromYmd,
    toYmd,
    fromInclusive: parisDayStartFromYmd(fromYmd),
    toExclusive: parisDayStartFromYmd(addDaysYmd(toYmd, 1)),
  }
}
