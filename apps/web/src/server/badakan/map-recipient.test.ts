import { describe, expect, it } from 'vitest'
import { mapBadakanRecipient } from './map-recipient'

describe('mapBadakanRecipient', () => {
  it('maps camelCase recipient fields', () => {
    const mapped = mapBadakanRecipient({
      id: 42,
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      mobilePhone: '0600000000',
      city: 'Nice',
      zipCode: '06000',
      activity: { label: 'Pharmacien' },
    })
    expect(mapped).toMatchObject({
      badakanId: '42',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phone: '0600000000',
      city: 'Nice',
      postalCode: '06000',
      activityLabel: 'Pharmacien',
    })
  })

  it('returns null when name missing', () => {
    expect(mapBadakanRecipient({ id: '1', email: 'x@y.z' })).toBeNull()
  })
})
