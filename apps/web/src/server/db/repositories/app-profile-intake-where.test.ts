import { describe, expect, it } from 'vitest'
import { intakeFollowUpWhere } from './app-profile-intake-where'

describe('intakeFollowUpWhere', () => {
  it('default keeps Nouveau candidates even when App-validated', () => {
    expect(intakeFollowUpWhere()).toEqual({
      AND: [
        { status: { not: 'IGNORE' } },
        {
          OR: [{ candidateId: null }, { candidate: { is: { status: 'NOUVEAU' } } }],
        },
      ],
    })
  })

  it('archive is everyone who left Nouveau (or AppProfile Ignore)', () => {
    expect(intakeFollowUpWhere({ population: 'archive' })).toEqual({
      OR: [
        { status: 'IGNORE' },
        { candidate: { is: { status: { not: 'NOUVEAU' } } } },
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
            { status: 'IGNORE' },
            { candidate: { is: { status: { not: 'NOUVEAU' } } } },
          ],
        },
        { OR: [{ referentId: 'u1' }, { referentId: null }] },
      ],
    })
  })
})
