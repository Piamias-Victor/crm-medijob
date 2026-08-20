export type BoardListing = {
  id?: string
  titre: string
  metier: string
  description: string
  entreprise: string
  ville: string
  code_postal?: string | null
  departement?: string | null
  latitude?: number | null
  longitude?: number | null
  type_contrat: string
  temps_travail: string
  salaire_min?: number | null
  salaire_max?: number | null
  avantages?: string | null
  profil_recherche?: string | null
  date_debut?: string | null
  contact_email: string
  publiee: boolean
  mise_en_avant: boolean
  slug?: string
}

export type JobBoardListingsPort = {
  upsert: (listing: BoardListing) => Promise<{ id: string }>
  setPubliee: (id: string, publiee: boolean) => Promise<void>
}
