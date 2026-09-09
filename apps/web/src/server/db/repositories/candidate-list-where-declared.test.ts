// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildCandidateListWhere } from '@/server/db/repositories/candidate-list-where'

const now = new Date('2026-06-24T12:00:00.000Z')

describe('buildCandidateListWhere status origin dispos', () => {
  it('filtre statut Blacklisté stocké', () => {
    expect(buildCandidateListWhere({ statuses: ['BLACKLISTE'] })).toEqual({ status: 'BLACKLISTE' })
  })

  it('filtre origine App', () => {
    expect(buildCandidateListWhere({ origins: ['APP'] })).toEqual({ origin: { in: ['APP'] } })
  })

  it('filtre dispos déclarées oui — au moins un créneau à venir', () => {
    expect(buildCandidateListWhere({ declaredAvailability: true }, now)).toEqual({
      weeklyAvailabilityWeeks: {
        some: { slots: { some: { date: { gte: new Date('2026-06-24T00:00:00.000Z') } } } },
      },
    })
  })

  it('filtre dispos déclarées non — aucun créneau à venir', () => {
    expect(buildCandidateListWhere({ declaredAvailability: false }, now)).toEqual({
      NOT: {
        weeklyAvailabilityWeeks: {
          some: { slots: { some: { date: { gte: new Date('2026-06-24T00:00:00.000Z') } } } },
        },
      },
    })
  })
})
