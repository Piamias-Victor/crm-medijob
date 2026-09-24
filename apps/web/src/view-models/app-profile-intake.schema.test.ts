import { describe, expect, it } from 'vitest'
import { updateIntakeSchema } from './app-profile-intake.schema'

const base = {
  id: 'p1',
  intakeStatus: 'A_APPELER' as const,
  callOutcome: null,
  plannedRdvAt: null,
  notes: null,
}

describe('updateIntakeSchema', () => {
  it('accepts intake fields without Call outcome', () => {
    expect(updateIntakeSchema.parse(base)).toMatchObject(base)
  })

  it('rejects RDV_PRIS without planned RDV date', () => {
    const result = updateIntakeSchema.safeParse({
      ...base,
      callOutcome: 'RDV_PRIS',
      plannedRdvAt: null,
    })
    expect(result.success).toBe(false)
  })

  it('accepts RDV_PRIS with planned RDV date', () => {
    const plannedRdvAt = new Date('2026-04-01T10:00:00.000Z')
    expect(
      updateIntakeSchema.parse({
        ...base,
        callOutcome: 'RDV_PRIS',
        plannedRdvAt,
      }),
    ).toMatchObject({ callOutcome: 'RDV_PRIS', plannedRdvAt })
  })

  it('accepts other Call outcomes without planned RDV', () => {
    expect(
      updateIntakeSchema.parse({
        ...base,
        callOutcome: 'MESSAGERIE',
        plannedRdvAt: null,
      }).callOutcome,
    ).toBe('MESSAGERIE')
  })
})
