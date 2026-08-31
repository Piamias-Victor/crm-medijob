export const PARIS_TZ = 'Europe/Paris'

export function parisYmd(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: PARIS_TZ }).format(now)
}

export function addDaysYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split('-').map(Number)
  const utc = new Date(Date.UTC(y!, m! - 1, d! + days, 12))
  return utc.toISOString().slice(0, 10)
}

export function mondayOf(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  const dow = new Date(Date.UTC(y!, m! - 1, d!, 12)).getUTCDay()
  return addDaysYmd(ymd, dow === 0 ? -6 : 1 - dow)
}

export function isPastYmd(ymd: string, now: Date): boolean {
  return ymd < parisYmd(now)
}

export function currentMonday(now: Date): string {
  return mondayOf(parisYmd(now))
}

export function weekDates(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDaysYmd(weekStart, i))
}
