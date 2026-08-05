import { describe, expect, it } from 'vitest'
import { mapBadakanRecipient } from './map-recipient'

describe('mapBadakanRecipient', () => {
  it('maps real Badakan searchNewEmployees shape', () => {
    const mapped = mapBadakanRecipient({
      id: '6a72',
      firstName: 'nora',
      lastName: 'boudjerada',
      email: 'n@example.com',
      validatedPhoneNumber: '+33744422730',
      address: { city: 'Troyes', zipCode: '10000' },
      activities: [{ label: 'Pharmacien' }],
    })
    expect(mapped).toMatchObject({
      badakanId: '6a72',
      firstName: 'nora',
      lastName: 'boudjerada',
      phone: '+33744422730',
      city: 'Troyes',
      postalCode: '10000',
      activityLabel: 'Pharmacien',
    })
  })

  it('returns null when name missing', () => {
    expect(mapBadakanRecipient({ id: '1', email: 'x@y.z' })).toBeNull()
  })
})
