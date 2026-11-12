import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearPharmacyDuplicateDraft,
  readPharmacyDuplicateDraft,
  savePharmacyDuplicateDraft,
  type PharmacyDuplicateDraft,
} from '@/lib/pharmacy-duplicate-draft-storage'

const draft: PharmacyDuplicateDraft = {
  mode: 'create',
  incoming: { name: 'Pharmacie Claustres', status: 'PROSPECT', siret: '49069953500020' },
  returnPath: '/pharmacies/new',
  matches: [
    {
      pharmacyId: 'p1',
      reason: 'name_city_postal',
      name: 'Pharmacie Claustres',
      siret: null,
      city: 'Saint-Girons',
      postalCode: '09200',
      deletedAt: null,
    },
  ],
}

describe('pharmacy duplicate draft storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('returns the same draft reference while sessionStorage content is unchanged', () => {
    savePharmacyDuplicateDraft(draft)
    const first = readPharmacyDuplicateDraft()
    const second = readPharmacyDuplicateDraft()
    expect(first).not.toBeNull()
    expect(Object.is(first, second)).toBe(true)
  })

  it('reads updated draft after a new save', () => {
    savePharmacyDuplicateDraft(draft)
    savePharmacyDuplicateDraft({
      ...draft,
      incoming: { ...draft.incoming, name: 'Autre Pharma' },
    })
    expect(readPharmacyDuplicateDraft()?.incoming.name).toBe('Autre Pharma')
  })

  it('returns null after clear', () => {
    savePharmacyDuplicateDraft(draft)
    clearPharmacyDuplicateDraft()
    expect(readPharmacyDuplicateDraft()).toBeNull()
  })
})
