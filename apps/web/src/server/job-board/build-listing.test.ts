// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { buildListingForOffer } from '@/server/job-board/build-listing'

const offer = {
  id: 'o1',
  missionId: 'm1',
  title: 'Pharmacien CDI Lyon',
  content: 'x'.repeat(120),
  boardListingId: null,
  jobTitleName: null,
  city: null,
  postalCode: null,
  latitude: null as number | null,
  longitude: null as number | null,
  contractType: null,
  tempsPlein: null,
  salaireMin: null,
  salaireMax: null,
  startDate: null,
  profilRecherche: null,
}

const mission = {
  contractType: 'CDI' as const,
  tempsPlein: true,
  salaireMin: 3500,
  salaireMax: 4200,
  startDate: new Date('2026-09-01'),
  profilRecherche: null as string | null,
  jobTitleName: 'Pharmacien',
  jobTitle: { name: 'Pharmacien' },
  pharmacy: {
    name: 'Pharmacie du Parc',
    city: 'Lyon',
    postalCode: '69006',
    address: '1 rue Test',
    latitude: 45.76 as number | null,
    longitude: 4.84 as number | null,
  },
}

describe('buildListingForOffer', () => {
  it('keeps pharmacy coords and skips BAN', async () => {
    const lookup = vi.fn()
    const listing = await buildListingForOffer(offer, mission, 'offres@medijob.fr', lookup)
    expect(lookup).not.toHaveBeenCalled()
    expect(listing.latitude).toBe(45.76)
    expect(listing.entreprise).toBe('MEDIJOB')
    expect(listing.titre).toBe('Pharmacien')
    expect(listing.ville).toBe('Lyon')
  })

  it('publishes without pin when BAN returns nothing', async () => {
    const lookup = vi.fn().mockResolvedValue(null)
    const listing = await buildListingForOffer(
      offer,
      { ...mission, pharmacy: { ...mission.pharmacy, latitude: null, longitude: null } },
      'offres@medijob.fr',
      lookup,
    )
    expect(lookup).toHaveBeenCalled()
    expect(listing.latitude).toBeNull()
    expect(listing.longitude).toBeNull()
  })

  it('fills coords from BAN when pharmacy has none', async () => {
    const lookup = vi.fn().mockResolvedValue({ lat: 48.8, lon: 2.3 })
    const listing = await buildListingForOffer(
      offer,
      { ...mission, pharmacy: { ...mission.pharmacy, latitude: null, longitude: null } },
      'offres@medijob.fr',
      lookup,
    )
    expect(listing.latitude).toBe(48.8)
    expect(listing.longitude).toBe(2.3)
  })

  it('builds standalone listing from offer fields', async () => {
    const listing = await buildListingForOffer(
      {
        ...offer,
        missionId: null,
        jobTitleName: 'Préparateur',
        city: 'Nice',
        latitude: 43.7,
        longitude: 7.2,
        contractType: 'CDI',
        tempsPlein: true,
      },
      null,
      'offres@medijob.fr',
      vi.fn(),
    )
    expect(listing.titre).toBe('Préparateur')
    expect(listing.ville).toBe('Nice')
  })
})
