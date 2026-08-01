export type IdleDecision = 'ok' | 'expired'

export function evaluateIdleSession(input: {
  lastActivityAt: Date | number
  now: Date | number
  idleMs: number
}): IdleDecision {
  const last =
    typeof input.lastActivityAt === 'number'
      ? input.lastActivityAt
      : input.lastActivityAt.getTime()
  const now = typeof input.now === 'number' ? input.now : input.now.getTime()
  if (now - last >= input.idleMs) return 'expired'
  return 'ok'
}
