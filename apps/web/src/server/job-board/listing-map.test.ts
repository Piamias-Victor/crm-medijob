// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { toBoardListing } from '@/server/job-board/listing-map'

const source = {
  title: 'Pharmacien CDI Lyon',
  content: '<p>Poste en officine</p>',
  boardListingId: null as string | null,
  contactEmail: 'offres@medijob.fr',
  mission: {
    contractType: 'CDI' as const,
    tempsPlein: true,
    salaireMin: 3500,
    salaireMax: 4200,
    startDate: new Date('2026-09-01'),
    profilRecherche: 'Expérience officine',
    jobTitleName: 'Pharmacien',
  },
  pharmacy: {
    name: 'Pharmacie du Parc',
    city: 'Lyon',
    postalCode: '69006',
    latitude: 45.76,
    longitude: 4.84,
  },
}

describe('toBoardListing', () => {
  it('uses pharmacy name and env email, never source_crm_id', () => {
    const listing = toBoardListing(source)
    expect(listing.entreprise).toBe('Pharmacie du Parc')
    expect(listing.contact_email).toBe('offres@medijob.fr')
    expect(listing.mise_en_avant).toBe(false)
    expect(listing).not.toHaveProperty('source_crm_id')
  })

  it('maps title, JobTitle, contract, pay and start from CRM', () => {
    const listing = toBoardListing(source)
    expect(listing.titre).toBe('Pharmacien CDI Lyon')
    expect(listing.metier).toBe('Pharmacien')
    expect(listing.description).toBe('<p>Poste en officine</p>')
    expect(listing.type_contrat).toBe('CDI')
    expect(listing.temps_travail).toBe('Temps plein')
    expect(listing.salaire_min).toBe(3500)
    expect(listing.salaire_max).toBe(4200)
    expect(listing.date_debut).toBe('2026-09-01')
    expect(listing.profil_recherche).toBe('Expérience officine')
  })

  it('maps INTERIM and part-time to board vocabulary', () => {
    const listing = toBoardListing({
      ...source,
      mission: { ...source.mission, contractType: 'INTERIM', tempsPlein: false },
    })
    expect(listing.type_contrat).toBe('Intérim')
    expect(listing.temps_travail).toBe('Temps partiel')
  })

  it('copies pharmacy geo when present, else publishes without pin', () => {
    expect(toBoardListing(source).latitude).toBe(45.76)
    const noGeo = toBoardListing({
      ...source,
      pharmacy: { ...source.pharmacy, latitude: null, longitude: null },
    })
    expect(noGeo.latitude).toBeNull()
    expect(noGeo.longitude).toBeNull()
    expect(noGeo.code_postal).toBe('69006')
    expect(noGeo.departement).toBe('69')
  })

  it('sets slug on insert and reuses listing id on republish', () => {
    const first = toBoardListing(source)
    expect(first.slug).toBe('pharmacien-cdi-lyon-lyon')
    expect(first.id).toBeUndefined()
    const again = toBoardListing({ ...source, boardListingId: 'board-uuid' })
    expect(again.id).toBe('board-uuid')
    expect(again.slug).toBeUndefined()
  })
})
