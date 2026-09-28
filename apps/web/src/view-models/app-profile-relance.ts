import { addDaysYmd, isPastYmd, parisYmd } from '@/lib/paris-week'

/** UTC noon on civil YMD — stable calendar day for Date storage. */
function noonUtcFromYmd(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(Date.UTC(y!, m! - 1, d!, 12))
}

export function defaultRelanceOnArrival(createdAt: Date): Date {
  return noonUtcFromYmd(parisYmd(createdAt))
}

export function defaultRelanceAfterCall(lastCalledAt: Date): Date {
  return noonUtcFromYmd(addDaysYmd(parisYmd(lastCalledAt), 2))
}

export function isRelanceOverdue(relanceAt: Date | null, now: Date): boolean {
  if (!relanceAt) return false
  return isPastYmd(parisYmd(relanceAt), now)
}
