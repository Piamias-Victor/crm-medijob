import { describe, expect, it } from 'vitest'
import { entreesAppSoftHideWhere } from './entrees-app-soft-hide'

describe('entreesAppSoftHideWhere', () => {
  it('excludes Candidates linked to archived Entrées app rows', () => {
    expect(entreesAppSoftHideWhere()).toEqual({
      NOT: {
        appProfiles: {
          some: {
            OR: [
              { status: 'IGNORE' },
              { callOutcome: { in: ['PAS_INTERESSE', 'HORS_CIBLE'] } },
              { intakeStatus: 'HORS_ZONE' },
            ],
          },
        },
      },
    })
  })
})
