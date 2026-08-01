import { describe, it, expect } from 'vitest'
import { applyJwtIdle } from './jwt-idle'

describe('applyJwtIdle', () => {
  const idleMs = 30 * 60_000

  it('returns null when last activity exceeds idle window', () => {
    const result = applyJwtIdle({
      token: { lastActivity: 0 },
      now: idleMs,
      idleMs,
      touch: false,
    })
    expect(result).toBeNull()
  })

  it('touches lastActivity when requested', () => {
    const result = applyJwtIdle({
      token: { lastActivity: 1000, id: 'u1' },
      now: 2000,
      idleMs,
      touch: true,
    })
    expect(result).toMatchObject({ id: 'u1', lastActivity: 2000 })
  })
})
