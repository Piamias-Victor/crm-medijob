import { PARIS_TZ } from '@/lib/paris-week'

type YmdParts = { y: number; m: number; d: number }

function parseYmd(ymd: string): YmdParts {
  const [y, m, d] = ymd.split('-').map(Number)
  return { y: y!, m: m!, d: d! }
}

function tzOffsetMs(instant: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: PARIS_TZ,
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
  const asUtc = Date.UTC(
    num('year'),
    num('month') - 1,
    num('day'),
    num('hour'),
    num('minute'),
    num('second'),
  )
  return asUtc - instant.getTime()
}

/** UTC instant for local midnight Europe/Paris on civil YMD. */
export function parisDayStartFromYmd(ymd: string): Date {
  const { y, m, d } = parseYmd(ymd)
  let utc = Date.UTC(y, m - 1, d, 0, 0, 0)
  for (let i = 0; i < 2; i++) {
    utc = Date.UTC(y, m - 1, d, 0, 0, 0) - tzOffsetMs(new Date(utc))
  }
  return new Date(utc)
}
