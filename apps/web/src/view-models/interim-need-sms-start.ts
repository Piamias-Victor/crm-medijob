export function needStartsInFuture(startsAt: Date | null, now = new Date()) {
  return startsAt != null && startsAt.getTime() > now.getTime()
}
