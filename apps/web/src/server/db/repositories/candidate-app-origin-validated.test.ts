import { describe, expect, it } from 'vitest'
import { toMarkAppValidatedData } from './candidate-app-origin-validated'

describe('toMarkAppValidatedData', () => {
  it('stamps interimNeedSmsSentAt so existing needs do not trigger a first SMS', () => {
    const now = new Date('2026-09-09T07:00:00.000Z')
    expect(toMarkAppValidatedData(now)).toEqual({
      badakanValidatedAt: now,
      interimNeedSmsSentAt: now,
    })
  })
})
