import { describe, expect, it } from 'vitest'
import { intakeFollowUpWhere } from './app-profile-intake-where'

describe('intakeFollowUpWhere', () => {
  it('default excludes App-validated, Ignore, and negative exits', () => {
    expect(intakeFollowUpWhere()).toEqual({
      AND: [
        { status: { notIn: ['APP_VALIDATED', 'IGNORE'] } },
        {
          OR: [
            { callOutcome: null },
            { callOutcome: { notIn: ['PAS_INTERESSE', 'HORS_CIBLE'] } },
          ],
        },
        { intakeStatus: { not: 'HORS_ZONE' } },
      ],
    })
  })

  it('archive keeps App-validated, Ignore, and negative exits', () => {
    expect(intakeFollowUpWhere({ population: 'archive' })).toEqual({
      OR: [
        { status: { in: ['APP_VALIDATED', 'IGNORE'] } },
        { callOutcome: { in: ['PAS_INTERESSE', 'HORS_CIBLE'] } },
        { intakeStatus: 'HORS_ZONE' },
      ],
    })
  })

  it('AND referent mine scope onto population', () => {
    expect(
      intakeFollowUpWhere({
        population: 'archive',
        referentScope: 'mine',
        currentUserId: 'u1',
      }),
    ).toEqual({
      AND: [
        {
          OR: [
            { status: { in: ['APP_VALIDATED', 'IGNORE'] } },
            { callOutcome: { in: ['PAS_INTERESSE', 'HORS_CIBLE'] } },
            { intakeStatus: 'HORS_ZONE' },
          ],
        },
        { OR: [{ referentId: 'u1' }, { referentId: null }] },
      ],
    })
  })
})
