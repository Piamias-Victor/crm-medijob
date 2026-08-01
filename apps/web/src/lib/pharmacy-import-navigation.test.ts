import { beforeEach, describe, expect, it } from 'vitest'
import {
  pharmacyDuplicateReviewHref,
  startPharmacyImportDuplicateReviews,
} from '@/lib/pharmacy-import-navigation'
import { clearPharmacyImportQueue, readPharmacyImportQueue } from '@/lib/pharmacy-import-queue-storage'
import { clearPharmacyDuplicateDraft, readPharmacyDuplicateDraft } from '@/lib/pharmacy-duplicate-draft-storage'

describe('pharmacy import navigation', () => {
  beforeEach(() => {
    clearPharmacyImportQueue()
    clearPharmacyDuplicateDraft()
  })

  it('opens first duplicate review and queues the rest', () => {
    const href = startPharmacyImportDuplicateReviews([
      {
        row: { name: 'A', status: 'PROSPECT' },
        matches: [
          {
            pharmacyId: 'p1',
            reason: 'siret',
            name: 'A',
            siret: '1',
            city: null,
            postalCode: null,
            deletedAt: null,
          },
        ],
      },
      {
        row: { name: 'B', status: 'PROSPECT' },
        matches: [
          {
            pharmacyId: 'p2',
            reason: 'name_city_postal',
            name: 'B',
            siret: null,
            city: 'Lyon',
            postalCode: '69001',
            deletedAt: null,
          },
        ],
      },
    ])
    expect(href).toBe(pharmacyDuplicateReviewHref('p1'))
    expect(readPharmacyDuplicateDraft()?.incoming.name).toBe('A')
    expect(readPharmacyImportQueue()).toHaveLength(1)
  })
})
