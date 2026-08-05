import { describe, expect, it } from 'vitest'
import { mapBadakanRecipient } from './map-recipient'

describe('mapBadakanRecipient', () => {
  it('maps address, city and activity when present', () => {
    const mapped = mapBadakanRecipient({
      id: '6a72',
      firstName: 'nora',
      lastName: 'boudjerada',
      email: 'n@example.com',
      validatedPhoneNumber: '+33744422730',
      address: {
        address1: '1 Rue Jacques Cartier',
        address2: '',
        city: 'Troyes',
        zipCode: '10000',
      },
      activities: [{ label: 'Préparateur Débutant' }],
      documents: { RESUME: { rectoUrl: 'https://api.example/cv' } },
    })
    expect(mapped).toMatchObject({
      address: '1 Rue Jacques Cartier',
      city: 'Troyes',
      postalCode: '10000',
      activityLabel: 'Préparateur Débutant',
      hasResume: true,
    })
  })

  it('returns null when name missing', () => {
    expect(mapBadakanRecipient({ id: '1', email: 'x@y.z' })).toBeNull()
  })
})
