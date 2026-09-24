import { describe, expect, it } from 'vitest'
import { buildIntakeStampUpdate } from './app-profile-intake-stamp'
import { parisYmd } from '@/lib/paris-week'

const base = {
  intakeStatus: 'A_APPELER' as const,
  callOutcome: 'MESSAGERIE' as const,
  plannedRdvAt: null,
  notes: null,
  referentId: null,
  relanceAt: new Date('2026-03-10T12:00:00.000Z'),
}

describe('buildIntakeStampUpdate', () => {
  it('stamps last-call and bumps relance when Call outcome changes', () => {
    const now = new Date('2026-03-10T15:00:00.000Z')
    const result = buildIntakeStampUpdate({
      input: base,
      previousCallOutcome: null,
      sessionUserId: 'u1',
      now,
    })
    expect(result.lastCalledAt).toEqual(now)
    expect(result.lastCalledById).toBe('u1')
    expect(parisYmd(result.relanceAt!)).toBe('2026-03-12')
  })

  it('keeps explicit relance when Call outcome unchanged', () => {
    const override = new Date('2026-03-20T12:00:00.000Z')
    const result = buildIntakeStampUpdate({
      input: { ...base, relanceAt: override },
      previousCallOutcome: 'MESSAGERIE',
      sessionUserId: 'u1',
      now: new Date('2026-03-10T15:00:00.000Z'),
    })
    expect(result.lastCalledAt).toBeUndefined()
    expect(result.relanceAt).toEqual(override)
  })

  it('does not stamp when Call outcome cleared to null', () => {
    const result = buildIntakeStampUpdate({
      input: { ...base, callOutcome: null },
      previousCallOutcome: 'MESSAGERIE',
      sessionUserId: 'u1',
      now: new Date('2026-03-10T15:00:00.000Z'),
    })
    expect(result.lastCalledAt).toBeUndefined()
    expect(result.lastCalledById).toBeUndefined()
  })
})
