import { describe, expect, it } from 'vitest'
import { resolveListingSource } from '@/server/job-board/resolve-listing-source'
import { toBoardListing } from '@/server/job-board/listing-map'

const baseOffer = {
  title: 'Ignored for board titre',
  content: '<p>x</p>',
  boardListingId: null as string | null,
  jobTitleName: null as string | null,
  city: null as string | null,
  postalCode: null as string | null,
  latitude: null as number | null,
  longitude: null as number | null,
  contractType: null as 'CDI' | null,
  tempsPlein: null as boolean | null,
  salaireMin: null as number | null,
  salaireMax: null as number | null,
  startDate: null as Date | null,
  profilRecherche: null as string | null,
}

const mission = {
  contractType: 'CDI' as const,
  tempsPlein: true,
  salaireMin: 3500,
  salaireMax: 4200,
  startDate: new Date('2026-09-01'),
  profilRecherche: 'Expérience',
  jobTitleName: 'Pharmacien',
  pharmacy: {
    name: 'Pharmacie du Parc',
    city: 'Lyon',
    postalCode: '69006',
    latitude: 45.76,
    longitude: 4.84,
  },
}

describe('resolveListingSource', () => {
  it('linked offer resolves from mission (MEDIJOB entreprise via map)', () => {
    const source = resolveListingSource(baseOffer, mission, 'offres@medijob.fr')
    const listing = toBoardListing(source)
    expect(listing.entreprise).toBe('MEDIJOB')
    expect(listing.titre).toBe('Pharmacien')
    expect(listing.ville).toBe('Lyon')
    expect(listing.salaire_min).toBe(3500)
    expect(listing.latitude).toBe(45.76)
  })

  it('standalone offer resolves from offer fields', () => {
    const source = resolveListingSource(
      {
        ...baseOffer,
        jobTitleName: 'Préparateur',
        city: 'Nice',
        postalCode: '06000',
        latitude: 43.7,
        longitude: 7.2,
        contractType: 'CDI',
        tempsPlein: false,
        salaireMin: 2100,
        salaireMax: 2300,
      },
      null,
      'offres@medijob.fr',
    )
    const listing = toBoardListing(source)
    expect(listing.titre).toBe('Préparateur')
    expect(listing.ville).toBe('Nice')
    expect(listing.temps_travail).toBe('Temps partiel')
    expect(listing.latitude).toBe(43.7)
  })

  it('throws when standalone is incomplete', () => {
    expect(() => resolveListingSource(baseOffer, null, 'a@b.c')).toThrow(
      'STANDALONE_OFFER_INCOMPLETE',
    )
  })
})
