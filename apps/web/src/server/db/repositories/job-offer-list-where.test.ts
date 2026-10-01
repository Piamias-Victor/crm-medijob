import { describe, expect, it } from 'vitest'
import { buildJobOfferListWhere } from '@/server/db/repositories/job-offer-list-where'

describe('buildJobOfferListWhere', () => {
  it('filters by offer status (publiée / dépubliée / brouillon)', () => {
    expect(buildJobOfferListWhere({ statuses: ['PUBLIEE', 'DEPUBLIEE'] })).toEqual({
      status: { in: ['PUBLIEE', 'DEPUBLIEE'] },
    })
  })

  it('matches contract on standalone or linked mission', () => {
    expect(buildJobOfferListWhere({ contractTypes: ['CDI'] })).toEqual({
      OR: [
        { missionId: null, contractType: { in: ['CDI'] } },
        { mission: { contractType: { in: ['CDI'] } } },
      ],
    })
  })
})
