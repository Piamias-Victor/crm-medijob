import { WEEK_REPORT_TZ } from '@/lib/constants/assistant-week-report'

type Ymd = { y: number; m: number; d: number }

function parisYmd(instant: Date): Ymd {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: WEEK_REPORT_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant)
  const num = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value)
  return { y: num('year'), m: num('month'), d: num('day') }
}

function addDays({ y, m, d }: Ymd, days: number): Ymd {
  const utc = new Date(Date.UTC(y, m - 1, d + days))
  return { y: utc.getUTCFullYear(), m: utc.getUTCMonth() + 1, d: utc.getUTCDate() }
}

/** Monday=0 … Sunday=6 for a civil YMD (calendar arithmetic, not TZ-shifted). */
function mondayOffset(ymd: Ymd): number {
  const dow = new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d, 12)).getUTCDay()
  return dow === 0 ? 6 : dow - 1
}

function tzOffsetMs(instant: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: WEEK_REPORT_TZ,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant)
  const num = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value)
  const asUtc = Date.UTC(num('year'), num('month') - 1, num('day'), num('hour'), num('minute'), num('second'))
  return asUtc - instant.getTime()
}

/** UTC instant for local midnight in Europe/Paris on the given civil day. */
export function parisDayStart(ymd: Ymd): Date {
  let utc = Date.UTC(ymd.y, ymd.m - 1, ymd.d, 0, 0, 0)
  for (let i = 0; i < 2; i++) {
    utc = Date.UTC(ymd.y, ymd.m - 1, ymd.d, 0, 0, 0) - tzOffsetMs(new Date(utc))
  }
  return new Date(utc)
}

/** Inclusive-start / exclusive-end ISO week (Mon 00:00 → next Mon 00:00) in Paris. */
export function isoWeekRangeParis(now: Date): { from: Date; to: Date } {
  const today = parisYmd(now)
  const monday = addDays(today, -mondayOffset(today))
  const nextMonday = addDays(monday, 7)
  return { from: parisDayStart(monday), to: parisDayStart(nextMonday) }
}
