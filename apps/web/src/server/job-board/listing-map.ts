import type { BoardListing } from '@/server/job-board/port'
import {
  BOARD_ENTREPRISE,
  formatBoardOfferCity,
  formatBoardOfferTitle,
} from '@/server/job-board/format-board-offer'
import {
  boardContractLabel,
  boardDepartement,
  boardHoursLabel,
  boardListingSlug,
} from '@/server/job-board/listing-labels'
import type { ListingSource } from '@/server/job-board/listing-source'

export type { ListingSource } from '@/server/job-board/listing-source'

export function toBoardListing(source: ListingSource): BoardListing {
  const titre = formatBoardOfferTitle(source.mission.jobTitleName)
  const ville = formatBoardOfferCity(source.pharmacy.city)
  const listing: BoardListing = {
    titre,
    metier: source.mission.jobTitleName,
    description: source.content,
    entreprise: BOARD_ENTREPRISE,
    ville,
    code_postal: source.pharmacy.postalCode,
    departement: boardDepartement(source.pharmacy.postalCode),
    latitude: source.pharmacy.latitude,
    longitude: source.pharmacy.longitude,
    type_contrat: boardContractLabel(source.mission.contractType),
    temps_travail: boardHoursLabel(source.mission.tempsPlein),
    salaire_min: source.mission.salaireMin,
    salaire_max: source.mission.salaireMax,
    profil_recherche: source.mission.profilRecherche,
    date_debut: source.mission.startDate.toISOString().slice(0, 10),
    contact_email: source.contactEmail,
    publiee: true,
    mise_en_avant: false,
  }
  if (source.boardListingId) {
    listing.id = source.boardListingId
    return listing
  }
  listing.slug = boardListingSlug(titre, ville)
  return listing
}
