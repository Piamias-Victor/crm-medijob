// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { matchesNeed } from '@/lib/filters/badakan-interim-filters'
import { emptyNeedFilter, needFilterRow } from '@/lib/filters/badakan-interim-filters.fixtures'

describe('matchesNeed', () => {
  it('filters by étape, ville, département and métier', () => {
    expect(
      matchesNeed(needFilterRow, {
        ...emptyNeedFilter,
        steps: ['CANCELLED'],
        ville: 'stras',
        metier: 'pharma',
      }),
    ).toBe(true)
    expect(matchesNeed(needFilterRow, { ...emptyNeedFilter, steps: ['STAFFED'] })).toBe(false)
    const open = { ...needFilterRow, step: 'CREATED', stepLabel: 'Créée' }
    expect(matchesNeed(open, { ...emptyNeedFilter, departement: ['67'] })).toBe(true)
    expect(matchesNeed(open, { ...emptyNeedFilter, departement: ['75'] })).toBe(false)
    expect(matchesNeed(open, { ...emptyNeedFilter, ville: 'lyon' })).toBe(false)
  })

  it('defaults to open needs when no step filter is set', () => {
    expect(matchesNeed(needFilterRow, emptyNeedFilter)).toBe(false)
    expect(matchesNeed({ ...needFilterRow, step: 'CREATED', stepLabel: 'Créée' }, emptyNeedFilter)).toBe(
      true,
    )
    expect(
      matchesNeed(
        {
          ...needFilterRow,
          step: 'CREATED',
          stepLabel: 'Créée',
          expectedRecipients: 1,
          staffedRecipients: 1,
        },
        emptyNeedFilter,
      ),
    ).toBe(false)
  })

  it('filters by current week when week=current', () => {
    const now = new Date('2026-09-09T12:00:00Z')
    expect(
      matchesNeed(needFilterRow, { ...emptyNeedFilter, steps: ['CANCELLED'], week: 'current' }, now),
    ).toBe(true)
    expect(
      matchesNeed(
        { ...needFilterRow, periods: [{ start: '2026-08-01', end: '2026-08-02' }] },
        { ...emptyNeedFilter, steps: ['CANCELLED'], week: 'current' },
        now,
      ),
    ).toBe(false)
  })
})
