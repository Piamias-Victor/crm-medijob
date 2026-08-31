import { describe, expect, it } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { identityPatchFromBadakan } from './merge-badakan-identity'

const cylla = mapBadakanRecipient({
  id: 'bk-pierre',
  firstName: 'Pierre',
  lastName: 'Cylla',
  healthCareNumber: '1850178123456',
  bankAccount: { iban: 'FR7612345678901234567890185' },
})!

describe('identityPatchFromBadakan', () => {
  it('copies NIR and IBAN when Badakan has them', () => {
    expect(identityPatchFromBadakan(cylla, null)).toMatchObject({
      nir: '1850178123456',
      iban: 'FR7612345678901234567890185',
    })
  })

  it('omits NIR and IBAN when Badakan leaves them empty', () => {
    const blank = mapBadakanRecipient({
      id: 'bk-pierre',
      firstName: 'Pierre',
      lastName: 'Cylla',
      healthCareNumber: '  ',
    })!
    const patch = identityPatchFromBadakan(blank, null)
    expect(patch).not.toHaveProperty('nir')
    expect(patch).not.toHaveProperty('iban')
  })
})
